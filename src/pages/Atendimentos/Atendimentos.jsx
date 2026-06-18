import { useState } from "react";
import "./Atendimentos.css";

import AtendimentoTabela from "./AtendimentoTabela";
import AtendimentoModal from "./AtendimentoModal";
import ProntuarioModal from "../Prontuarios/ProntuarioModal";
import { useClinica } from "../../context/ClinicaContext";

function Atendimentos() {
    const [showModal, setShowModal] = useState(false);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [showProntuario, setShowProntuario] = useState(false);
    const [prontuarioEditando, setProntuarioEditando] = useState(null);
    const [atendimentoEditando, setAtendimentoEditando] = useState(null);

    const {
        atendimentos,        // ← agora vem do context/Supabase
        excluirAtendimento,  // ← função do context
        prontuarios,
        setProntuarios,
    } = useClinica();

    const atendimentosFiltrados = atendimentos.filter((atendimento) => {
        const pacienteMatch = atendimento.paciente
            .toLowerCase()
            .includes(pesquisa.toLowerCase());

        const statusMatch =
            filtroStatus === "" || atendimento.status === filtroStatus;

        return pacienteMatch && statusMatch;
    });

    const handleExcluir = async (id) => {
        const confirmar = window.confirm(
            "Deseja realmente excluir este atendimento?"
        );
        if (!confirmar) return;
        await excluirAtendimento(id);
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
                    onChange={(e) => setPesquisa(e.target.value)}
                />

                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option value="">Todos os Status</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>

            <AtendimentoTabela
                atendimentos={atendimentosFiltrados}
                onEditar={(atendimento) => {
                    setAtendimentoEditando(atendimento);
                    setShowModal(true);
                }}
                excluirAtendimento={handleExcluir}
                onAbrirProntuario={(atendimento) => {
                    const prontuarioExistente = prontuarios.find(
                        (p) => p.paciente === atendimento.paciente
                    );

                    setProntuarioEditando(
                        prontuarioExistente || {
                            paciente: atendimento.paciente,
                            dataCriacao: new Date().toLocaleDateString("pt-BR"),
                            queixaPrincipal: "",
                            historicoClinico: "",
                            avaliacaoFisica: "",
                            planoTerapeutico: "",
                            observacoes: "",
                            evolucoes: [],
                        }
                    );

                    setShowProntuario(true);
                }}
            />

            {showModal && (
                <AtendimentoModal
                    onClose={() => setShowModal(false)}
                    atendimentoEditando={atendimentoEditando}
                />
            )}

            {showProntuario && (
                <ProntuarioModal
                    onClose={() => setShowProntuario(false)}
                    prontuarioEditando={prontuarioEditando}
                />
            )}
        </div>
    );
}

export default Atendimentos;