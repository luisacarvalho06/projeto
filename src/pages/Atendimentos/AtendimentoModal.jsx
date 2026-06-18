import { useState } from "react";
import AtendimentoForm from "./AtendimentoForm";
import { useClinica } from "../../context/ClinicaContext";
import { enviarConfirmacaoAgendamento } from "../../services/whatsappService";

function AtendimentoModal({ onClose, atendimentoEditando }) {
  const { atendimentos, salvarAtendimento, pacientes } = useClinica();

  const [formData, setFormData] = useState(
    atendimentoEditando || {
      paciente: "", profissional: "", servico: "",
      data: "", horario: "", status: "", observacoes: "",
    }
  );

  const handleSalvar = async () => {
    if (!formData.paciente || !formData.profissional || !formData.servico ||
        !formData.data || !formData.horario || !formData.status) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const conflito = atendimentos.some(
      (a) => a.id !== atendimentoEditando?.id &&
             a.profissional === formData.profissional &&
             a.data === formData.data && a.horario === formData.horario
    );
    if (conflito) {
      alert("Já existe um atendimento agendado para este profissional nesse horário.");
      return;
    }

    const pacienteDuplicado = atendimentos.some(
      (a) => a.id !== atendimentoEditando?.id &&
             a.paciente === formData.paciente &&
             a.data === formData.data && a.horario === formData.horario
    );
    if (pacienteDuplicado) {
      alert("Este paciente já possui um atendimento agendado nesse horário.");
      return;
    }

    const dados = atendimentoEditando
      ? { ...formData, id: atendimentoEditando.id }
      : formData;

    const resultado = await salvarAtendimento(dados);

    if (resultado) {
      // Enviar WhatsApp de confirmação automaticamente (só para novos agendamentos)
      if (!atendimentoEditando) {
        const paciente = pacientes.find(
          (p) => p.nome.toLowerCase() === formData.paciente.toLowerCase()
        );
        if (paciente?.telefone) {
          enviarConfirmacaoAgendamento(paciente.nome, paciente.telefone, formData)
            .then((res) => {
              if (res.ok) console.log("✅ WhatsApp de confirmação enviado");
              else console.warn("⚠️ WhatsApp não enviado:", res.erro);
            });
        }
      }
      onClose();
    } else {
      alert("Erro ao salvar atendimento. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{atendimentoEditando ? "Editar Atendimento" : "Novo Atendimento"}</h2>
        <AtendimentoForm formData={formData} setFormData={setFormData} />
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default AtendimentoModal;