import { Plus, Search, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import ProduitFiltre from "../../components/produit/ProduitFiltre";
import { useState } from "react";
import { ProduitCard } from "../../components/produit/ProduitCard";
import Input from "../../components/ui/Input";
import ProduitForm from "../../components/produit/ProduitForm";

export default function Produit() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    categorie: "all",
    forme: "all",
    prescription: "all",
    stock: "all",
  });

  const medicaments = [
    {
      nom: "Amoxicilline",
      dosage: "1g",
      marque: "Antibio Labs",
      prix: 3500,
      stock: 7,
      expire: "30/06/2025",
      categories: ["antibiotique", "Ordonnance"],
      forme: "gélule",
      lowStock: true,
    },
    {
      nom: "Vitamine C",
      dosage: "1000mg",
      marque: "VitaHealth",
      prix: 2500,
      stock: 67,
      expire: "15/03/2026",
      categories: ["vitamine"],
      forme: "comprimé",
    },
    {
      nom: "Amoxicilline",
      dosage: "1g",
      marque: "Antibio Labs",
      prix: 1500,
      stock: 7,
      expire: "30/06/2025",
      categories: ["antibiotique", "Ordonnance"],
      forme: "gélule",
      lowStock: true,
    },
    {
      nom: "Vitamine C",
      dosage: "1000mg",
      marque: "VitaHealth",
      prix: 2500,
      stock: 67,
      expire: "15/03/2026",
      categories: ["vitamine"],
      forme: "comprimé",
    },
    {
      nom: "Amoxicilline",
      dosage: "1g",
      marque: "Antibio Labs",
      prix: 1500,
      stock: 7,
      expire: "30/06/2025",
      categories: ["antibiotique", "Ordonnance"],
      forme: "gélule",
      lowStock: true,
    },
  ];

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {medicaments.map((med, idx) => (
            <div key={idx}>
              <ProduitCard {...med} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
