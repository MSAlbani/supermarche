import { Edit, Plus, Search, Trash, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import ProduitFiltre from "../../components/produit/ProduitFiltre";
import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import ProduitForm from "../../components/produit/ProduitForm";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import { useProductStore } from "../../store/productStore";
import { type Produit } from "../../store/productStore";

const produitColumn = [
  {
    header: "ID",
    cell: (produits: Produit) => <span>{produits.id_produit}</span>,
  },

  {
    header: "Libellé Produit",
    cell: (produits: Produit) => <span>{produits.libelle}</span>,
  },

  {
    header: "Prix de vente (FCFA)",
    cell: (produits: Produit) => <span>{produits.prix_vente}</span>,
  },

  {
    header: "Catégorie",
    cell: (produits: Produit) => <span>{produits.categorie}</span>,
  },
  {
    header: "Actions",
    cell: (produits: Produit) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Modifier", produits)}
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

export default function Produit() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    categorie: "all",
    forme: "all",
    prescription: "all",
    stock: "all",
  });

  const { produits, getProduits, loading, error } = useProductStore();

  useEffect(() => {
    getProduits();
  }, [getProduits]);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:items-center mb-8 gap-4 justify-between items-start lg:flex-row">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Produits</h1>
            <p className="text-gray-600">Gestion du catalogue des produits</p>
          </div>

          <Button
            onClick={() => {
              setShowForm(!showForm);
            }}
          >
            {showForm ? (
              <X className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
            {showForm ? "Quitter" : "Nouveau Produit"}
          </Button>
        </div>
        {showForm && (
          <div>
            <ProduitForm newProduct={true} />
          </div>
        )}

        {/* Partie de recherche  */}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {/* <input
                placeholder="Rechercher un produit..."
                type="text"
                className="pl-10 w-full h-12 border-gray-200 focus:border-green-200 flex rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm "
              /> */}
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                type="text"
              />
            </div>
          </div>
          <ProduitFiltre filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Liste des produits */}
        <Card className="border-gray-300">
          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Table data={produits} columns={produitColumn} />
        </Card>
      </div>
    </div>
  );
}
