import { getOrCreatePanier, getPanierDetail } from "../models/panier.js";
import pool from "../config/database.js";

export const addToPanier = async (req, res) => {
  const { id_lot, quantite } = req.body;
  const id_utilisateur = req.user.id_utilisateur;

  // Panier actif ou création
  const panier = await getOrCreatePanier(id_utilisateur);

  // Vérifier si le lot existe et est actif dans le panier
  const { rows } = await pool.query(
    `SELECT * FROM panier_lignes 
         WHERE id_panier = $1 AND id_lot = $2`,
    [panier.id_panier, id_lot],
  );

  if (rows.length > 0) {
    // Mettre à jour la quantité
    await pool.query(
      `UPDATE panier_lignes 
             SET quantite = quantite + $1
             WHERE id_ligne = $2`,
      [quantite, rows[0].id_ligne],
    );
  } else {
    // Ajouter un nouveau lot au panier
    await pool.query(
      `INSERT INTO panier_lignes (id_panier, id_lot, quantite) VALUES ($1, $2, $3)`,
      [panier.id_panier, id_lot, quantite],
    );
  }
  res.status(200).json({ message: "Produit ajouté au panier" });
};

export const afficherPanier = async (req, res) => {
  const id_utilisateur = req.user.id_utilisateur;

  const lignes = await getPanierDetail(id_utilisateur);

  if (lignes.length === 0) {
    return res.json({
      panier: [],
      total: 0,
    });
  }

  const total = lignes.reduce(
    (sum, ligne) => sum + Number(ligne.total_ligne),
    0,
  );

  res.json({
    panier: lignes,
    total,
  });
};
