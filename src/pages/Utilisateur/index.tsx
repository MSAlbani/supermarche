import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Briefcase, Trash, Edit, Users } from "lucide-react";
import Table from "../../components/ui/Table";
import { useUserStore, useRoleStore } from "../../store/userStore";
import type { Role, Utilisateurs } from "../../store/userStore";

// @&Of*$o*23&10&@
const roleColumn = [
  {
    header: "Libellé du rôle",
    cell: (role: Role) => (
      <span className="font-medium text-gray-800">{role.libelle}</span>
    ),
  },
  {
    header: "Description",
    cell: (role: Role) => (
      <span className="text-sm text-gray-600">{role.description}</span>
    ),
  },
  {
    header: "Utilisateurs assignés",
    cell: (role: Role) => (
      <span className="text-sm px-2.5 py-0.5 items-center text-center font-semibold border border-gray-200 rounded-md text-gray-600">
        {role.nombre} {role.nombre > 1 ? "utilisateurs" : "utilisateur"}
      </span>
    ),
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
    cell: (utilisateurs: Utilisateurs) => (
      <span className="font-medium text-gray-800">
        {utilisateurs.nom_complet}
      </span>
    ),
  },
  {
    header: "Login",
    cell: (utilisateurs: Utilisateurs) => (
      <span className="font-medium text-gray-800">{utilisateurs.login}</span>
    ),
  },
  {
    header: "Rôle",
    cell: (utilisateurs: Utilisateurs) => (
      <span className="font-medium text-gray-800">{utilisateurs.role}</span>
    ),
  },
  {
    header: "Etat",
    cell: (utilisateurs: Utilisateurs) => (
      <span
        className={`${utilisateurs.actif === true ? "text-blue-600 border-blue-600 " : "text-red-600"} bg-green-100 px-3 my-auto text-sm font-semibold border rounded-lg `}
      >
        {utilisateurs.actif === true ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (utilisateurs: Utilisateurs) => (
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
  const { utilisateurs, loadingUser, errorUser, getUtilisateurs } =
    useUserStore();
  const { roles, loadingRole, erreurRole, getRoles } = useRoleStore();

  useEffect(() => {
    getUtilisateurs();
  }, [getUtilisateurs]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

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
            {loadingUser && <p>Chargement encours....</p>}
            {errorUser && <p className="text-red-500">{errorUser}</p>}
            {}
            <Table data={utilisateurs} columns={userColumn} />
          </Card>
        )}

        {activeTab === "roles" && (
          <Card className="border-gray-300">
            <h1 className="text-xl font-semibold">Rôles</h1>
            {loadingRole && <p>Chargement encours....</p>}
            {erreurRole && <p className="text-red-500">{erreurRole}</p>}
            <Table data={roles} columns={roleColumn} />
          </Card>
        )}
      </div>
    </div>
  );
}
