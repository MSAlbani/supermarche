// ─── Produit tel que retourné par l'API ───────────────────────────────────────
export interface Vente {
  id_produit: number;
  produits: string; // nom du produit
  categories: string;
  prix_vente: number;
  stock: number;
}

// ─── Article dans le panier ───────────────────────────────────────────────────
export interface CartItem {
  id_produit: number;
  produits: string;
  categories: string;
  prix_vente: number;
  stock: number; // stock disponible (pour validation)
  quantite: number; // quantité choisie par l'utilisateur
}

// ─── Résultat du calcul des totaux ────────────────────────────────────────────
export interface Totals {
  subtotal: number; // somme brute avant remise
  discountAmount: number; // montant de la remise en FCFA
  totalHT: number; // subtotal - discountAmount
  tva: number; // totalHT * TVA_RATE
  totalTTC: number; // totalHT + tva
}

// ─── Modes de paiement acceptés ───────────────────────────────────────────────
export type PaymentMethod =
  | "espèces"
  | "carte_bancaire"
  | "chèque"
  | "assurance";

// ─── Payload envoyé au backend lors de la finalisation ────────────────────────
export interface SalePayload {
  clientId: string | null;
  items: Array<{ id_produit: number; quantite: number; prix_unitaire: number }>;
  paymentMethod: PaymentMethod;
  discount: number;
  totals: Totals;
}
