import pool from "../config/database.js";

export const create = async (data) => {
  const { idUtilisateur, token } = data;
  const result = await pool.query(
    `INSERT INTO refresh_tokens (id_utilisateur, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')
    ON CONFLICT (id_utilisateur)
     DO UPDATE SET
       token = EXCLUDED.token,
       expires_at = EXCLUDED.expires_at,
       create_at = NOW()
    RETURNING *`,
    [idUtilisateur, token],
  );
  return result.rows[0];
};

export const findByRefreshToken = async (token) => {
  const result = await pool.query(
    `SELECT id_utilisateur, token, expires_at FROM refresh_tokens WHERE token = $1`,
    [token],
  );
  return result.rows[0];
};

export const deleteByRefreshToken = async (token) => {
  await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
};
