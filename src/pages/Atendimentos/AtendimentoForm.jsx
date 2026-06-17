import { useClinica } from "../../context/ClinicaContext";

function AtendimentoForm({
    formData,
    setFormData
}) {

    const { pacientes, profissionais } = useClinica();

    const horarios = [];

    for (let hora = 7; hora <= 18; hora++) {

        const inicio = hora === 7 ? 30 : 0;

        for (let minuto = inicio; minuto < 60; minuto += 10) {

            horarios.push(
                `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`
            );

        }
    }

    horarios.push("19:00");

    return (
        <div className="form-grid">

            <select
                value={formData.paciente}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        paciente: e.target.value
                    })
                }
            >
                <option value="">
                    Selecione um paciente
                </option>

                {pacientes.map((paciente) => (
                    <option
                        key={paciente.id}
                        value={paciente.nome}
                    >
                        {paciente.nome}
                    </option>
                ))}
            </select>

            <select
                value={formData.profissional}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        profissional: e.target.value
                    })
                }
            >
                <option value="">
                    Selecione um profissional
                </option>

                {profissionais.map((profissional) => (
                    <option
                        key={profissional.id}
                        value={profissional.nome}
                    >
                        {profissional.nome}
                    </option>
                ))}
            </select>

            <select
                value={formData.servico}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        servico: e.target.value
                    })
                }
            >
                <option value="">
                    Selecione um serviço
                </option>

                <option value="RPG">
                    RPG
                </option>

                <option value="Fisioterapia Ortopédica">
                    Fisioterapia Ortopédica
                </option>

                <option value="Fisioterapia Esportiva">
                    Fisioterapia Esportiva
                </option>

                <option value="Acupuntura Sistêmica">
                    Acupuntura Sistêmica
                </option>

                <option value="Auriculoterapia">
                    Auriculoterapia
                </option>

                <option value="Ventosaterapia">
                    Ventosaterapia
                </option>
            </select>

            <input
                type="date"
                value={formData.data}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        data: e.target.value
                    })
                }
            />

            <select
                value={formData.horario}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        horario: e.target.value
                    })
                }
            >

                <option value="">
                    Selecione um horário
                </option>

                {horarios.map((horario) => (

                    <option
                        key={horario}
                        value={horario}
                    >
                        {horario}
                    </option>

                ))}

            </select>

            <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        status: e.target.value
                    })
                }
            >
                <option value="">Status</option>
                <option value="Agendado">Agendado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
            </select>

            <textarea
                placeholder="Observações"
                value={formData.observacoes}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        observacoes: e.target.value
                    })
                }
            />
        </div>
    );
}

export default AtendimentoForm;