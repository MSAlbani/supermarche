CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    libelle VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    nom_complet VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    id_role INT REFERENCES roles(id_role)
);
CREATE TABLE fournisseurs (
    id_fournisseur SERIAL PRIMARY KEY,
    nom_fournisseur VARCHAR(100) NOT NULL,
    telephone VARCHAR(30),
    adresse TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE clients (
    id_client SERIAL PRIMARY KEY,
    nom_complet VARCHAR(100),
    telephone VARCHAR(30),
    type_client VARCHAR(20) CHECK (type_client IN ('ABONNE', 'OCCASIONNEL')),
    plafond_credit NUMERIC(12,2) DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categories (
    id_categorie SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE
);
CREATE TABLE produits (
    id_produit SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    id_categorie INT REFERENCES categories(id_categorie)
);
CREATE TABLE conditionnements (
    id_conditionnement SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL,
    quantite_unitaire NUMERIC(10,2) NOT NULL,
    id_produit INT REFERENCES produits(id_produit)
);
CREATE TABLE prix_vente_produits (
    id_prix_vente SERIAL PRIMARY KEY,
    prix_vente NUMERIC(12,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    actif BOOLEAN DEFAULT TRUE,
    id_produit INT REFERENCES produits(id_produit)
);
CREATE TABLE factures_fournisseurs (
    id_facture_fournisseur SERIAL PRIMARY KEY,
    numero_facture VARCHAR(50) NOT NULL,
    date_facture DATE NOT NULL,
    montant_total NUMERIC(14,2),
    id_fournisseur INT REFERENCES fournisseurs(id_fournisseur),
    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur)
);
CREATE TABLE lignes_facture_fournisseur (
    id_ligne_facture SERIAL PRIMARY KEY,
    quantite NUMERIC(10,2) NOT NULL,
    prix_achat_unitaire NUMERIC(12,2) NOT NULL,
    date_peremption DATE,
    id_facture_fournisseur INT REFERENCES factures_fournisseurs(id_facture_fournisseur),
    id_produit INT REFERENCES produits(id_produit),
    id_conditionnement INT REFERENCES conditionnements(id_conditionnement)
);
CREATE TABLE lots_stock (
    id_lot SERIAL PRIMARY KEY,
    quantite_initiale NUMERIC(10,2) NOT NULL,
    quantite_restante NUMERIC(10,2) NOT NULL,
    prix_achat_unitaire NUMERIC(12,2) NOT NULL,
    date_peremption DATE,
    date_reception TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_produit INT REFERENCES produits(id_produit),
    id_fournisseur INT REFERENCES fournisseurs(id_fournisseur),
    id_facture_fournisseur INT REFERENCES factures_fournisseurs(id_facture_fournisseur)
);
CREATE TABLE mouvements_stock (
    id_mouvement SERIAL PRIMARY KEY,
    type_mouvement VARCHAR(20) CHECK (type_mouvement IN ('ENTREE', 'SORTIE', 'PERTE')),
    quantite NUMERIC(10,2) NOT NULL,
    date_mouvement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_lot INT REFERENCES lots_stock(id_lot),
    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur)
);
CREATE TABLE ventes (
    id_vente SERIAL PRIMARY KEY,
    date_vente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    montant_total NUMERIC(14,2),
    tva NUMERIC(14,2),
    mode_paiement VARCHAR(30),
    statut_paiement VARCHAR(20) CHECK (statut_paiement IN ('PAYE', 'EN_COURS', 'IMPAYE')),
    id_client INT REFERENCES clients(id_client),
    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur)
);
CREATE TABLE details_vente (
    id_detail_vente SERIAL PRIMARY KEY,
    quantite NUMERIC(10,2) NOT NULL,
    prix_vente_unitaire NUMERIC(12,2) NOT NULL,
    id_vente INT REFERENCES ventes(id_vente),
    id_lot INT REFERENCES lots_stock(id_lot)
);
CREATE TABLE reglements_clients (
    id_reglement SERIAL PRIMARY KEY,
    montant NUMERIC(14,2) NOT NULL,
    date_reglement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode_reglement VARCHAR(30),
    id_client INT REFERENCES clients(id_client),
    id_utilisateur INT REFERENCES utilisateurs(id_utilisateur)
);
