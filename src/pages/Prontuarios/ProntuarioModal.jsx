import { useState, useEffect } from "react";
import ProntuarioForm from "./ProntuarioForm";
import { useClinica } from "../../context/ClinicaContext";

function ProntuarioModal({ onClose, prontuarioEditando }) {
  const { salvarProntuario, salvarEvolucao } = useClinica();

  const [formData, setFormData] = useState({
    paciente: "",
    dataCriacao: "",
    queixaPrincipal: "",
    historicoClinico: "",
    avaliacaoFisica: "",
    planoTerapeutico: "",
    observacoes: "",
  });

  const [novaEvolucao, setNovaEvolucao] = useState("");

  useEffect(() => {
    if (prontuarioEditando) {
      setFormData({
        ...prontuarioEditando,
      });
    } else {
      setFormData({
        paciente: "",
        dataCriacao: new Date().toLocaleDateString("pt-BR"),
        queixaPrincipal: "",
        historicoClinico: "",
        avaliacaoFisica: "",
        planoTerapeutico: "",
        observacoes: "",
      });
    }
  }, [prontuarioEditando]);

  const handleSalvar = async () => {
    if (!formData.paciente || !formData.queixaPrincipal) {
      alert("Paciente e Queixa Principal são obrigatórios.");
      return;
    }

    const dados = prontuarioEditando
      ? { ...formData, id: prontuarioEditando.id }
      : formData;

    const resultado = await salvarProntuario(dados);

    if (resultado) {
      onClose();
    } else {
      alert("Erro ao salvar prontuário. Tente novamente.");
    }
  };

  const handleAdicionarEvolucao = async () => {
    if (!novaEvolucao.trim()) return;

    // Precisa que o prontuário já exista no Supabase
    if (!prontuarioEditando?.id) {
      alert("Salve o prontuário primeiro antes de adicionar evoluções.");
      return;
    }

    const evolucao = {
      prontuario_id: prontuarioEditando.id,
      data: new Date().toLocaleDateString("pt-BR"),
      descricao: novaEvolucao,
    };

    const resultado = await salvarEvolucao(evolucao);

    if (resultado) {
      setNovaEvolucao("");
    } else {
      alert("Erro ao salvar evolução. Tente novamente.");
    }
  };

  // Evoluções que já estão salvas no Supabase (vêm via prontuarioEditando)
  const evolucoesSalvas = prontuarioEditando?.evolucoes || [];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {prontuarioEditando ? "Editar Prontuário" : "Novo Prontuário"}
        </h2>

        <ProntuarioForm formData={formData} setFormData={setFormData} />

        <hr />

        <h3>Evoluções</h3>

        <textarea
          placeholder="Digite a evolução do paciente..."
          value={novaEvolucao}
          onChange={(e) => setNovaEvolucao(e.target.value)}
        />

        <div className="evolucoes-lista">
          {evolucoesSalvas.map((evolucao) => (
            <div key={evolucao.id} className="evolucao-card">
              <strong>{evolucao.data}</strong>
              <p>{evolucao.descricao}</p>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>

          <button
            type="button"
            className="btn-evolucao"
            onClick={handleAdicionarEvolucao}
          >
            + Evolução
          </button>

          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ProntuarioModal;