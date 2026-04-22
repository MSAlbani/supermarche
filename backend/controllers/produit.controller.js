import * as produitModel from "../models/produit.js";
import { createPrixVenteProduit } from "../models/prixVenteProduit.js";

export const getProducts = async (req, res) => {
  const produits = await produitModel.findAllProducts();

  res.status(200).json(produits);
};

export const createProduct = async (req, res) => {
  const { libelle, id_categorie, actif, stock_alert, prix_vente } = req.body;

  if (!libelle || !id_categorie) {
    return res
      .status(400)
      .json({ message: "Libellé et catégorie sont requis" });
  }

  const existingProduct = await produitModel.findProductByLibelle(libelle);
  if (existingProduct) {
    return res.status(400).json({
      message:
        "Un produit avec ce libellé existe déjà, Veuillez l'activer s'il est désactivé",
    });
  }

  const produit = await produitModel.createProduct(
    libelle,
    id_categorie,
    actif,
    stock_alert,
  );

  const createPrixVente = await createPrixVenteProduit(
    prix_vente,
    actif,
    produit.id_produit,
  );

  res.status(201).json({ message: "Produit ajouté ", produit });
};

export const updateProduct = async (req, res) => {
  const { id_produit } = req.params;
  const { libelle, id_categorie, actif, stock_alert } = req.body;

  const existingProduct = await produitModel.findProductById(id_produit);

  if (!existingProduct) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  const updatedProduct = await produitModel.updateProduct(
    id_produit,
    libelle,
    id_categorie,
    actif,
    stock_alert,
  );
  res.status(200).json({ message: "Produit modifié ", updatedProduct });
};

export const deleteProduct = async (req, res) => {
  const { id_produit } = req.params;

  const existingProduct = await produitModel.findProductById(id_produit);

  if (!existingProduct) {
    return res.status(404).json({ message: "Produit non trouvé" });
  }

  await produitModel.deleteProduct(id_produit);
  res.status(200).json({ message: "Produit supprimé" });
};
