import { type Produit } from "./produit.ts";

export const columns = [
  {
    header: "Nom du produit",
    cell: (row: Produit) => (
      <span className="font-medium text-gray-800">{row.nom}</span>
    ),
  },
  {
    header: "Catégorie",
    cell: (row: Produit) => (
      <span className="text-sm text-gray-600">{row.categorie}</span>
    ),
  },
  {
    header: "Forme",
    cell: (row: Produit) => <span className="text-sm">{row.forme}</span>,
  },
  {
    header: "Prix",
    cell: (row: Produit) => (
      <span className="font-semibold">{row.prix} FCFA</span>
    ),
  },
  {
    header: "Stock",
    cell: (row: Produit) => (
      <span
        className={
          row.stock < 20
            ? "text-red-600 font-medium"
            : "text-green-600 font-medium"
        }
      >
        {row.stock}
      </span>
    ),
  },
  {
    header: "Ordonnance",
    cell: (row: Produit) => (
      <span
        className={
          row.ordonnance ? "text-orange-600 font-medium" : "text-gray-600"
        }
      >
        {row.ordonnance ? "Oui" : "Non"}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (row: Produit) => (
      <div className="flex gap-2">
        <button
          onClick={() => console.log("Modifier", row)}
          className="px-2 py-1 border rounded text-sm"
        >
          Modifier
        </button>

        <button
          onClick={() => console.log("Supprimer", row.id)}
          className="px-2 py-1 border rounded text-sm text-red-600"
        >
          Supprimer
        </button>
      </div>
    ),
  },
];
