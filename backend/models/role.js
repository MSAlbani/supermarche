import pool from "../config/database.js";

export const allRole = async () => {
  const roles =
    await pool.query(`SELECT r.id_role, r.libelle, r.description, count(u.id_role) as nombre
        FROM roles r
        LEFT JOIN utilisateurs u ON u.id_role = r.id_role
        GROUP BY u.id_role, r.libelle, r.description, r.id_role
        `);
  return roles.rows;
};

export const create = async (libelle, description) => {
  const result = await pool.query(
    `INSERT INTO roles (libelle, description) VALUES ($1, $2) RETURNING *`,
    [libelle, description],
  );
  return result.rows[0];
};

export const update = async () => {};
