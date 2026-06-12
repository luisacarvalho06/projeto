import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function PacienteTabela({
  pacientes,
  setPacientes,
  pacientesOriginais,
  onEditar
}) {

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 5;

  const ultimoItem =
    paginaAtual * itensPorPagina;

  const primeiroItem =
    ultimoItem - itensPorPagina;

  const pacientesPagina =
    pacientes.slice(
      primeiroItem,
      ultimoItem
    );

  const totalPaginas = Math.ceil(
    pacientes.length / itensPorPagina
  );

  const excluirPaciente = (id) => {

    if (
      window.confirm(
        "Deseja excluir este paciente?"
      )
    ) {

      const novaLista =
        pacientesOriginais.filter(
          (paciente) => paciente.id !== id
        );

      setPacientes(novaLista);
    }
  };

  return (
    <>

      <table>

        <thead>

          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>

        </thead>

        <tbody>

          {pacientesPagina.map((paciente) => (

            <tr key={paciente.id}>

              <td>{paciente.nome}</td>

              <td>{paciente.cpf}</td>

              <td>{paciente.telefone}</td>

              <td>{paciente.email}</td>

              <td className="acoes">

                <button
                  className="btn-editar"
                  onClick={() => onEditar(paciente)}
                >
                  <FaEdit />
                  Editar
                </button>

                <button
                  className="btn-excluir"
                  onClick={() =>
                    excluirPaciente(paciente.id)
                  }
                >
                  <FaTrash />
                  Excluir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="paginacao">

        <button
          disabled={paginaAtual === 1}
          onClick={() =>
            setPaginaAtual(
              paginaAtual - 1
            )
          }
        >
          Anterior
        </button>

        <span>
          Página {paginaAtual} de {totalPaginas || 1}
        </span>

        <button
          disabled={
            paginaAtual === totalPaginas
          }
          onClick={() =>
            setPaginaAtual(
              paginaAtual + 1
            )
          }
        >
          Próxima
        </button>

      </div>

    </>
  );
}

export default PacienteTabela;