import api from "../api/axios";

export const fetchProduits = async () => {
  const produits = await api.get("/produits/afficher");

  return produits.data;
};
