import pool from "../config/database.js";

export const findAllPrixVenteProduit = async () => {
  const prixVenteProduits = await pool.query(
    `SELECT * FROM prix_vente_produits`,
  );
  return prixVenteProduits.rows;
};

export const createPrixVenteProduit = async (prix_vente, actif, id_produit) => {
  const result = await pool.query(
    `INSERT INTO prix_vente_produits (prix_vente, date_debut, actif, id_produit) VALUES ($1, NOW(), $2, $3) RETURNING *`,
    [prix_vente, actif, id_produit],
  );
  return result.rows[0];
};

export const switchPrixVenteProduitStatus = async (id_prixVenteProduit) => {
  const result = await pool.query(
    `UPDATE prix_vente_produits SET actif = false WHERE id_prixVenteProduit = $1 RETURNING *`,
    [id_prixVenteProduit],
  );
  return result.rows[0];
};

export const updatePrixVenteProduit = async (
  id_prixVenteProduit,
  prix_vente,
) => {
  const result = await pool.query(
    `UPDATE prix_vente_produits SET prix_vente = $1, date_debut = NOW() WHERE id_prixVenteProduit = $2 RETURNING *`,
    [prix_vente, id_prixVenteProduit],
  );
  return result.rows[0];
};
