import { create } from "zustand";
import { fetchProduits } from "../services/productService";

export interface Produit {
  id_produit: number;
  libelle: string;
  prix_vente: number;
  categorie: string;
  actif: boolean;
}

interface ProductState {
  produits: Produit[];
  loading: boolean;
  error: string | null;
  getProduits: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  produits: [],
  loading: false,
  error: null,

  getProduits: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchProduits();
      set({ produits: data, loading: false });
    } catch (error: unknown) {
      set({
        error: "Erreur lors du chargement des produits " + error,
        loading: false,
      });
    }
  },
}));
