import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ClinicaContext = createContext();

// ─── Helpers de mapeamento snake_case <-> camelCase ──────────────────────────

function prontuarioParaApp(p) {
  return {
    id: p.id,
    paciente: p.paciente,
    dataCriacao: p.data_criacao,
    queixaPrincipal: p.queixa_principal,
    historicoClinico: p.historico_clinico,
    avaliacaoFisica: p.avaliacao_fisica,
    planoTerapeutico: p.plano_terapeutico,
    observacoes: p.observacoes,
    evolucoes: (p.evolucoes || []).map(evolucaoParaApp),
    created_at: p.created_at,
  };
}

function prontuarioParaDB(p) {
  return {
    paciente: p.paciente,
    data_criacao: p.dataCriacao,
    queixa_principal: p.queixaPrincipal,
    historico_clinico: p.historicoClinico,
    avaliacao_fisica: p.avaliacaoFisica,
    plano_terapeutico: p.planoTerapeutico,
    observacoes: p.observacoes,
  };
}

function evolucaoParaApp(e) {
  return {
    id: e.id,
    prontuario_id: e.prontuario_id,
    data: e.data,
    descricao: e.descricao,
    profissional: e.profissional,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function ClinicaProvider({ children }) {
  const [pacientes, setPacientesState] = useState([]);
  const [prontuarios, setProntuariosState] = useState([]);
  const [atendimentos, setAtendimentosState] = useState([]);
  const [profissionais] = useState([
    { id: 1, nome: "Camila Souza", especialidade: "Fisioterapia" },
    { id: 2, nome: "Carla Brito", especialidade: "Acupuntura" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      await Promise.all([
        carregarPacientes(),
        carregarProntuarios(),
        carregarAtendimentos(),
      ]);
      setLoading(false);
    }
    carregarDados();
  }, []);

  // ─── Pacientes ─────────────────────────────────────────────────────────────

  async function carregarPacientes() {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*")
      .order("nome");
    if (error) { console.error("Erro ao carregar pacientes:", error.message); return; }
    setPacientesState(data);
  }

  async function salvarPaciente(paciente) {
    if (paciente.id) {
      const { data, error } = await supabase
        .from("pacientes")
        .update(paciente)
        .eq("id", paciente.id)
        .select()
        .single();
      if (error) { console.error("Erro ao atualizar paciente:", error.message); return null; }
      setPacientesState((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      return data;
    } else {
      const { data, error } = await supabase
        .from("pacientes")
        .insert(paciente)
        .select()
        .single();
      if (error) { console.error("Erro ao criar paciente:", error.message); return null; }
      setPacientesState((prev) => [...prev, data]);
      return data;
    }
  }

  async function excluirPaciente(id) {
    const { error } = await supabase.from("pacientes").delete().eq("id", id);
    if (error) { console.error("Erro ao excluir paciente:", error.message); return false; }
    setPacientesState((prev) => prev.filter((p) => p.id !== id));
    return true;
  }

  // setPacientes mantido para compatibilidade com PacienteTabela
  async function setPacientes(novosOuFuncao) {
    const valor = typeof novosOuFuncao === "function" ? novosOuFuncao(pacientes) : novosOuFuncao;
    if (valor.length < pacientes.length) {
      const removido = pacientes.find((p) => !valor.find((v) => v.id === p.id));
      if (removido) await excluirPaciente(removido.id);
    } else {
      setPacientesState(valor);
    }
  }

  // ─── Atendimentos ──────────────────────────────────────────────────────────

  async function carregarAtendimentos() {
    const { data, error } = await supabase
      .from("atendimentos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("Erro ao carregar atendimentos:", error.message); return; }
    setAtendimentosState(data);
  }

  async function salvarAtendimento(atendimento) {
    if (atendimento.id) {
      const { data, error } = await supabase
        .from("atendimentos")
        .update(atendimento)
        .eq("id", atendimento.id)
        .select()
        .single();
      if (error) { console.error("Erro ao atualizar atendimento:", error.message); return null; }
      setAtendimentosState((prev) => prev.map((a) => (a.id === data.id ? data : a)));
      return data;
    } else {
      const { data, error } = await supabase
        .from("atendimentos")
        .insert(atendimento)
        .select()
        .single();
      if (error) { console.error("Erro ao criar atendimento:", error.message); return null; }
      setAtendimentosState((prev) => [...prev, data]);
      return data;
    }
  }

  async function excluirAtendimento(id) {
    const { error } = await supabase.from("atendimentos").delete().eq("id", id);
    if (error) { console.error("Erro ao excluir atendimento:", error.message); return false; }
    setAtendimentosState((prev) => prev.filter((a) => a.id !== id));
    return true;
  }

  async function setAtendimentos(novosOuFuncao) {
    const valor = typeof novosOuFuncao === "function" ? novosOuFuncao(atendimentos) : novosOuFuncao;
    if (valor.length < atendimentos.length) {
      const removido = atendimentos.find((a) => !valor.find((v) => v.id === a.id));
      if (removido) await excluirAtendimento(removido.id);
    } else {
      setAtendimentosState(valor);
    }
  }

  // ─── Prontuários ───────────────────────────────────────────────────────────

  async function carregarProntuarios() {
    const { data, error } = await supabase
      .from("prontuarios")
      .select(`*, evolucoes(*)`)
      .order("created_at", { ascending: false });
    if (error) { console.error("Erro ao carregar prontuários:", error.message); return; }
    setProntuariosState(data.map(prontuarioParaApp));
  }

  async function salvarProntuario(prontuario) {
    const dadosDB = prontuarioParaDB(prontuario);

    if (prontuario.id) {
      const { data, error } = await supabase
        .from("prontuarios")
        .update(dadosDB)
        .eq("id", prontuario.id)
        .select()
        .single();
      if (error) { console.error("Erro ao atualizar prontuário:", error.message); return null; }
      await carregarProntuarios();
      return prontuarioParaApp(data);
    } else {
      const { data, error } = await supabase
        .from("prontuarios")
        .insert(dadosDB)
        .select()
        .single();
      if (error) { console.error("Erro ao criar prontuário:", error.message); return null; }
      await carregarProntuarios();
      return prontuarioParaApp(data);
    }
  }

  async function excluirProntuario(id) {
    const { error } = await supabase.from("prontuarios").delete().eq("id", id);
    if (error) { console.error("Erro ao excluir prontuário:", error.message); return false; }
    setProntuariosState((prev) => prev.filter((p) => p.id !== id));
    return true;
  }

  async function setProntuarios(novosOuFuncao) {
    const valor = typeof novosOuFuncao === "function" ? novosOuFuncao(prontuarios) : novosOuFuncao;
    if (valor.length < prontuarios.length) {
      const removido = prontuarios.find((p) => !valor.find((v) => v.id === p.id));
      if (removido) await excluirProntuario(removido.id);
    } else {
      setProntuariosState(valor);
    }
  }

  // ─── Evoluções ─────────────────────────────────────────────────────────────

  async function salvarEvolucao(evolucao) {
    if (evolucao.id) {
      const { data, error } = await supabase
        .from("evolucoes")
        .update(evolucao)
        .eq("id", evolucao.id)
        .select()
        .single();
      if (error) { console.error("Erro ao atualizar evolução:", error.message); return null; }
      await carregarProntuarios();
      return evolucaoParaApp(data);
    } else {
      const { data, error } = await supabase
        .from("evolucoes")
        .insert(evolucao)
        .select()
        .single();
      if (error) { console.error("Erro ao criar evolução:", error.message); return null; }
      await carregarProntuarios();
      return evolucaoParaApp(data);
    }
  }

  async function excluirEvolucao(id) {
    const { error } = await supabase.from("evolucoes").delete().eq("id", id);
    if (error) { console.error("Erro ao excluir evolução:", error.message); return false; }
    await carregarProntuarios();
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ClinicaContext.Provider
      value={{
        pacientes, atendimentos, prontuarios, profissionais, loading,
        setPacientes, salvarPaciente, excluirPaciente,
        setAtendimentos, salvarAtendimento, excluirAtendimento,
        setProntuarios, salvarProntuario, excluirProntuario,
        salvarEvolucao, excluirEvolucao,
      }}
    >
      {children}
    </ClinicaContext.Provider>
  );
}

export function useClinica() {
  return useContext(ClinicaContext);
}