import { Routes, Route } from "react-router-dom";
import "./Dashboard.css"

import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

import Agenda from "../Agenda/Agenda";
import Pacientes from "../Pacientes/Pacientes";
import Profissionais from "../Profissionais/Profissionais";
import Servicos from "../Servicos/Servicos";
import Financeiro from "../Financeiro/Financeiro";
import Whatsapp from "../Whatsapp/Whatsapp";

function Dashboard() {
  return (
<div className="dashboard-layout">

  <Sidebar />

  <div className="main-content">
    <Topbar />

    <div className="page-content">
      Conteúdo
    </div>
  </div>

</div>
  );
}

export default Dashboard;