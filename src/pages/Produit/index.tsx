import { Edit, Plus, Search, Trash, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import ProduitFiltre from "../../components/produit/ProduitFiltre";
import { useEffect, useMemo, useState } from "react";
import Input from "../../components/ui/Input";
import ProduitForm from "../../components/produit/ProduitForm";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import { useProductStore, type Produit } from "../../store/productStore";

export default function Produit() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    categorie: "all",
    forme: "all",
    stock: "all",
  });
  const [search, setSearch] = useState<string>("");
  const { produits, getProduits, loading, error } = useProductStore();

  useEffect(() => {
    getProduits();
  }, [getProduits]);

  // ✅ Colonne définie dans le composant pour accéder aux handlers

  const handleEdit = (p: Produit) => {
    console.log(p);
  };

  const handleDelete = (id: number) => {
    console.log(id);
  };

  const produitColumn = useMemo(
    () => [
      {
        header: "ID",
        cell: (p: Produit) => <span>{p.id_produit}</span>,
      },
      {
        header: "Libellé du produit",
        cell: (p: Produit) => <span>{p.libelle}</span>,
      },
      {
        header: "Prix de vente (FCFA)",
        cell: (p: Produit) => (
          <span>{p.prix_vente.toLocaleString("fr-FR")}</span>
        ),
      },
      {
        header: "Catégorie",
        cell: (p: Produit) => <span>{p.categorie}</span>,
      },
      {
        header: "Actions",
        cell: (p: Produit) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(p)} // ✅ accès au state possible
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(p.id_produit)} // ✅ handler branché
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  // ✅ Logique de filtrage centralisée

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) => {
      // Recherche textuelle (insensible à la casse)
      const matchSearch = p.libelle
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      // Filtre catégorie
      const matchCategorie =
        filters.categorie === "all" || p.categorie === filters.categorie;

      // Filtre forme
      const matchForme = filters.forme === "all" || p.forme === filters.forme;

      // Filtre stock
      const matchStock =
        filters.stock === "all" ||
        (filters.stock === "disponible" && (p.stock ?? 0) > 0) ||
        (filters.stock === "rupture" && (p.stock ?? 0) === 0);

      return matchSearch && matchCategorie && matchForme && matchStock;
    });
  }, [produits, search, filters]);

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
            <ProduitForm
              newProduct={true}
              onSuccess={() => {
                setShowForm(false);
                getProduits();
              }}
              onCancel={() => {
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Partie de recherche  */}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center text-sm text-gray-500">
              {produitsFiltres.length} résultat
              {produitsFiltres.length > 1 ? "s" : ""}
            </div>
          </div>
          <ProduitFiltre filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Liste des produits */}
        <Card className="border-gray-300">
          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <Table data={produitsFiltres} columns={produitColumn} />
          {/* ✅ Message si aucun résultat */}
          {!loading && produitsFiltres.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              Aucun produit ne correspond à votre recherche.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
