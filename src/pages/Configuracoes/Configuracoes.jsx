import { useState, useEffect } from "react";
import "./Configuracoes.css";

const STORAGE_KEY = "clinica_configuracoes";

const defaultConfig = {
  clinica: {
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
  },
  tema: "claro",
  notificacoes: {
    novoAgendamento: true,
    cancelamento: true,
    lembrete: true,
    whatsapp: false,
  },
};

function mascaraTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function Configuracoes() {
  const [config, setConfig] = useState(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : defaultConfig;
  });

  const [salvando, setSalvando] = useState(false);
  const [salvoOk, setSalvoOk] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("clinica");

  // Aplica o tema no <html> ao carregar e ao mudar
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", config.tema);
  }, [config.tema]);

  const atualizarClinica = (campo, valor) => {
    setConfig((prev) => ({
      ...prev,
      clinica: { ...prev.clinica, [campo]: valor },
    }));
  };

  const atualizarNotificacao = (campo) => {
    setConfig((prev) => ({
      ...prev,
      notificacoes: {
        ...prev.notificacoes,
        [campo]: !prev.notificacoes[campo],
      },
    }));
  };

  const mudarTema = (tema) => {
    setConfig((prev) => ({ ...prev, tema }));
    document.documentElement.setAttribute("data-theme", tema);
  };

  const salvar = async () => {
    setSalvando(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSalvando(false);
    setSalvoOk(true);
    setTimeout(() => setSalvoOk(false), 2500);
  };

  const abas = [
    { id: "clinica", label: "🏥 Clínica" },
    { id: "tema", label: "🎨 Tema" },
    { id: "notificacoes", label: "🔔 Notificações" },
  ];

  return (
    <div className="config-page">
      <div className="config-header">
        <h1>Configurações</h1>
        <p>Personalize o sistema da sua clínica</p>
      </div>

      <div className="config-layout">
        <nav className="config-nav">
          {abas.map((aba) => (
            <button
              key={aba.id}
              className={`config-nav-item ${abaAtiva === aba.id ? "ativo" : ""}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </nav>

        <div className="config-content">

          {/* ── Clínica ── */}
          {abaAtiva === "clinica" && (
            <section className="config-section">
              <h2>Dados da Clínica</h2>
              <p className="config-desc">
                Estas informações aparecem nos relatórios e mensagens enviadas aos pacientes.
              </p>

              <div className="config-form">
                <div className="config-field">
                  <label>Nome da clínica</label>
                  <input
                    type="text"
                    placeholder="Ex: Clínica Fisio Bem Estar"
                    value={config.clinica.nome}
                    onChange={(e) => atualizarClinica("nome", e.target.value)}
                  />
                </div>

                <div className="config-field">
                  <label>Telefone</label>
                  <input
                    type="text"
                    placeholder="(61) 99999-9999"
                    value={config.clinica.telefone}
                    onChange={(e) =>
                      atualizarClinica("telefone", mascaraTelefone(e.target.value))
                    }
                  />
                </div>

                <div className="config-field">
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="contato@clinica.com.br"
                    value={config.clinica.email}
                    onChange={(e) => atualizarClinica("email", e.target.value)}
                  />
                </div>

                <div className="config-field">
                  <label>Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, número, bairro, cidade"
                    value={config.clinica.endereco}
                    onChange={(e) => atualizarClinica("endereco", e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Tema ── */}
          {abaAtiva === "tema" && (
            <section className="config-section">
              <h2>Aparência</h2>
              <p className="config-desc">
                Escolha como o sistema vai aparecer para você.
              </p>

              <div className="tema-opcoes">
                <button
                  className={`tema-card ${config.tema === "claro" ? "ativo" : ""}`}
                  onClick={() => mudarTema("claro")}
                >
                  <div className="tema-preview claro">
                    <div className="preview-barra" />
                    <div className="preview-linhas">
                      <span /><span /><span />
                    </div>
                  </div>
                  <span>Claro</span>
                  {config.tema === "claro" && <div className="tema-check">✓</div>}
                </button>

                <button
                  className={`tema-card ${config.tema === "escuro" ? "ativo" : ""}`}
                  onClick={() => mudarTema("escuro")}
                >
                  <div className="tema-preview escuro">
                    <div className="preview-barra" />
                    <div className="preview-linhas">
                      <span /><span /><span />
                    </div>
                  </div>
                  <span>Escuro</span>
                  {config.tema === "escuro" && <div className="tema-check">✓</div>}
                </button>
              </div>
            </section>
          )}

          {/* ── Notificações ── */}
          {abaAtiva === "notificacoes" && (
            <section className="config-section">
              <h2>Notificações</h2>
              <p className="config-desc">
                Escolha quais eventos geram notificações no sistema.
              </p>

              <div className="notif-lista">
                {[
                  { id: "novoAgendamento", label: "Novo agendamento", desc: "Notificar quando um atendimento for criado" },
                  { id: "cancelamento", label: "Cancelamento", desc: "Notificar quando um atendimento for cancelado" },
                  { id: "lembrete", label: "Lembrete de consulta", desc: "Notificar antes do horário do atendimento" },
                  { id: "whatsapp", label: "WhatsApp", desc: "Enviar notificações via WhatsApp para os pacientes" },
                ].map((item) => (
                  <div key={item.id} className="notif-item">
                    <div className="notif-info">
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    <button
                      className={`toggle ${config.notificacoes[item.id] ? "on" : ""}`}
                      onClick={() => atualizarNotificacao(item.id)}
                    >
                      <span className="toggle-bolinha" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="config-footer">
            <button
              className={`salvar-btn ${salvoOk ? "ok" : ""}`}
              onClick={salvar}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : salvoOk ? "✓ Salvo!" : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;