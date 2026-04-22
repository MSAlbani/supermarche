import React, { useEffect, useState } from "react";
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
import api from "../../api/axios";

// ─────────────────────────────────────────────
// Composant Switch
// ─────────────────────────────────────────────

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-200 focus:outline-none focus:ring-2
        focus:ring-green-500 focus:ring-offset-2
        ${checked ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      {/* Curseur */}
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-md
          transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
};

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Categorie = {
  id_categorie: string;
  libelle: string;
  description: string;
};

interface ProduitFormProps {
  newProduct: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  libelle: string;
  prix_unitaire: string;
  stock_alert: string;
  categorie: string;
  actif: boolean;
};

const initialFormData: FormData = {
  libelle: "",
  prix_unitaire: "",
  stock_alert: "",
  categorie: "",
  actif: true, // ✅ actif par défaut à la création
};

// ─────────────────────────────────────────────
// ProduitForm
// ─────────────────────────────────────────────

export const ProduitForm: React.FC<ProduitFormProps> = ({
  newProduct,
  onSuccess,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // ✅ Handler dédié pour le switch (reçoit un boolean)
  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, actif: checked });
  };

  const getCategories = async () => {
    try {
      const res = await api.get("/categories/afficher");
      setCategories(res.data);
    } catch {
      setError("Impossible de charger les catégories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (newProduct) {
        await api.post("/produits/", {
          libelle: formData.libelle,
          prix_vente: Number(formData.prix_unitaire),
          stock_alert: Number(formData.stock_alert),
          id_categorie: formData.categorie,
          actif: formData.actif,
        });
      } else {
        // await api.put(`/produits/${id}`, { ... });
      }

      setFormData(initialFormData);
      onSuccess?.();
    } catch {
      setError(
        newProduct
          ? "Erreur lors de l'enregistrement du nouveau produit"
          : "Erreur lors de la modification du produit",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm mb-6 border-0 shadow-xl overflow-visible">
      <div className="bg-linear-to-r from-green-500 -mx-4 -mt-4 to-emerald-600 text-white">
        <div className="flex items-center h-18 px-4 text-xl font-medium gap-2">
          <Pill className="w-6 h-6" />
          {newProduct ? "Nouveau Produit" : "Modifier le Produit"}
        </div>
      </div>

      <div className="p-6">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nom + Prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="libelle">Nom du produit *</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={handleChange}
                placeholder="Ex: Riz 25"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix_unitaire">Prix unitaire (FCFA) *</Label>
              <Input
                id="prix_unitaire"
                type="number"
                step="100"
                value={formData.prix_unitaire}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Catégorie + Stock + Switch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={formData.categorie}
                onValueChange={handleSelectChange("categorie")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(({ id_categorie, libelle }) => (
                    <SelectItem key={id_categorie} value={id_categorie}>
                      {libelle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_alert">Stock alert</Label>
              <Input
                id="stock_alert"
                type="number"
                value={formData.stock_alert}
                onChange={handleChange}
                placeholder="10"
              />
            </div>

            {/* ✅ Switch actif/inactif */}
            <div className="space-y-2">
              <Label>Statut du produit</Label>
              <div className="flex items-center justify-center gap-3 h-10">
                <Switch
                  checked={formData.actif}
                  onChange={handleSwitchChange}
                />
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    formData.actif ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {formData.actif ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ProduitForm;
