import pool from "../config/database.js";

export const findAllProducts = async () => {
  const produits =
    await pool.query(`SELECT p.id_produit, p.libelle, pv.prix_vente,c.libelle as categorie, p.actif FROM produits p 
        JOIN categories c ON c.id_categorie = p.id_categorie
        JOIN prix_vente_produits pv ON pv.id_produit = p.id_produit
        WHERE c.actif = true AND p.actif = true
        ORDER BY p.libelle ASC 
         `);
  return produits.rows;
};

export const createProduct = async (
  libelle,
  id_categorie,
  actif,
  stock_alert,
) => {
  const result = await pool.query(
    `INSERT INTO produits (libelle, actif, id_categorie, stock_alert) VALUES ($1, $2, $3, $4) RETURNING *`,
    [libelle, actif, id_categorie, stock_alert],
  );
  return result.rows[0];
};

export const updateProduct = async (
  id_produit,
  libelle,
  id_categorie,
  actif,
  stock_alert,
) => {
  const result = await pool.query(
    `UPDATE produits SET libelle = $1, id_categorie = $2, actif = $3, stock_alert = $4 WHERE id_produit = $5 RETURNING *`,
    [libelle, id_categorie, actif, stock_alert, id_produit],
  );
  return result.rows[0];
};

export const findProductById = async (id_produit) => {
  const result = await pool.query(
    `SELECT p.id_produit, p.libelle, pv.prix_vente,c.libelle as categorie, p.actif FROM produits p 
        JOIN categories c ON c.id_categorie = p.id_categorie
        JOIN prix_vente_produits pv ON pv.id_produit = p.id_produit
        WHERE c.actif = true AND p.actif = true AND p.id_produit = $1
         `,
    [id_produit],
  );
  return result.rows[0];
};

export const deleteProduct = async (id_produit) => {
  const result = await pool.query(
    `UPDATE produits SET actif = false WHERE id_produit = $1 RETURNING *`,
    [id_produit],
  );
  return result.rows[0];
};

export const findProductByLibelle = async (libelle) => {
  const result = await pool.query(`SELECT * FROM produits WHERE libelle = $1`, [
    libelle,
  ]);
  return result.rows[0];
};
