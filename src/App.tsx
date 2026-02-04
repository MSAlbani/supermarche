import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Wrapper from "./components/Wrapper.tsx";
// import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Produit from "./pages/Produit/index.tsx";
import Vente from "./pages/Vente/index.tsx";
import Utilisateur from "./pages/Utilisateur/index.tsx";

function RequireAuth({ children }: { children: React.JSX.Element }) {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RequireAuth>
            <Wrapper />
          </RequireAuth>
        }
      >
        <Route path="/produits" element={<Produit />} />
        <Route path="/ventes" element={<Vente />} />
        <Route path="/utilisateurs" element={<Utilisateur />} />
      </Route>
    </Routes>
  );
}
