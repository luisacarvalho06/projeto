import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaUserMd,
  FaSpa,
  FaClipboardList,
  FaFileMedical,
  FaDollarSign,
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <h2>Consultório Terapêutico</h2>
        <p>Fisioterapia • RPG • Acupuntura</p>
      </div>

      <nav className="sidebar-menu">

        <a href="./Dashboard">
          <FaHome />
          <span>Dashboard</span>
        </a>

        <a href="./Agenda">
          <FaCalendarAlt />
          <span>Agenda</span>
        </a>

        <a href="#">
          <FaUsers />
          <span>Pacientes</span>
        </a>

        <a href="#">
          <FaUserMd />
          <span>Profissionais</span>
        </a>

        <a href="#">
          <FaSpa />
          <span>Serviços</span>
        </a>

        <a href="#">
          <FaClipboardList />
          <span>Atendimentos</span>
        </a>

        <a href="#">
          <FaFileMedical />
          <span>Prontuários</span>
        </a>

        <a href="#">
          <FaDollarSign />
          <span>Financeiro</span>
        </a>

        <a href="#">
          <FaChartBar />
          <span>Relatórios</span>
        </a>

        <a href="#">
          <FaCog />
          <span>Configurações</span>
        </a>

      </nav>

      <div className="sidebar-footer">
        <a href="#">
          <FaSignOutAlt />
          <span>Sair</span>
        </a>
      </div>

    </aside>
  );
}

export default Sidebar;