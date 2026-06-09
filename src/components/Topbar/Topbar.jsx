import "./Topbar.css"
const dataAtual = new Date().toLocaleDateString("pt-BR");

function Topbar() {
  return (
    <header className="topbar">

      <div className="topbar-title">
        Dashboard
      </div>

      <div className="topbar-right">

        <input
          type="text"
          placeholder="Buscar paciente..."
          className="search-input"
        />

        <span className="date">
            {dataAtual}
        </span>

        <div className="user">
          Luisa
        </div>

      </div>

    </header>
  );
}

export default Topbar;