import { useMemo } from "react";
import { useClinica } from "../../context/ClinicaContext";
import { useNavigate } from "react-router-dom";
import "./DashboardHome.css";

const MESES = [
  "Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];

const corStatus = {
  Agendado:  { bg: "#eff6ff", color: "#4f6ef7" },
  Confirmado:{ bg: "#f0fdf4", color: "#22c55e" },
  Realizado: { bg: "#f9fafb", color: "#6b7280" },
  Cancelado: { bg: "#fef2f2", color: "#ef4444" },
};

function DashboardHome() {
  const { pacientes, atendimentos, profissionais } = useClinica();
  const navigate = useNavigate();
  const hoje = new Date();
  const hojeStr = hoje.toISOString().split("T")[0];

  const atendimentosHoje = useMemo(() =>
    atendimentos.filter((a) => a.data === hojeStr),
    [atendimentos, hojeStr]
  );

  const atendimentosMes = useMemo(() =>
    atendimentos.filter((a) => {
      if (!a.data) return false;
      const d = new Date(a.data);
      return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    }),
    [atendimentos]
  );

  const proximosAtendimentos = useMemo(() =>
    atendimentos
      .filter((a) => a.data >= hojeStr && a.status !== "Cancelado")
      .sort((a, b) => a.data?.localeCompare(b.data) || a.horario?.localeCompare(b.horario))
      .slice(0, 6),
    [atendimentos, hojeStr]
  );

  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const iniciaSemana = new Date(ano, mes, 1).getDay();
  const celulas = [
    ...Array(iniciaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  function temAtendimento(dia) {
    const d = String(dia).padStart(2, "0");
    const m = String(mes + 1).padStart(2, "0");
    return atendimentos.some((a) => a.data === `${ano}-${m}-${d}`);
  }

  const cards = [
    { label: "Total de Pacientes",     valor: pacientes.length,           icon: "👥", cor: "#4f6ef7", bg: "#eff6ff", rota: "pacientes"     },
    { label: "Atendimentos Hoje",      valor: atendimentosHoje.length,    icon: "📋", cor: "#22c55e", bg: "#f0fdf4", rota: "atendimentos"   },
    { label: "Profissionais",          valor: profissionais.length,        icon: "👨‍⚕️", cor: "#f59e0b", bg: "#fffbeb", rota: "profissionais"  },
    { label: "Atendimentos no Mês",   valor: atendimentosMes.length,     icon: "📅", cor: "#8b5cf6", bg: "#f5f3ff", rota: "agenda"         },
  ];

  return (
    <div className="dh-page">
      <div className="dh-greeting">
        <div>
          <h1>Olá! 👋</h1>
          <p>{hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <button className="dh-btn-novo" onClick={() => navigate("atendimentos")}>
          + Novo Atendimento
        </button>
      </div>

      <div className="dh-cards">
        {cards.map((c) => (
          <button key={c.label} className="dh-card" onClick={() => navigate(c.rota)}>
            <div className="dh-card-icon" style={{ background: c.bg, color: c.cor }}>{c.icon}</div>
            <div className="dh-card-info">
              <span className="dh-card-label">{c.label}</span>
              <span className="dh-card-valor" style={{ color: c.cor }}>{c.valor}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="dh-bottom">
        <div className="dh-lista-card">
          <div className="dh-section-header">
            <h2>Próximos Atendimentos</h2>
            <button onClick={() => navigate("atendimentos")}>Ver todos →</button>
          </div>

          {proximosAtendimentos.length === 0 ? (
            <div className="dh-vazio"><span>📭</span><p>Nenhum atendimento próximo</p></div>
          ) : (
            <div className="dh-lista">
              {proximosAtendimentos.map((a) => {
                const [y, m, d] = a.data?.split("-") || [];
                const dataFormatada = d && m ? `${d}/${m}` : a.data;
                const st = corStatus[a.status] || { bg: "#f3f4f6", color: "#666" };
                return (
                  <div key={a.id} className="dh-item">
                    <div className="dh-item-avatar">{a.paciente?.charAt(0).toUpperCase()}</div>
                    <div className="dh-item-info">
                      <strong>{a.paciente}</strong>
                      <span>{a.servico} · {a.profissional}</span>
                    </div>
                    <div className="dh-item-direita">
                      <span className="dh-item-data">{dataFormatada} às {a.horario}</span>
                      <span className="dh-item-status" style={{ background: st.bg, color: st.color }}>{a.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dh-cal-card">
          <div className="dh-section-header">
            <h2>{MESES[mes]} {ano}</h2>
            <button onClick={() => navigate("agenda")}>Ver agenda →</button>
          </div>
          <div className="dh-cal-grid">
            {["D","S","T","Q","Q","S","S"].map((d, i) => (
              <div key={i} className="dh-cal-header">{d}</div>
            ))}
            {celulas.map((dia, i) => {
              if (!dia) return <div key={`v-${i}`} />;
              const isHoje = dia === hoje.getDate();
              const temAten = temAtendimento(dia);
              return (
                <button key={dia} className={`dh-cal-dia ${isHoje ? "hoje" : ""}`} onClick={() => navigate("agenda")}>
                  {dia}
                  {temAten && <span className="dh-cal-dot" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;