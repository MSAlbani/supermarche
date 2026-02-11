import { create, update, findById, allProduct } from "../models/produit.js";

export const lesProduits = async (req, res) => {
  const produits = await allProduct();

  res.json(produits);
};

export const ajouterProduit = async () => {
  const { libelle, id_produit, prix_vente } = req.body;

  const produit = await create(libelle, id_produit, prix_vente);
  res.status(201).json({ message: "Produit ajouté " + produit });
};

export const modifierProduit = async () => {};
