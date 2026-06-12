import { useState } from "react";
import "./Pacientes.css";
import PacienteForm from "./PacienteForm";

function PacienteModal({
  onClose,
  pacientes,
  setPacientes
}) {

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: ""
  });

  const salvarPaciente = () => {

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

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  if (!emailValido) {
    alert("Email inválido");
    return;
  }

  const novoPaciente = {
    id: Date.now(),
    ...formData
  };

  setPacientes([
    ...pacientes,
    novoPaciente
  ]);

  onClose();
};
  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Novo Paciente</h2>

        <PacienteForm
          formData={formData}
          setFormData={setFormData}
        />

        <div className="modal-actions">

          <button onClick={onClose}>
            Cancelar
          </button>

          <button onClick={salvarPaciente}>
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}

export default PacienteModal;