import { useState, useEffect } from "react";
import "./Agenda.css";
import { useClinica } from "../../context/ClinicaContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const CALENDAR_ID = "primary";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function Agenda() {
  const { atendimentos } = useClinica();
  const hoje = new Date();

  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [googleConectado, setGoogleConectado] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  // ─── Recupera token salvo ao carregar a página ────────────────────────────
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("google_token");
    if (tokenSalvo) {
      window._googleToken = tokenSalvo;
      setGoogleConectado(true);
    }
  }, []);

  // ─── Carrega Google Identity Services ────────────────────────────────────
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => inicializarGoogle();
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  function inicializarGoogle() {
    if (!window.google) return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.access_token) {
          window._googleToken = response.access_token;
          localStorage.setItem("google_token", response.access_token);
          setGoogleConectado(true);
        }
      },
    });
    setTokenClient(client);
  }

  function conectarGoogle() {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  }

  function desconectarGoogle() {
    localStorage.removeItem("google_token");
    window._googleToken = null;
    setGoogleConectado(false);
  }

  // ─── Sincronizar atendimento com Google Calendar ──────────────────────────
  async function sincronizarComGoogle(atendimento) {
    if (!window._googleToken) {
      alert("Conecte o Google Calendar primeiro.");
      return;
    }

    const [dia, mes, ano] = atendimento.data.split("/");
    const [hora, minuto] = atendimento.horario.split(":");

    const inicio = new Date(ano, mes - 1, dia, hora, minuto);
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

    const evento = {
      summary: `${atendimento.paciente} — ${atendimento.servico}`,
      description: `Profissional: ${atendimento.profissional}\nServiço: ${atendimento.servico}\nHorário: ${atendimento.horario}`,
      start: { dateTime: inicio.toISOString(), timeZone: "America/Sao_Paulo" },
      end: { dateTime: fim.toISOString(), timeZone: "America/Sao_Paulo" },
    };

    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${window._googleToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evento),
        }
      );

      if (res.ok) {
        return true;
      } else {
        const err = await res.json();
        // Token expirado — limpa e pede reconexão
        if (err.error?.code === 401) {
          desconectarGoogle();
          alert("Sessão do Google expirada. Por favor, conecte novamente.");
        } else {
          console.error("Erro Google Calendar:", err);
          alert("Erro ao adicionar ao Google Calendar.");
        }
        return false;
      }
    } catch (e) {
      console.error(e);
      alert("Erro de conexão com o Google Calendar.");
      return false;
    }
  }

  // ─── Sincronizar TODOS os atendimentos do mês ────────────────────────────
  async function sincronizarTodosMes() {
    if (!window._googleToken) {
      alert("Conecte o Google Calendar primeiro.");
      return;
    }

    const doMes = atendimentosDoDia(null, true);
    if (doMes.length === 0) {
      alert("Nenhum atendimento neste mês.");
      return;
    }

    setSincronizando(true);
    let sucesso = 0;
    for (const a of doMes) {
      const ok = await sincronizarComGoogle(a);
      if (ok) sucesso++;
    }
    setSincronizando(false);
    if (sucesso > 0) alert(`✅ ${sucesso} atendimento(s) sincronizado(s) com sucesso!`);
  }

  // ─── Helpers de calendário ───────────────────────────────────────────────
  function diasDoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
  }

  function primeiroDiaSemana(mes, ano) {
    return new Date(ano, mes, 1).getDay();
  }

