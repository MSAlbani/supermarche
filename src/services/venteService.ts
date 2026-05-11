import api from "../api/axios";

export const fetchProduitsVente = async () => {
  const produits = await api.get("/ventes/produits/");
  return produits.data;
};
