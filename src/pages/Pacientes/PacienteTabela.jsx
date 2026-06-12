function PacienteTabela({ pacientes }) {

  return (
    <table>

      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Email</th>
        </tr>
      </thead>

      <tbody>

        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td>{paciente.nome}</td>
            <td>{paciente.telefone}</td>
            <td>{paciente.email}</td>
          </tr>
        ))}

      </tbody>

    </table>
  );
}

export default PacienteTabela;