import { create } from "zustand";
import { fetchProduitsVente } from "../services/venteService";

export interface Vente {
  id_produit: number;
  stock: number;
  categories: string;
  prix_vente: number;
  produits: string;
}

interface VenteState {
  produitsVente: Vente[];
  loadingVente: boolean;
  errorVente: string | null;
  getProduitsVente: () => Promise<void>;
}

export const useVenteStore = create<VenteState>((set) => ({
  produitsVente: [],
  loadingVente: false,
  errorVente: null,
  getProduitsVente: async () => {
    set({ loadingVente: true, errorVente: null });
    try {
      const data = await fetchProduitsVente();
      set({ produitsVente: data, loadingVente: false });
    } catch (error: unknown) {
      set({
        errorVente: "Erreur lors du chargement des produits de vente " + error,
        loadingVente: false,
      });
    }
  },
}));
