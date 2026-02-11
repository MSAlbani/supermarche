import pool from "../config/database.js";

export const addPrixVenteProduit = async (prix_vente, id_produit) => {
  const result = await pool.query(
    `INSERT INTO prix_vente_produits (prix_vente, date_debut, id_produit) VALUES ($1, NOW(), $2) RETURNING *`,
    [prix_vente, id_produit],
  );
  return result.rows[0];
};

export const modifierPriventeProduit = async () => {};

export const getPrixVenteProduitById = async () => {};
