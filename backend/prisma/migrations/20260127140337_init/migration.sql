-- CreateTable
CREATE TABLE "clients" (
    "id_client" SERIAL NOT NULL,
    "nom_complet" VARCHAR(100),
    "telephone" VARCHAR(30),
    "type_client" VARCHAR(20),
    "plafond_credit" DECIMAL(12,2) DEFAULT 0,
    "actif" BOOLEAN DEFAULT true,
    "date_creation" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "conditionnements" (
    "id_conditionnement" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,
    "quantite_unitaire" DECIMAL(10,2) NOT NULL,
    "id_produit" INTEGER,

    CONSTRAINT "conditionnements_pkey" PRIMARY KEY ("id_conditionnement")
);

-- CreateTable
CREATE TABLE "details_vente" (
    "id_detail_vente" SERIAL NOT NULL,
    "quantite" DECIMAL(10,2) NOT NULL,
    "prix_vente_unitaire" DECIMAL(12,2) NOT NULL,
    "montant_ligne" DECIMAL(14,2) NOT NULL,
    "id_vente" INTEGER,
    "id_lot" INTEGER,

    CONSTRAINT "details_vente_pkey" PRIMARY KEY ("id_detail_vente")
);

-- CreateTable
CREATE TABLE "factures_fournisseurs" (
    "id_facture_fournisseur" SERIAL NOT NULL,
    "numero_facture" VARCHAR(50) NOT NULL,
    "date_facture" DATE NOT NULL,
    "montant_total" DECIMAL(14,2),
    "id_fournisseur" INTEGER,
    "id_utilisateur" INTEGER,

    CONSTRAINT "factures_fournisseurs_pkey" PRIMARY KEY ("id_facture_fournisseur")
);

-- CreateTable
CREATE TABLE "fournisseurs" (
    "id_fournisseur" SERIAL NOT NULL,
    "nom_fournisseur" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(30),
    "adresse" TEXT,
    "date_creation" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fournisseurs_pkey" PRIMARY KEY ("id_fournisseur")
);

-- CreateTable
CREATE TABLE "lignes_facture_fournisseur" (
    "id_ligne_facture" SERIAL NOT NULL,
    "quantite" DECIMAL(10,2) NOT NULL,
    "prix_achat_unitaire" DECIMAL(12,2) NOT NULL,
    "date_peremption" DATE,
    "id_facture_fournisseur" INTEGER,
    "id_produit" INTEGER,
    "id_conditionnement" INTEGER,

    CONSTRAINT "lignes_facture_fournisseur_pkey" PRIMARY KEY ("id_ligne_facture")
);

-- CreateTable
CREATE TABLE "lots_stock" (
    "id_lot" SERIAL NOT NULL,
    "quantite_initiale" DECIMAL(10,2) NOT NULL,
    "quantite_restante" DECIMAL(10,2) NOT NULL,
    "prix_achat_unitaire" DECIMAL(12,2) NOT NULL,
    "date_peremption" DATE,
    "date_reception" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_produit" INTEGER,
    "id_fournisseur" INTEGER,
    "id_facture_fournisseur" INTEGER,

    CONSTRAINT "lots_stock_pkey" PRIMARY KEY ("id_lot")
);

-- CreateTable
CREATE TABLE "mouvements_stock" (
    "id_mouvement" SERIAL NOT NULL,
    "type_mouvement" VARCHAR(20),
    "quantite" DECIMAL(10,2) NOT NULL,
    "date_mouvement" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_lot" INTEGER,
    "id_utilisateur" INTEGER,

    CONSTRAINT "mouvements_stock_pkey" PRIMARY KEY ("id_mouvement")
);

-- CreateTable
CREATE TABLE "prix_vente_produits" (
    "id_prix_vente" SERIAL NOT NULL,
    "prix_vente" DECIMAL(12,2) NOT NULL,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE,
    "actif" BOOLEAN DEFAULT true,
    "id_produit" INTEGER,

    CONSTRAINT "prix_vente_produits_pkey" PRIMARY KEY ("id_prix_vente")
);

-- CreateTable
CREATE TABLE "produits" (
    "id_produit" SERIAL NOT NULL,
    "code_produit" VARCHAR(50) NOT NULL,
    "libelle" VARCHAR(100) NOT NULL,
    "actif" BOOLEAN DEFAULT true,

    CONSTRAINT "produits_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "reglements_clients" (
    "id_reglement" SERIAL NOT NULL,
    "montant" DECIMAL(14,2) NOT NULL,
    "date_reglement" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "mode_reglement" VARCHAR(30),
    "id_client" INTEGER,
    "id_utilisateur" INTEGER,

    CONSTRAINT "reglements_clients_pkey" PRIMARY KEY ("id_reglement")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_role" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom_complet" VARCHAR(100) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "actif" BOOLEAN DEFAULT true,
    "id_role" INTEGER,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "ventes" (
    "id_vente" SERIAL NOT NULL,
    "date_vente" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "montant_total" DECIMAL(14,2),
    "mode_paiement" VARCHAR(30),
    "statut_paiement" VARCHAR(20),
    "id_client" INTEGER,
    "id_utilisateur" INTEGER,

    CONSTRAINT "ventes_pkey" PRIMARY KEY ("id_vente")
);

-- CreateIndex
CREATE UNIQUE INDEX "produits_code_produit_key" ON "produits"("code_produit");

-- CreateIndex
CREATE UNIQUE INDEX "roles_libelle_key" ON "roles"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_login_key" ON "utilisateurs"("login");

-- AddForeignKey
ALTER TABLE "conditionnements" ADD CONSTRAINT "conditionnements_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "details_vente" ADD CONSTRAINT "details_vente_id_lot_fkey" FOREIGN KEY ("id_lot") REFERENCES "lots_stock"("id_lot") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "details_vente" ADD CONSTRAINT "details_vente_id_vente_fkey" FOREIGN KEY ("id_vente") REFERENCES "ventes"("id_vente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factures_fournisseurs" ADD CONSTRAINT "factures_fournisseurs_id_fournisseur_fkey" FOREIGN KEY ("id_fournisseur") REFERENCES "fournisseurs"("id_fournisseur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factures_fournisseurs" ADD CONSTRAINT "factures_fournisseurs_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lignes_facture_fournisseur" ADD CONSTRAINT "lignes_facture_fournisseur_id_conditionnement_fkey" FOREIGN KEY ("id_conditionnement") REFERENCES "conditionnements"("id_conditionnement") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lignes_facture_fournisseur" ADD CONSTRAINT "lignes_facture_fournisseur_id_facture_fournisseur_fkey" FOREIGN KEY ("id_facture_fournisseur") REFERENCES "factures_fournisseurs"("id_facture_fournisseur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lignes_facture_fournisseur" ADD CONSTRAINT "lignes_facture_fournisseur_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lots_stock" ADD CONSTRAINT "lots_stock_id_facture_fournisseur_fkey" FOREIGN KEY ("id_facture_fournisseur") REFERENCES "factures_fournisseurs"("id_facture_fournisseur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lots_stock" ADD CONSTRAINT "lots_stock_id_fournisseur_fkey" FOREIGN KEY ("id_fournisseur") REFERENCES "fournisseurs"("id_fournisseur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lots_stock" ADD CONSTRAINT "lots_stock_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mouvements_stock" ADD CONSTRAINT "mouvements_stock_id_lot_fkey" FOREIGN KEY ("id_lot") REFERENCES "lots_stock"("id_lot") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mouvements_stock" ADD CONSTRAINT "mouvements_stock_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "prix_vente_produits" ADD CONSTRAINT "prix_vente_produits_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reglements_clients" ADD CONSTRAINT "reglements_clients_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reglements_clients" ADD CONSTRAINT "reglements_clients_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventes" ADD CONSTRAINT "ventes_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "clients"("id_client") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ventes" ADD CONSTRAINT "ventes_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateurs"("id_utilisateur") ON DELETE NO ACTION ON UPDATE NO ACTION;
