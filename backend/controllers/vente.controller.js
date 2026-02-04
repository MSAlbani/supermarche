import pool from "../config/database.js";

export const validerVente = async (req, res) => {
  const client = await pool.connect();

  try {
    const { mode_paiement, id_client = null } = req.body;
    const id_utilisateur = req.user.id_utilisateur;

    await client.query("BEGIN");

    //  Récupérer le panier actif (verrouillé)
    const panierResultat = await client.query(
      `SELECT id_panier 
       FROM paniers 
       WHERE id_utilisateur = $1 AND actif = true
       FOR UPDATE`,
      [id_utilisateur],
    );

    if (panierResultat.rowCount === 0) {
      throw new Error("Aucun panier actif");
    }

    const id_panier = panierResultat.rows[0].id_panier;

    //  Récupérer les lignes du panier
    const lignesPanier = await client.query(
      `SELECT 
          pl.id_lot,
          pl.quantite,
          pv.prix_vente
       FROM panier_lignes pl
       JOIN lots_stock ls ON pl.id_lot = ls.id_lot
       JOIN prix_vente_produits pv ON pv.id_produit = ls.id_produit
       WHERE pl.id_panier = $1 AND pv.actif = true`,
      [id_panier],
    );

    if (lignesPanier.rowCount === 0) {
      throw new Error("Le panier est vide");
    }

    //  Calcul des montants
    let total_ht = 0;
    for (const ligne of lignesPanier.rows) {
      total_ht += ligne.quantite * ligne.prix_vente;
    }

    const tva = total_ht * 0.19;
    const statut_paiement = mode_paiement === "ESPECE" ? "PAYE" : "EN_COURS";

    //  Création de la vente
    const venteResultat = await client.query(
      `INSERT INTO ventes 
       (date_vente, montant_total, tva, mode_paiement, statut_paiement, id_utilisateur, id_client)
       VALUES (NOW(), $1, $2, $3, $4, $5, $6)
       RETURNING id_vente`,
      [
        total_ht,
        tva,
        mode_paiement,
        statut_paiement,
        id_utilisateur,
        id_client,
      ],
    );

    const id_vente = venteResultat.rows[0].id_vente;

    //  Détails de vente + mise à jour du stock
    for (const ligne of lignesPanier.rows) {
      // Verrouiller le lot
      const stockResult = await client.query(
        `SELECT quantite_restante 
         FROM lots_stock 
         WHERE id_lot = $1
         FOR UPDATE`,
        [ligne.id_lot],
      );

      if (stockResult.rowCount === 0) {
        throw new Error(`Lot ${ligne.id_lot} introuvable`);
      }

      const quantiteDisponible = stockResult.rows[0].quantite_restante;

      if (quantiteDisponible < ligne.quantite) {
        throw new Error(`Stock insuffisant pour le lot ${ligne.id_lot}`);
      }

      // Détail vente
      await client.query(
        `INSERT INTO details_vente
         (quantite, prix_vente_unitaire, id_vente, id_lot)
         VALUES ($1, $2, $3, $4)`,
        [ligne.quantite, ligne.prix_vente, id_vente, ligne.id_lot],
      );

      // Sortie de stock
      await client.query(
        `UPDATE lots_stock
         SET quantite_restante = quantite_restante - $1
         WHERE id_lot = $2`,
        [ligne.quantite, ligne.id_lot],
      );

      // Mouvement de stock
      await client.query(
        `INSERT INTO mouvements_stock
         (type_mouvement, quantite, date_mouvement, id_lot, id_utilisateur)
         VALUES ('SORTIE', $1, NOW(), $2, $3)`,
        [ligne.quantite, ligne.id_lot, id_utilisateur],
      );
    }

    //  Désactiver le panier
    await client.query(
      `UPDATE paniers SET actif = false WHERE id_panier = $1`,
      [id_panier],
    );

    //  Créer un nouveau panier vide
    await client.query(
      `INSERT INTO paniers (id_utilisateur, actif) VALUES ($1, true)`,
      [id_utilisateur],
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Vente validée avec succès",
      id_vente,
      total_ht,
      tva,
      statut_paiement,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({
      error: error.message,
    });
  } finally {
    client.release();
  }
};
