import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./auth/PrivateRoutes";

import Login from "./pages/Login";

// Prospects
import ProspectsList from "./pages/ProspectsList";
import ProspectCreate from "./pages/ProspectCreate";
import ProspectEdit from "./pages/ProspectEdit";

// Clients
import ClientsList from "./pages/ClientsList";
import ClientCreate from "./pages/ClientCreate";
import ClientEdit from "./pages/ClientEdit";

// Users
import UsersList from "./pages/UsersList";
import UserCreate from "./pages/UserCreate";
import UserEdit from "./pages/UserEdit";

// Tâches
import TachesList from "./pages/TachesList";
import TacheCreate from "./pages/TacheCreate";
import TacheEdit from "./pages/TacheEdit";
import TacheDetail from "./pages/TacheDetail";

// Rapports
import RapportList from "./pages/RapportList";
import RapportGenerate from "./pages/RapportGenerate";
import RapportDetail from "./pages/RapportDetail";

// Contrats
import ContratsList from "./pages/ContratsList";
import ContratCreate from "./pages/ContratCreate";
import ContratEdit from "./pages/ContratEdit";
// (optionnel)

// Ventes
import VentesList from "./pages/VentesList";
import VenteCreate from "./pages/VenteCreate";
import VenteEdit from "./pages/VenteEdit";
import VenteDetail from "./pages/VenteDetail"; // optionnel

import NotificationsList from "./pages/NotificationsList";

import Dashboard from "./pages/Dashboard";

 import Profile from "./pages/Profile";


function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route element={<PrivateRoutes />}>
        {/* Prospects */}
        <Route path="/prospects" element={<ProspectsList />} />
        <Route path="/prospects/new" element={<ProspectCreate />} />
        <Route path="/prospects/:id/edit" element={<ProspectEdit />} />

        {/* Clients */}
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/new" element={<ClientCreate />} />
        <Route path="/clients/:id/edit" element={<ClientEdit />} />

        {/* Users */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<UserCreate />} />
        <Route path="/users/:id/edit" element={<UserEdit />} />

        {/* Tâches */}
        <Route path="/taches" element={<TachesList />} />
        <Route path="/taches/new" element={<TacheCreate />} />
        <Route path="/taches/:id/edit" element={<TacheEdit />} />
        <Route path="/taches/:id" element={<TacheDetail />} />

        <Route path="/rapports" element={<RapportList />} />
        <Route path="/rapports/generer" element={<RapportGenerate />} />
        <Route path="/rapports/:id" element={<RapportDetail />} />

          <Route path="/contrats" element={<ContratsList />} />
          <Route path="/contrats/new" element={<ContratCreate />} />
          <Route path="/contrats/:id/edit" element={<ContratEdit />} />

          <Route path="/ventes" element={<VentesList />} />
          <Route path="/ventes/new" element={<VenteCreate />} />
          <Route path="/ventes/:id/edit" element={<VenteEdit />} />
          <Route path="/ventes/:id" element={<VenteDetail />} />

          <Route path="/notifications" element={<NotificationsList />} />

           <Route path="/dashboard" element={<Dashboard />} />

           <Route path="/profile" element={<Profile />} />


      </Route>
    </Routes>
  );
}

export default App;
