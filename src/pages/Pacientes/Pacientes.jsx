import { useState } from "react";
import "./Pacientes.css";

import PacienteTabela from "./PacienteTabela";
import PacienteModal from "./PacienteModal";

function Pacientes() {

  const [showModal, setShowModal] = useState(false);

  const [pacientes, setPacientes] = useState([]);

  const [pesquisa, setPesquisa] = useState("");

  const [pacienteEditando, setPacienteEditando] = useState(null);

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(
      pesquisa.toLowerCase()
    )
  );

  return (
    <div className="pacientes-page">

      <div className="page-header">

        <h1>Pacientes</h1>

        <button
          onClick={() => {
            setPacienteEditando(null);
            setShowModal(true);
          }}
        >
          + Novo Paciente
        </button>

      </div>

      <input
        className="campo-pesquisa"
        type="text"
        placeholder="Pesquisar paciente..."
        value={pesquisa}
        onChange={(e) =>
          setPesquisa(e.target.value)
        }
      />
      <div className="tabela-container">
      <PacienteTabela
        pacientes={pacientesFiltrados}
        setPacientes={setPacientes}
        pacientesOriginais={pacientes}
        onEditar={(paciente) => {
          setPacienteEditando(paciente);
          setShowModal(true);
        }}
      />

      {showModal && (
        <PacienteModal
          onClose={() => setShowModal(false)}
          pacientes={pacientes}
          setPacientes={setPacientes}
          pacienteEditando={pacienteEditando}
        />
      )}
      </div>

    </div>
  );
}

export default Pacientes;;