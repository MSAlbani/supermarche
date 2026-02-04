import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Pill, Save, X } from "lucide-react";
import { Button } from "../ui/Button";
import Label from "../ui/Label";
import Input from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
// import { Select, SelectContent, SelectItem } from "../ui/Select";
interface ProduitFormProps {
  newProduct: boolean;
}
export const ProduitForm: React.FC<ProduitFormProps> = ({ newProduct }) => {
  const [formData, setFormData] = useState({
    forme: "Forme",
    categorie: "Categorie",
  });
  const handleChange = () => {
    // setFormData({...formData, forme: e.target.value})
    console.log("merci");
  };

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
    "sirop",
    "injection",
    "pommade",
    "suppositoire",
    "autre",
  ];
  return (
    <Card className="bg-white/90 backdrop-blur-sm mb-6 border-0 shadow-xl">
      <div className="bg-linear-to-r from-green-500 -mx-4 -mt-4 to-emerald-600 text-white">
        <div className="flex items-center h-18 px-4 text-xl font-medium gap-2">
          <Pill className="w-6 h-6" />
          {newProduct ? "Nouveau Médicament" : "Modifier le Médicament"}
        </div>
      </div>

      <div className="p-6">
        <form className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du médicament *</Label>
              <Input
                id="nom"
                // value={formData.nom}
                // onChange={(e) => handleChange("nom", e.target.value)}
                placeholder="Ex: Paracétamol"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix_unitaire">Prix unitaire (FCFA) *</Label>
              <Input
                id="prix_unitaire"
                type="number"
                step="100"
                // value={formData.prix_unitaire}
                // onChange={(e) => handleChange("prix_unitaire", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Prix et stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_actuel">Stock actuel *</Label>
              <Input
                id="stock_actuel"
                type="number"
                // value={formData.stock_actuel}
                // onChange={(e) => handleChange("stock_actuel", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_minimum">Stock alert</Label>
              <Input
                id="stock_minimum"
                type="number"
                // value={formData.stock_minimum}
                // onChange={(e) => handleChange("stock_minimum", e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_minimum">Stock alert</Label>
              <Input
                id="stock_minimum"
                type="number"
                // value={formData.stock_minimum}
                // onChange={(e) => handleChange("stock_minimum", e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          {/* Détails produit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabricant">Fabricant</Label>
              <Input
                id="fabricant"
                // value={formData.fabricant}
                // onChange={(e) => handleChange("fabricant", e.target.value)}
                placeholder="Nom du fabricant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_expiration">Date d'expiration</Label>
              <Input
                id="date_expiration"
                type="date"
                // value={formData.date_expiration}
                // onChange={(e) => handleChange("date_expiration", e.target.value)}
              />
            </div>
          </div>

          {/* Sélecteurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={formData.categorie} onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Forme</Label>
              <Select value={formData.forme} onValueChange={handleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une forme" />
                </SelectTrigger>
                <SelectContent>
                  {FORMES.map((forme) => (
                    <SelectItem key={forme} value={forme}>
                      {forme.charAt(0).toUpperCase() + forme.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              // onClick={onCancel}
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ProduitForm;
