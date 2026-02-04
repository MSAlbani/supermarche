import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Briefcase, Trash, Edit, Users } from "lucide-react";
import Table from "../../components/ui/Table";

interface Role {
  libelle: string;
  utilisateursAssignes: number;
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

export default function Utilisateur(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("utilisateurs");

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
            <Table data={[]} columns={[]} />
          </Card>
        )}

        {activeTab === "roles" && (
          <Card className="border-gray-300">
            <h1 className="text-xl font-semibold mb-6">Rôles</h1>
            <Table data={roles} columns={roleColumn} />
          </Card>
        )}
      </div>
    </div>
  );
}
