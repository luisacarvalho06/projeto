import { useState } from "react";
import "./Pacientes.css";
import { useClinica } from "../../context/ClinicaContext";
import PacienteTabela from "./PacienteTabela";
import PacienteModal from "./PacienteModal";

function Pacientes() {

  const [showModal, setShowModal] = useState(false);

  const { pacientes, setPacientes } = useClinica();

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

      </div>

      {showModal && (
        <PacienteModal
          onClose={() => setShowModal(false)}
          pacienteEditando={pacienteEditando}
        />
      )}

    </div>
  );
}

export default Pacientes;