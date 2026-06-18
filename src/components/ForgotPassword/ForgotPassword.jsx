import { useState } from "react";
import "../Auth/auth.css";
import { Link } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(
      "Recuperar senha:",
      email
    );
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
        
        <h2>Recuperar Senha</h2>

        <p>
          Informe seu e-mail para receber
          o link de recuperação.
        </p>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button type="submit">
          Enviar Link
        </button>

      </form>

    </div>
  );
}

export default ForgotPassword;