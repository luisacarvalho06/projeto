function AtendimentoTabela({
  atendimentos,
  onEditar,
  setAtendimentos,
  excluirAtendimento
})  {

    return (
        <table className="table">

            <thead>

                <tr>
                    <th>Paciente</th>
                    <th>Profissional</th>
                    <th>Serviço</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Ações</th>
                    <th>Prontuário</th>
                </tr>

            </thead>

            <tbody>

                {atendimentos.map((atendimento) => (

                    <tr key={atendimento.id}>

                        <td>{atendimento.paciente}</td>

                        <td>{atendimento.profissional}</td>

                        <td>{atendimento.servico}</td>

                        <td>{atendimento.data}</td>

                        <td>{atendimento.horario}</td>

                        <td>

                            <span
                                className={`status ${atendimento.status.toLowerCase()}`}
                            >
                                {atendimento.status}
                            </span>

                        </td>

                        <td>

                            <button
                                className="editar-btn"
                                onClick={() => onEditar(atendimento)}
                            >
                                ✏️ Editar
                            </button>

                            <button
                                className="excluir-btn"
                                onClick={() =>
                                    excluirAtendimento(atendimento.id)
                                }
                            >
                                🗑 Excluir
                            </button>

                        </td>

                        <td>

                            <button
                                className="btn-prontuario"
                            >
                                Abrir
                            </button>

                        </td>

                    </tr>

                ))}


            </tbody>

        </table>
    );
}

export default AtendimentoTabela;