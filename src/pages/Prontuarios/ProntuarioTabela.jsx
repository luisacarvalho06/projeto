import { FaEdit, FaTrash } from "react-icons/fa";

function ProntuarioTabela({ prontuarios, onEditar, excluirProntuario }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Data Criação</th>
          <th>Queixa Principal</th>
          <th>Última Evolução</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {prontuarios.map((prontuario) => (
          <tr key={prontuario.id}>
            <td>{prontuario.paciente}</td>
            <td>{prontuario.dataCriacao}</td>
            <td>{prontuario.queixaPrincipal}</td>

            <td>
              {prontuario.evolucoes?.length > 0
                ? prontuario.evolucoes[
                    prontuario.evolucoes.length - 1
                  ].descricao?.substring(0, 60) + "..."
                : "Sem evolução"}
            </td>

            <td>
              <button
                className="editar-btn"
                onClick={() => onEditar(prontuario)}
              >
                <FaEdit /> Editar
              </button>

              <button
                className="excluir-btn"
                onClick={() => excluirProntuario(prontuario.id)}
              >
                <FaTrash /> Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProntuarioTabela;