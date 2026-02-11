import pool from "../config/database.js";

export const getAllVentes = async () => {
  const result = await pool.query(`
        SELECT 
            u.nom_complet,
            v.date_vente, 
            v.id_vente,  
            v.montant_total,
            v.statut_paiement, 
            v.mode_paiement
        FROM ventes v 
        JOIN details_vente dv ON v.id_vente = dv.id_vente
        JOIN lots_stock ls ON dv.id_lot = ls.id_lot
        JOIN produits p ON p.id_produit = ls.id_produit
        JOIN utilisateurs u ON v.id_utilisateur = u.id_utilisateur
        ORDER BY v.date_vente DESC `);
  return result.rows;
};

export const getVenteById = async (id_vente) => {
  const vente = await pool.query(
    `
        SELECT
            u.nom_complet,
            v.date_vente, 
            v.id_vente,  
            v.montant_total,
            v.statut_paiement, 
            v.mode_paiement
        FROM ventes v 
        JOIN details_vente dv ON v.id_vente = dv.id_vente
        JOIN lots_stock ls ON dv.id_lot = ls.id_lot
        JOIN produits p ON p.id_produit = ls.id_produit
        JOIN utilisateurs u ON v.id_utilisateur = u.id_utilisateur
        WHERE v.id_vente = $1
        `,
    [id_vente],
  );
  return vente.rows;
};
