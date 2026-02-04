import pool from "../config/database.js";

export const getOrCreatePanier = async (id_utilisateur) => {
  // Vérifier si l'utilisateur a déjà un panier actif
  const result = await pool.query(
    `SELECT * FROM paniers WHERE id_utilisateur = $1 AND actif = true`,
    [id_utilisateur],
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  }
  // Sinon, créer un nouveau panier
  const resultCreatePanier = await pool.query(
    `INSERT INTO paniers (id_utilisateur) VALUES ($1) RETURNING *`,
    [id_utilisateur],
  );
  return resultCreatePanier.rows[0];
};

export const getPanierDetail = async (id_utilisateur) => {
  const query = `
    SELECT
      p.id_panier,
      pr.id_produit,
      pr.libelle AS produit,
      ls.id_lot,
      pl.quantite,
      pv.prix_vente,
      (pl.quantite * pv.prix_vente) AS total_ligne
    FROM paniers p
    JOIN panier_lignes pl ON pl.id_panier = p.id_panier
    JOIN lots_stock ls ON ls.id_lot = pl.id_lot
    JOIN produits pr ON pr.id_produit = ls.id_produit
    JOIN prix_vente_produits pv 
      ON pv.id_produit = pr.id_produit
     AND pv.actif = true
    WHERE p.id_utilisateur = $1
      AND p.actif = true;
  `;

  const { rows } = await pool.query(query, [id_utilisateur]);
  return rows;
};
