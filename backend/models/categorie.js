import pool from "../config/database.js";

export const findAllCategories = async () => {
  const categories = await pool.query(
    "SELECT id_categorie, libelle FROM categories WHERE actif = true",
  );

  return categories.rows;
};

export const createCategorie = async (libelle, description) => {
  const categorie = await pool.query(
    `INSERT INTO categories (libelle, description) VALUES ($1, $2) RETURNING *`,
    [libelle, description],
  );
  return categorie.rows[0];
};

export const updateCategorie = async (id, libelle, description) => {
  const updatedCategorie = pool.query(
    `
    UPDATE categories SET libelle=$1, description=$2 WHERE id_categorie = $3 RETURNING*`,
    [libelle, description, id],
  );
  return updateCategorie.rows[0];
};

export const toggleState = async (id, actif) => {
  const updateState = pool.query(
    `
    UPDATE categories SET actif = $1 WHERE id_categorie=$2 RETURNING *
    `,
    [id, actif],
  );
  return updateState.rows[0];
};
