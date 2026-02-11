import pool from "../config/database.js";

export const allCategories = async () => {
  const categories = await pool.query("SELECT * FROM categories");

  return categories.rows;
};

export const create = async (libelle, description) => {
  const categorie = await pool.query(
    `INSERT INTO categories (libelle, description) VALUES ($1, $2) RETURNING *`,
    [libelle, description],
  );
  return categorie.rows[0];
};

export const update = async (id, libelle, description) => {}

