import { useState } from "react";
import "./Pacientes.css";
import PacienteForm from "./PacienteForm";
import { useClinica } from "../../context/ClinicaContext";

function PacienteModal({ onClose, pacienteEditando }) {
  const { salvarPaciente } = useClinica();

  const [formData, setFormData] = useState(
    pacienteEditando || {
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
    }
  );

  const handleSalvar = async () => {
    if (!formData.nome.trim()) {
      alert("Informe o nome do paciente");
      return;
    }

    if (formData.cpf.length !== 14) {
      alert("CPF inválido");
      return;
    }

    if (formData.telefone.length !== 15) {
      alert("Telefone inválido");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!emailValido) {
      alert("Email inválido");
      return;
    }

    const dados = pacienteEditando
      ? { ...formData, id: pacienteEditando.id }
      : formData;

    const resultado = await salvarPaciente(dados);

    if (resultado) {
      onClose();
    } else {
      alert("Erro ao salvar paciente. Tente novamente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{pacienteEditando ? "Editar Paciente" : "Novo Paciente"}</h2>

        <PacienteForm formData={formData} setFormData={setFormData} />

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar}>
            {pacienteEditando ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PacienteModal;