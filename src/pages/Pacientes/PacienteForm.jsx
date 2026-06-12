function PacienteForm({
    formData,
    setFormData
}) {

    const formatCPF = (value) => {
        value = value.replace(/\D/g, "");
        value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        return value;
    };

    const formatTelefone = (value) => {
        value = value.replace(/\D/g, "");
        value = value.slice(0, 11);

        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");

        return value;
    };

    return (
        <div className="form-grid">

            <input
                type="text"
                placeholder="Nome Completo"
                value={formData.nome}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        nome: e.target.value
                    })
                }
            />

            <input
                type="text"
                placeholder="CPF"
                maxLength={14}
                value={formData.cpf}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        cpf: formatCPF(e.target.value)
                    })
                }
            />

            <input
                type="text"
                placeholder="Telefone"
                maxLength={15}
                value={formData.telefone}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        telefone: formatTelefone(e.target.value)
                    })
                }
            />

            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        email: e.target.value
                    })
                }
            />

        </div>
    );
}

export default PacienteForm;