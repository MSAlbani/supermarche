import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select";
import { Badge } from "../ui/Badge";
import { Filter } from "lucide-react";

/**
 * Données statiques
 */
const CATEGORIES = [
  "antalgique",
  "antibiotique",
  "anti-inflammatoire",
  "vitamine",
  "cardiovasculaire",
  "digestif",
  "respiratoire",
  "dermatologie",
  "autre",
];

const FORMES = [
  "comprimé",
  "gélule",
  "sirup",
  "injection",
  "pommade",
  "suppositoire",
  "autre",
];

/**
 * Structure des filtres
 */
interface Filters {
  categorie: string;
  forme: string;
  prescription: string;
  stock: string;
}

interface ProduitFilterProps {
  filters: Filters;
  onFiltersChange: React.Dispatch<React.SetStateAction<Filters>>;
}

/**
 * Composant de filtres produits
 */
export default function ProduitFiltre({
  filters,
  onFiltersChange,
}: ProduitFilterProps) {
  // Mise à jour d’un filtre spécifique
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  // Nombre de filtres actifs
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "all",
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtres</span>

        {activeFiltersCount > 0 && (
          <Badge variant="secondary">
            {activeFiltersCount} actif
            {activeFiltersCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Grille de filtres */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Catégorie */}
        <Select
          value={filters.categorie}
          onValueChange={(v) => handleFilterChange("categorie", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Forme */}
        <Select
          value={filters.forme}
          onValueChange={(v) => handleFilterChange("forme", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Forme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes formes</SelectItem>
            {FORMES.map((f) => (
              <SelectItem key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Ordonnance */}
        <Select
          value={filters.prescription}
          onValueChange={(v) => handleFilterChange("prescription", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordonnance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Ordonnance requise">
              Ordonnance requise
            </SelectItem>
            <SelectItem value="Sans ordonnance">Sans ordonnance</SelectItem>
          </SelectContent>
        </Select>

        {/* Stock */}
        <Select
          value={filters.stock}
          onValueChange={(v) => handleFilterChange("stock", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="faible">Stock faible</SelectItem>
            <SelectItem value="normal">Stock normal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
