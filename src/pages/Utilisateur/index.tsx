import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Briefcase, Trash, Edit, Users } from "lucide-react";
import Table from "../../components/ui/Table";
import axios from "axios";

interface Role {
  libelle: string;
  utilisateursAssignes: number;
}

interface User {
  // id_utilisateur: number;
  nom_complet: string;
  login: string;
  actif: boolean;
  libelle: string;
}

const roles: Role[] = [
  { libelle: "ADMIN", utilisateursAssignes: 3 },
  { libelle: "VENDEUR", utilisateursAssignes: 5 },
  { libelle: "CAISSIER", utilisateursAssignes: 2 },
];

const roleColumn = [
  {
    header: "Libellé du rôle",
    cell: (role: Role) => (
      <span className="font-medium text-gray-800">{role.libelle}</span>
    ),
  },
  {
    header: "Aperçu",
    cell: () => <span className="text-sm text-gray-600">Aperçu du rôle</span>,
  },
  {
    header: "Utilisateurs assignés",
    cell: () => <span className="text-sm text-gray-600">Utilisateurs</span>,
  },
  {
    header: "Actions",
    cell: (role: Role) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Modifier", role)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="danger" size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

const userColumn = [
  {
    header: "Nom et Prénom",
    cell: (utilisateurs: User) => (
      <span className="font-medium text-gray-800">
        {utilisateurs.nom_complet}
      </span>
    ),
  },
  {
    header: "Login",
    cell: (utilisateurs: User) => (
      <span className="font-medium text-gray-800">{utilisateurs.login}</span>
    ),
  },
  {
    header: "Rôle",
    cell: (utilisateurs: User) => (
      <span className="font-medium text-gray-800">{utilisateurs.libelle}</span>
    ),
  },
  {
    header: "Etat",
    cell: (utilisateurs: User) => (
      <span
        className={`${utilisateurs.actif === true ? "text-blue-600" : "text-red-600"} text-sm `}
      >
        {utilisateurs.actif === true ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (utilisateurs: User) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Modifier", utilisateurs)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="danger" size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function Utilisateur(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("utilisateurs");
  const [utilisateurs, setUtilisateur] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91dGlsaXNhdGV1ciI6MSwicm9sZSI6ImFkbWluaXN0cmF0ZXVyIiwiaWF0IjoxNzcwNjU5MTQzLCJleHAiOjE3NzA3NDU1NDN9.uUScccgPnn8zyaSm9YfWj6djH9PkySprrHJsAnqlK9Y";

  const getUsers = async () => {
    axios
      .get("http://localhost:5000/api/users/allUsers", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        if (res.status === 200) setUtilisateur(res.data);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between flex-col mb-8 lg:flex-row lg:items-center gap-4 ">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Utilisateurs
            </h1>
            <p className="text-gray-600 mb-3">Gestion des accès et rôles</p>

            <div className="flex justify-between gap-6 my-4 border-gray-100">
              <Button
                variant={activeTab === "utilisateurs" ? "primary" : "outline"}
                onClick={() => {
                  setActiveTab("utilisateurs");
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
              </Button>
              <Button
                variant={activeTab === "roles" ? "primary" : "outline"}
                onClick={() => {
                  setActiveTab("roles");
                }}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Rôles
              </Button>
            </div>
          </div>
        </div>
        {activeTab === "utilisateurs" && (
          <Card className="border-gray-300">
            <h1 className="text-xl font-semibold">Utilisateurs</h1>
            <Table data={utilisateurs} columns={userColumn} />
          </Card>
        )}

        {activeTab === "roles" && (
          <Card className="border-gray-300">
            <h1 className="text-xl font-semibold">Rôles</h1>
            <Table data={roles} columns={roleColumn} />
          </Card>
        )}
      </div>
    </div>
  );
}
