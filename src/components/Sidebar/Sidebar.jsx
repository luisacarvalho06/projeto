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

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside className="sidebar">

        <div className="sidebar-header">
          <h2>Consultório Terapêutico</h2>
          <p>Fisioterapia • RPG • Acupuntura</p>
        </div>

        <nav className="sidebar-menu">

          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""} >
            <FaHome />
            <span>Dashboard</span>
          </Link>

          <Link to="/dashboard/agenda" className={location.pathname === "/dashboard/agenda" ? "active" : ""} >
            <FaCalendarAlt />
            <span>Agenda</span>
          </Link>

          <Link to="/dashboard/pacientes" className={location.pathname === "/dashboard/pacientes" ? "active" : ""} >
            <FaUsers />
            <span>Pacientes</span>
          </Link>

          <Link to="/dashboard/profissionis" className={location.pathname === "/dashboard/profissionais" ? "active" : ""} >
            <FaUserMd />
            <span>Profissionais</span>
          </Link>

          <Link to="/dashboard/servicos" className={location.pathname === "/dashboard/servicos" ? "active" : ""} >
            <FaSpa />
            <span>Serviços</span>
          </Link>

          <Link to="/dashboard/atendimentos" className={location.pathname === "/dashboard/atendimentos" ? "active" : ""} >
            <FaClipboardList />
            <span>Atendimentos</span>
          </Link>

          <Link to="/dashboard/prontuarios" className={location.pathname === "/dashboard/prontuarios" ? "active" : ""} >
            <FaFileMedical />
            <span>Prontuários</span>
          </Link>

          <Link to="/dashboard/financeiro" className={location.pathname === "/dashboard/financeiro" ? "active" : ""} >
            <FaDollarSign />
            <span>Financeiro</span>
          </Link>

          <Link to="/dashboard/configuracoes" className={location.pathname === "/dashboard/configuracoes" ? "active" : ""} >
            <FaCog />
            <span>Configurações</span>
          </Link>

        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>

        <div className="sidebar-user">
          <img
            src="https://i.pravatar.cc/100"
            alt="Usuário"
          />

          <div>
            <h4>Luisa Carvalho</h4>
            <p>Administradora</p>
          </div>
        </div>

      </aside>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3>Confirmar saída</h3>

            <p>Tem certeza que deseja sair do sistema?</p>

            <div className="modal-buttons">

              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>

              <button
                className="confirm-btn"
                onClick={() => navigate("/")}
              >
                Sair
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;