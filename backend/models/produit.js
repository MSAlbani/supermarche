import pool from "../config/database.js";

export const allProduct = async () => {
  const produits =
    await pool.query(`SELECT p.id_produit, p.libelle, pv.prix_vente,c.libelle as categorie, p.actif FROM produits p 
        JOIN categories c ON c.id_categorie = p.id_categorie
        JOIN prix_vente_produits pv ON pv.id_produit = p.id_produit
        WHERE c.actif = true AND p.actif = true
        ORDER BY p.libelle ASC 
         `);
  return produits.rows;
};

export const create = async (libelle, id_categorie, prix_vente) => {
  const result = await pool.query(
    `INSERT INTO produits (libelle, id_categorie) VALUES ($1, $2) RETURNING *`,
    [libelle, id_categorie],
  );
  return produits.rows[0];
};

export const update = async (id_produit) => {};

export const findById = async (id_produit) => {};
