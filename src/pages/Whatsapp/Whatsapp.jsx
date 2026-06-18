import { useState } from "react";
import "./Whatsapp.css";
import { useClinica } from "../../context/ClinicaContext";
import {
  enviarConfirmacaoAgendamento,
  enviarLembrete24h,
  enviarAvisoCancelamento,
  enviarMensagemPersonalizada,
} from "../../services/whatsappService";

const INSTANCE = import.meta.env.VITE_ZAPI_INSTANCE;
const TOKEN    = import.meta.env.VITE_ZAPI_TOKEN;

function Whatsapp() {
  const { pacientes, atendimentos } = useClinica();

  const [aba, setAba] = useState("enviar");
  const [enviando, setEnviando] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [mensagemCustom, setMensagemCustom] = useState("");
  const [tipoLembrete, setTipoLembrete] = useState("confirmacao");

  function adicionarLog(tipo, texto) {
    setLogs((prev) => [
      { id: Date.now(), tipo, texto, hora: new Date().toLocaleTimeString("pt-BR") },
      ...prev,
    ]);
  }

  function buscarTelefone(nomePaciente) {
    const p = pacientes.find((p) => p.nome.toLowerCase() === nomePaciente?.toLowerCase());
    return p?.telefone || null;
  }

  async function handleEnviarCustom() {
    if (!pacienteSelecionado || !mensagemCustom.trim()) {
      alert("Selecione um paciente e escreva a mensagem.");
      return;
    }
    const paciente = pacientes.find((p) => p.nome === pacienteSelecionado);
    if (!paciente?.telefone) {
      alert("Este paciente não possui telefone cadastrado.");
      return;
    }
    setEnviando(true);
    const resultado = await enviarMensagemPersonalizada(paciente.telefone, mensagemCustom);
    if (resultado.ok) {
      adicionarLog("sucesso", `✅ Mensagem enviada para ${paciente.nome}`);
      setMensagemCustom("");
    } else {
      adicionarLog("erro", `❌ Erro ao enviar para ${paciente.nome}: ${resultado.erro}`);
    }
    setEnviando(false);
  }

  async function handleEnviarMassa() {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const amanhaStr = amanha.toISOString().split("T")[0];

    let filtrados = [];
    if (tipoLembrete === "confirmacao") {
      filtrados = atendimentos.filter((a) => a.status === "Agendado");
    } else if (tipoLembrete === "lembrete24h") {
      filtrados = atendimentos.filter((a) => a.data === amanhaStr && a.status !== "Cancelado");
    } else if (tipoLembrete === "cancelados") {
      filtrados = atendimentos.filter((a) => a.status === "Cancelado");
    }

    if (filtrados.length === 0) {
      alert("Nenhum atendimento encontrado para este tipo de lembrete.");
      return;
    }

    const confirmar = window.confirm(`Enviar mensagens para ${filtrados.length} paciente(s)?`);
    if (!confirmar) return;

    setEnviando(true);
    for (const atendimento of filtrados) {
      const telefone = buscarTelefone(atendimento.paciente);
      if (!telefone) {
        adicionarLog("aviso", `⚠️ ${atendimento.paciente} sem telefone cadastrado`);
        continue;
      }
      let resultado;
      if (tipoLembrete === "confirmacao") {
        resultado = await enviarConfirmacaoAgendamento(atendimento.paciente, telefone, atendimento);
      } else if (tipoLembrete === "lembrete24h") {
        resultado = await enviarLembrete24h(atendimento.paciente, telefone, atendimento);
      } else if (tipoLembrete === "cancelados") {
        resultado = await enviarAvisoCancelamento(atendimento.paciente, telefone, atendimento);
      }
      if (resultado?.ok) {
        adicionarLog("sucesso", `✅ Mensagem enviada para ${atendimento.paciente}`);
      } else {
        adicionarLog("erro", `❌ Erro: ${atendimento.paciente} — ${resultado?.erro}`);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    setEnviando(false);
  }

  const configurado = INSTANCE && TOKEN;

  return (
    <div className="whatsapp-page">
      <div className="whatsapp-header">
        <div>
          <h1>💬 WhatsApp</h1>
          <p>Envie mensagens automáticas para seus pacientes</p>
        </div>
        <div className={`zapi-status ${configurado ? "ok" : "erro"}`}>
          {configurado ? "✅ Z-API Configurada" : "⚠️ Z-API não configurada"}
        </div>
      </div>

      {!configurado && (
        <div className="whatsapp-aviso">
          <strong>Configure a Z-API no seu <code>.env</code>:</strong>
          <pre>{`VITE_ZAPI_INSTANCE=seu_instance_id\nVITE_ZAPI_TOKEN=seu_token`}</pre>
        </div>
      )}

      <div className="whatsapp-abas">
        <button className={aba === "enviar" ? "ativo" : ""} onClick={() => setAba("enviar")}>✉️ Mensagem Individual</button>
        <button className={aba === "massa" ? "ativo" : ""} onClick={() => setAba("massa")}>📢 Envio em Massa</button>
        <button className={aba === "logs" ? "ativo" : ""} onClick={() => setAba("logs")}>
          📋 Histórico {logs.length > 0 && <span className="badge">{logs.length}</span>}
        </button>
      </div>

      <div className="whatsapp-content">

        {aba === "enviar" && (
          <div className="whatsapp-card">
            <h2>Enviar mensagem para um paciente</h2>
            <div className="wpp-field">
              <label>Paciente</label>
              <select value={pacienteSelecionado} onChange={(e) => setPacienteSelecionado(e.target.value)}>
                <option value="">Selecione um paciente...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome} {!p.telefone ? "⚠️ sem telefone" : ""}
                  </option>
                ))}
              </select>
            </div>

            {pacienteSelecionado && (
              <div className="wpp-telefone">
                📱 {buscarTelefone(pacienteSelecionado) || "Telefone não cadastrado"}
              </div>
            )}

            <div className="wpp-field">
              <label>Mensagem</label>
              <textarea
                rows={6}
                placeholder="Digite sua mensagem... Use *negrito* para destacar."
                value={mensagemCustom}
                onChange={(e) => setMensagemCustom(e.target.value)}
              />
              <span className="wpp-chars">{mensagemCustom.length} caracteres</span>
            </div>

            <button className="wpp-btn-enviar" onClick={handleEnviarCustom} disabled={enviando || !configurado}>
              {enviando ? "Enviando..." : "Enviar mensagem"}
            </button>
          </div>
        )}

        {aba === "massa" && (
          <div className="whatsapp-card">
            <h2>Envio em massa</h2>
            <p className="wpp-desc">Selecione o tipo e envie para todos os pacientes elegíveis.</p>

            <div className="wpp-tipos">
              <button className={`wpp-tipo-card ${tipoLembrete === "confirmacao" ? "ativo" : ""}`} onClick={() => setTipoLembrete("confirmacao")}>
                <span>✅</span>
                <strong>Confirmação de Agendamento</strong>
                <p>Envia para todos com status "Agendado"</p>
              </button>
              <button className={`wpp-tipo-card ${tipoLembrete === "lembrete24h" ? "ativo" : ""}`} onClick={() => setTipoLembrete("lembrete24h")}>
                <span>🔔</span>
                <strong>Lembrete 24h Antes</strong>
                <p>Envia para atendimentos de amanhã</p>
              </button>
              <button className={`wpp-tipo-card ${tipoLembrete === "cancelados" ? "ativo" : ""}`} onClick={() => setTipoLembrete("cancelados")}>
                <span>❌</span>
                <strong>Aviso de Cancelamento</strong>
                <p>Envia para atendimentos cancelados</p>
              </button>
            </div>

            <button className="wpp-btn-enviar" onClick={handleEnviarMassa} disabled={enviando || !configurado}>
              {enviando ? "Enviando..." : "📢 Enviar para todos"}
            </button>
          </div>
        )}

        {aba === "logs" && (
          <div className="whatsapp-card">
            <div className="wpp-logs-header">
              <h2>Histórico de envios</h2>
              {logs.length > 0 && <button className="wpp-limpar" onClick={() => setLogs([])}>Limpar</button>}
            </div>
            {logs.length === 0 ? (
              <div className="wpp-vazio"><span>📭</span><p>Nenhuma mensagem enviada ainda</p></div>
            ) : (
              <div className="wpp-logs">
                {logs.map((log) => (
                  <div key={log.id} className={`wpp-log-item ${log.tipo}`}>
                    <span>{log.texto}</span>
                    <span className="wpp-log-hora">{log.hora}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Whatsapp;