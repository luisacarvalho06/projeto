import { useState } from "react";
import "./Atendimentos.css";

import AtendimentoTabela from "./AtendimentoTabela";
import AtendimentoModal from "./AtendimentoModal";

function Atendimentos() {

    const [showModal, setShowModal] = useState(false);
    const [atendimentos, setAtendimentos] = useState([]);

    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [atendimentoEditando, setAtendimentoEditando] = useState(null);
    const atendimentosFiltrados = atendimentos.filter(
        (atendimento) => {

            const pacienteMatch =
                atendimento.paciente
                    .toLowerCase()
                    .includes(
                        pesquisa.toLowerCase()
                    );

            const statusMatch =
                filtroStatus === "" ||
                atendimento.status === filtroStatus;

            return pacienteMatch && statusMatch;
        }
    );
    const excluirAtendimento = (id) => {

        const confirmar = window.confirm(
            "Deseja realmente excluir este atendimento?"
        );

        if (!confirmar) return;

        setAtendimentos(
            atendimentos.filter(
                (atendimento) => atendimento.id !== id
            )
        );
    };

    return (
        <div>

            <div className="page-header">

                <h1>Atendimentos</h1>

                <button
                    className="novo-btn"
                    onClick={() => {
                        setAtendimentoEditando(null);
                        setShowModal(true);
                    }}
                >
                    + Novo Atendimento
                </button>

            </div>

            <div className="filtros">

                <input
                    type="text"
                    placeholder="Pesquisar paciente..."
                    value={pesquisa}
                    onChange={(e) =>
                        setPesquisa(e.target.value)
                    }
                />

                <select
                    value={filtroStatus}
                    onChange={(e) =>
                        setFiltroStatus(e.target.value)
                    }
                >
                    <option value="">
                        Todos os Status
                    </option>

                    <option value="Agendado">
                        Agendado
                    </option>

                    <option value="Confirmado">
                        Confirmado
                    </option>

                    <option value="Realizado">
                        Realizado
                    </option>

                    <option value="Cancelado">
                        Cancelado
                    </option>

                </select>

            </div>

            <AtendimentoTabela
                atendimentos={atendimentosFiltrados}
                onEditar={(atendimento) => {
                    setAtendimentoEditando(atendimento);
                    setShowModal(true);
                }}
                excluirAtendimento={excluirAtendimento}
            />

            {showModal && (
                <AtendimentoModal
                    onClose={() => setShowModal(false)}
                    atendimentos={atendimentos}
                    setAtendimentos={setAtendimentos}
                    atendimentoEditando={atendimentoEditando}
                />
            )}

        </div>
    );
}

export default Atendimentos;