import { useState } from "react";
import AtendimentoForm from "./AtendimentoForm";
import { useClinica } from "../../context/ClinicaContext";

function AtendimentoModal({ onClose, atendimentoEditando }) {
  const { atendimentos, salvarAtendimento } = useClinica();

  const [formData, setFormData] = useState(
    atendimentoEditando || {
      paciente: "",
      profissional: "",
      servico: "",
      data: "",
      horario: "",
      status: "",
      observacoes: "",
    }
  );

  const handleSalvar = async () => {
    if (
      !formData.paciente ||
      !formData.profissional ||
      !formData.servico ||
      !formData.data ||
      !formData.horario ||
      !formData.status
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const conflito = atendimentos.some(
      (atendimento) =>
        atendimento.id !== atendimentoEditando?.id &&
        atendimento.profissional === formData.profissional &&
        atendimento.data === formData.data &&
        atendimento.horario === formData.horario
    );

    if (conflito) {
      alert(
        "Já existe um atendimento agendado para este profissional nesse horário."
      );
      return;
    }

    const pacienteDuplicado = atendimentos.some(
      (atendimento) =>
        atendimento.id !== atendimentoEditando?.id &&
        atendimento.paciente === formData.paciente &&
        atendimento.data === formData.data &&
        atendimento.horario === formData.horario
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
      onClose();
    } else {
      alert("Erro ao salvar atendimento. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {atendimentoEditando ? "Editar Atendimento" : "Novo Atendimento"}
        </h2>

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