function atendimentosDoDia(dia, todoMes = false) {
  return atendimentos.filter((a) => {
    if (!a.data) return false;

    // Suporta tanto "2026-06-19" quanto "19/06/2026"
    let d, m, y;
    if (a.data.includes("-")) {
      [y, m, d] = a.data.split("-");
    } else {
      [d, m, y] = a.data.split("/");
    }

    if (todoMes) {
      return parseInt(m) - 1 === mesAtual && parseInt(y) === anoAtual;
    }
    return (
      parseInt(d) === dia &&
      parseInt(m) - 1 === mesAtual &&
      parseInt(y) === anoAtual
    );
  });
}

  function mudarMes(direcao) {
    let novoMes = mesAtual + direcao;
    let novoAno = anoAtual;
    if (novoMes < 0) { novoMes = 11; novoAno--; }
    if (novoMes > 11) { novoMes = 0; novoAno++; }
    setMesAtual(novoMes);
    setAnoAtual(novoAno);
    setDiaSelecionado(1);
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  const totalDias = diasDoMes(mesAtual, anoAtual);
  const iniciaSemana = primeiroDiaSemana(mesAtual, anoAtual);
  const celulas = [
    ...Array(iniciaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  const atendimentosDiaSelecionado = atendimentosDoDia(diaSelecionado);

  const corStatus = {
    Agendado: "#4f6ef7",
    Confirmado: "#22c55e",
    Realizado: "#6b7280",
    Cancelado: "#ef4444",
  };

  return (
    <div className="agenda-page">

      <div className="agenda-header">
        <div>
          <h1>Agenda</h1>
          <p>{MESES[mesAtual]} {anoAtual}</p>
        </div>

        <div className="agenda-header-acoes">
          {!GOOGLE_CLIENT_ID ? (
            <div className="google-aviso">
              ⚙️ Configure o Google Calendar no <code>.env</code>
            </div>
          ) : googleConectado ? (
            <>
              <button
                className="btn-google conectado"
                onClick={sincronizarTodosMes}
                disabled={sincronizando}
              >
                {sincronizando ? "Sincronizando..." : "📅 Sincronizar mês com Google"}
              </button>
              <button className="btn-desconectar" onClick={desconectarGoogle}>
                Desconectar
              </button>
            </>
          ) : (
            <button className="btn-google" onClick={conectarGoogle}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt=""
                width={18}
              />
              Conectar Google Calendar
            </button>
          )}
        </div>
      </div>

      <div className="agenda-layout">

        <div className="calendario-card">
          <div className="calendario-nav">
            <button onClick={() => mudarMes(-1)}>‹</button>
            <span>{MESES[mesAtual]} {anoAtual}</span>
            <button onClick={() => mudarMes(1)}>›</button>
          </div>

          <div className="calendario-grid">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="dia-semana">{d}</div>
            ))}
            {celulas.map((dia, i) => {
              if (!dia) return <div key={`vazio-${i}`} />;
              const qtd = atendimentosDoDia(dia).length;
              const isHoje =
                dia === hoje.getDate() &&
                mesAtual === hoje.getMonth() &&
                anoAtual === hoje.getFullYear();
              const isSel = dia === diaSelecionado;

              return (
                <button
                  key={dia}
                  className={`dia-celula ${isHoje ? "hoje" : ""} ${isSel ? "selecionado" : ""}`}
                  onClick={() => setDiaSelecionado(dia)}
                >
                  <span>{dia}</span>
                  {qtd > 0 && <span className="dia-bolinha">{qtd}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lista-card">
          <h2>
            {diaSelecionado} de {MESES[mesAtual]}
            <span className="lista-count">
              {atendimentosDiaSelecionado.length} atendimento(s)
            </span>
          </h2>

          {atendimentosDiaSelecionado.length === 0 ? (
            <div className="lista-vazia">
              <span>📭</span>
              <p>Nenhum atendimento neste dia</p>
            </div>
          ) : (
            <div className="lista-atendimentos">
              {atendimentosDiaSelecionado
                .sort((a, b) => a.horario?.localeCompare(b.horario))
                .map((a) => (
                  <div key={a.id} className="atendimento-card">
                    <div
                      className="atendimento-barra"
                      style={{ background: corStatus[a.status] || "#ccc" }}
                    />
                    <div className="atendimento-info">
                      <div className="atendimento-topo">
                        <strong>{a.paciente}</strong>
                        <span className="atendimento-horario">🕐 {a.horario}</span>
                      </div>
                      <div className="atendimento-detalhes">
                        <span>👤 {a.profissional}</span>
                        <span>💆 {a.servico}</span>
                        <span
                          className="atendimento-status"
                          style={{ color: corStatus[a.status] }}
                        >
                          {a.status}
                        </span>
                      </div>
                    </div>

                    {googleConectado && (
                      <button
                        className="btn-sync-individual"
                        onClick={() => sincronizarComGoogle(a)}
                        disabled={sincronizando}
                        title="Adicionar ao Google Calendar"
                      >
                        📅
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agenda;