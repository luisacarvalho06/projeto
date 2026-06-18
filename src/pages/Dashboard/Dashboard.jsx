import { Routes, Route } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

import DashboardHome from "./DashboardHome";
import Agenda from "../Agenda/Agenda";
import Pacientes from "../Pacientes/Pacientes";
import Profissionais from "../Profissionais/Profissionais";
import Servicos from "../Servicos/Servicos";
import Whatsapp from "../Whatsapp/Whatsapp";
import Atendimentos from "../Atendimentos/Atendimentos";
import Prontuarios from "../Prontuarios/Prontuarios";
import Configuracoes from "../Configuracoes/Configuracoes";

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="page-content">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="profissionais" element={<Profissionais />} />
            <Route path="servicos" element={<Servicos />} />
            <Route path="whatsapp" element={<Whatsapp />} />
            <Route path="atendimentos" element={<Atendimentos />} />
            <Route path="prontuarios" element={<Prontuarios />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;