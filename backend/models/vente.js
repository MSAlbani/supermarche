import pool from "../config/database.js";

export const findAllVentes = async () => {
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

export const findVenteById = async (id_vente) => {
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

export const createVente = async (data) => {
  const {
    montant_total,
    tva,
    mode_paiement,
    statut_paiement,
    id_client,
    id_utilisateur,
  } = data;

  const vente = await pool.query(
    `INSERT INTO ventes (date_vente, montant_total, tva, mode_paiement, statut_paiement, id_client, id_utilisateur) VALUES (NOW(), $1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      montant_total,
      tva,
      mode_paiement,
      statut_paiement,
      id_client,
      id_utilisateur,
    ],
  );
  return vente.rows[0];
};

export const updateVente = async (id_vente, montant) => {
  const updatedVente = await pool.query(
    `
    UPDATE ventes SET montant_paye=$1 WHERE id_vente=$2 RETURNING *
    `,
    [id_vente, montant],
  );
  return updatedVente.rows[0];
};

export const allProduitsVente = async () => {
  const produitVente = await pool.query(`
    SELECT p.id_produit, p.libelle as produits, c.libelle as categories, pr.prix_vente, sum(ls.quantite_restante) as stock 
    FROM produits p 
    JOIN categories c on c.id_categorie=p.id_categorie
    JOIN prix_vente_produits pr on pr.id_produit=p.id_produit  
    JOIN lots_stock ls on ls.id_produit=p.id_produit
    WHERE p.actif=true and c.actif=true and pr.actif=true  
    GROUP BY p.libelle, c.libelle, pr.prix_vente, p.id_produit`);
  return produitVente.rows;
};
export const annulerVente = async (id_vente, cause) => {};
