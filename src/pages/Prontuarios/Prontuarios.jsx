import { useState } from "react";
import "./Prontuarios.css";

import ProntuarioTabela from "./ProntuarioTabela";
import ProntuarioModal from "./ProntuarioModal";
import { useClinica } from "../../context/ClinicaContext";

function Prontuarios() {

    const [showModal, setShowModal] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [prontuarioEditando, setProntuarioEditando] = useState(null);
    const { prontuarios, setProntuarios } = useClinica();
    const prontuariosFiltrados = prontuarios.filter(
        (prontuario) =>
            prontuario.paciente
                .toLowerCase()
                .includes(
                    pesquisa.toLowerCase()
                )
    );

    const excluirProntuario = (id) => {

        const confirmar = window.confirm(
            "Deseja realmente excluir este prontuário?"
        );

        if (!confirmar) return;

        setProntuarios(
            prontuarios.filter(
                (prontuario) =>
                    prontuario.id !== id
            )
        );
    };

    return (
        <div className="prontuarios-page">

            <div className="page-header">

                <h1>Prontuários</h1>

                <button
                    className="novo-btn"
                    onClick={() => {
                        setProntuarioEditando(null);
                        setShowModal(true);
                    }}
                >
                    + Novo Prontuário
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

            <ProntuarioTabela
                prontuarios={prontuariosFiltrados}
                onEditar={(prontuario) => {
                    setProntuarioEditando(prontuario);
                    setShowModal(true);
                }}
                excluirProntuario={excluirProntuario}
            />

            {showModal && (
                <ProntuarioModal
                    onClose={() => setShowModal(false)}
                    prontuarioEditando={prontuarioEditando}
                />
            )}

        </div>
    );
}

export default Prontuarios;