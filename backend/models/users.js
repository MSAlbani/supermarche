// models/users.js

import pool from "../config/database.js";

// Récuperer un utilisateur à travers son login
export const getUserByLogin = async (login) => {
  const result = await pool.query(
    `SELECT u.id_utilisateur, u.nom_complet, u.login, u.mot_de_passe, u.actif, r.libelle AS role
        FROM utilisateurs u
        LEFT JOIN roles r ON r.id_role = u.id_role
        WHERE u.login = $1`,
    [login],
  );
  return result.rows[0];
};

// Créer un nouvel utilisateur

export const createUser = async (nom_complet, login, mot_de_passe, id_role) => {
  const result = await pool.query(
    "INSERT INTO utilisateurs (nom_complet, login, mot_de_passe, id_role) VALUES ($1, $2, $3, $4) RETURNING *",
    [nom_complet, login, mot_de_passe, id_role],
  );
  return result.rows[0];
};
