import "./Profissionais.css";

function Profissionais() {
  return (
    <div className="profissionais-page">

      <div className="page-header">
        <h1>Profissionais</h1>
      </div>

      <div className="profissionais-grid">

        <div className="profissional-card">

          <div className="profissional-content">

            <img src="/fisio.jpg" alt="Camila Sousa" />

            <div className="profissional-info">

              <h2>Camila Souza</h2>

              <span className="cargo">
                Fisioterapeuta
              </span>

              <p>
                <strong>CREFITO:</strong> 123456-F
              </p>

              <p>
                <strong>Telefone:</strong> (61) 99999-9999
              </p>

              <p>
                <strong>Email:</strong> camila@email.com
              </p>

              <p>
                <strong>Especialidades:</strong> RPG, Fisioterapia Ortopédica, Fisioterapia Esportiva
              </p>


            </div>

          </div>

        </div>

        <div className="profissional-card">

          <div className="profissional-content">

            <img src="/fisiote.jpg" alt="Carla Brito" />

            <div className="profissional-info">

              <h2>Carla Brito</h2>

              <span className="cargo">
                Fisioterapeuta
              </span>

              <p>
                <strong>CREFITO:</strong> 123456-F
              </p>

              <p>
                <strong>Telefone:</strong> (61) 99999-9999
              </p>

              <p>
                <strong>Email:</strong> camila@email.com
              </p>

              <p>
                <strong>Especialidades:</strong> Acupuntura Sistêmica, Auriculoterapia, Ventosaterapia
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profissionais;