import { useState } from "react";
import "../Auth/auth.css";
import { Link } from "react-router-dom";

function Register() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    console.log({
      nome,
      email,
      senha
    });
  };

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
      <div className="voltar-topo">
        <Link to="/">
          ← Voltar
        </Link>
      </div>
      
        <h2>Criar Conta</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) =>
            setConfirmarSenha(e.target.value)
          }
        />

        <button type="submit">
          Criar Conta
        </button>

      </form>

    </div>
  );
}

export default Register;