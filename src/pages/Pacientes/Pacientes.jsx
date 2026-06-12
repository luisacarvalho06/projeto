import { useState } from "react";
import "./Pacientes.css";

import PacienteTabela from "./PacienteTabela";
import PacienteModal from "./PacienteModal";

function Pacientes() {

  const [showModal, setShowModal] = useState(false);

  const [pacientes, setPacientes] = useState([]);

  return (
    <div>

      <div className="page-header">

        <h1>Pacientes</h1>

        <button
          onClick={() => setShowModal(true)}
        >
          + Novo Paciente
        </button>

      </div>

      <PacienteTabela pacientes={pacientes} />

      {showModal && (
        <PacienteModal
          onClose={() => setShowModal(false)}
          pacientes={pacientes}
          setPacientes={setPacientes}
        />
      )}

    </div>
  );
}

export default Pacientes;