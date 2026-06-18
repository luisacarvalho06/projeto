const INSTANCE = import.meta.env.VITE_ZAPI_INSTANCE;
const TOKEN    = import.meta.env.VITE_ZAPI_TOKEN;
const BASE_URL = `https://api.z-api.io/instances/${INSTANCE}/token/${TOKEN}`;

function formatarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.startsWith("55")) return numeros;
  return `55${numeros}`;
}

// Envio base de mensagem de texto
async function enviarMensagem(telefone, mensagem) {
  if (!INSTANCE || !TOKEN) {
    console.warn("Z-API não configurada. Verifique o .env");
    return { ok: false, erro: "Z-API não configurada" };
  }

  const telefoneFormatado = formatarTelefone(telefone);

  try {
    const res = await fetch(`${BASE_URL}/send-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: telefoneFormatado,
        message: mensagem,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erro Z-API:", data);
      return { ok: false, erro: data?.message || "Erro desconhecido" };
    }

    return { ok: true, data };
  } catch (e) {
    console.error("Erro de conexão Z-API:", e);
    return { ok: false, erro: "Erro de conexão" };
  }
}

export async function enviarConfirmacaoAgendamento(paciente, telefone, atendimento) {
  const mensagem =
    `Olá, *${paciente}*! 👋\n\n` +
    `Seu agendamento foi confirmado com sucesso! ✅\n\n` +
    `📅 *Data:* ${formatarData(atendimento.data)}\n` +
    `🕐 *Horário:* ${atendimento.horario}\n` +
    `💆 *Serviço:* ${atendimento.servico}\n` +
    `👨‍⚕️ *Profissional:* ${atendimento.profissional}\n\n` +
    `Em caso de dúvidas ou para remarcar, entre em contato conosco.\n\n` +
    `_Consultório Terapêutico_ 🌿`;

  return enviarMensagem(telefone, mensagem);
}

export async function enviarLembrete24h(paciente, telefone, atendimento) {
  const mensagem =
    `Olá, *${paciente}*! 😊\n\n` +
    `Lembramos que você tem uma consulta *amanhã*! 🗓️\n\n` +
    `📅 *Data:* ${formatarData(atendimento.data)}\n` +
    `🕐 *Horário:* ${atendimento.horario}\n` +
    `💆 *Serviço:* ${atendimento.servico}\n` +
    `👨‍⚕️ *Profissional:* ${atendimento.profissional}\n\n` +
    `Por favor, confirme sua presença respondendo esta mensagem.\n\n` +
    `_Consultório Terapêutico_ 🌿`;

  return enviarMensagem(telefone, mensagem);
}

export async function enviarAvisoCancelamento(paciente, telefone, atendimento) {
  const mensagem =
    `Olá, *${paciente}*! 😔\n\n` +
    `Informamos que seu agendamento foi *cancelado*.\n\n` +
    `📅 *Data:* ${formatarData(atendimento.data)}\n` +
    `🕐 *Horário:* ${atendimento.horario}\n` +
    `💆 *Serviço:* ${atendimento.servico}\n\n` +
    `Entre em contato para remarcar seu atendimento.\n\n` +
    `_Consultório Terapêutico_ 🌿`;

  return enviarMensagem(telefone, mensagem);
}

export async function enviarMensagemPersonalizada(telefone, mensagem) {
  return enviarMensagem(telefone, mensagem);
}


function formatarData(data) {
  if (!data) return "";
  // Suporta "2026-06-19" e "19/06/2026"
  if (data.includes("-")) {
    const [y, m, d] = data.split("-");
    return `${d}/${m}/${y}`;
  }
  return data;
}