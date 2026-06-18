import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";


const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        navigate("/dashboard");
    };

    return (
        <div className="login-page">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1>Acesse o sistema</h1>
                    <div className="input-field">
                        <input
                            type="email"
                            placeholder="E-mail"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            placeholder="Senha"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className="icon" />
                    </div>

                    <div className="recall-forget">
                        <label>
                            <input type="checkbox" />
                            Lembre de mim
                        </label>
                        <Link to="/forgot-password">
                            Esqueceu sua senha?
                        </Link>
                    </div>

                    <button>Entrar</button>

                    <div className="signup-link">
                        <p>
                            Não tem conta?
                            <Link to="/register"> Criar Conta </Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login
