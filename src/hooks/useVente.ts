import { useCallback, useMemo, useState } from "react";
import type {
  CartItem,
  PaymentMethod,
  SalePayload,
  Totals,
  Vente,
} from "../types/vente";

// ─── Constantes métier ────────────────────────────────────────────────────────
const TVA_RATE = 0.19; // 19 %

// ─── Hook principal ───────────────────────────────────────────────────────────
export function useVente() {
  // Panier
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sélection client (null = anonyme)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Remise en %
  const [discount, setDiscount] = useState<number>(0);

  // Mode de paiement
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("espèces");

  // État requête
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ── Panier : ajouter ──────────────────────────────────────────────────────
  const addToCart = useCallback((produit: Vente) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id_produit === produit.id_produit);

      if (existing) {
        // Vérifier le stock avant d'augmenter la quantité
        if (existing.quantite >= produit.stock) {
          // On ne peut pas dépasser le stock — on retourne le panier inchangé
          return prev;
        }
        return prev.map((i) =>
          i.id_produit === produit.id_produit
            ? { ...i, quantite: i.quantite + 1 }
            : i,
        );
      }

      if (produit.stock === 0) return prev; // rupture de stock

      return [...prev, { ...produit, quantite: 1 }];
    });
  }, []);

  // ── Panier : supprimer un article ─────────────────────────────────────────
  const removeFromCart = useCallback((id_produit: number) => {
    setCart((prev) => prev.filter((i) => i.id_produit !== id_produit));
  }, []);

  // ── Panier : modifier la quantité directement ─────────────────────────────
  const updateQuantity = useCallback(
    (id_produit: number, quantite: number) => {
      if (quantite <= 0) {
        removeFromCart(id_produit);
        return;
      }
      setCart((prev) =>
        prev.map((i) => {
          if (i.id_produit !== id_produit) return i;
          // Limiter au stock disponible
          const safeQty = Math.min(quantite, i.stock);
          return { ...i, quantite: safeQty };
        }),
      );
    },
    [removeFromCart],
  );

  // ── Panier : vider ────────────────────────────────────────────────────────
  const clearCart = useCallback(() => setCart([]), []);

  // ── Calcul des totaux (mémoïsé) ───────────────────────────────────────────
  const totals = useMemo<Totals>(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.quantite * item.prix_vente,
      0,
    );
    const discountAmount = subtotal * (discount / 100);
    const totalHT = subtotal - discountAmount;
    const tva = totalHT * TVA_RATE;
    const totalTTC = totalHT + tva;

    return { subtotal, discountAmount, totalHT, tva, totalTTC };
  }, [cart, discount]);

  // ── Remise : setter sécurisé (0–100) ─────────────────────────────────────
  const handleDiscountChange = useCallback((value: string) => {
    const parsed = parseFloat(value);
    setDiscount(isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed)));
  }, []);

  // ── Finaliser la vente ────────────────────────────────────────────────────
  const finalizeSale = useCallback(async (): Promise<boolean> => {
    if (cart.length === 0) {
      setError(
        "Veuillez ajouter des médicaments au panier avant de finaliser.",
      );
      return false;
    }

    setIsLoading(true);
    setError(null);

    const payload: SalePayload = {
      clientId: selectedClientId,
      items: cart.map(({ id_produit, quantite, prix_vente }) => ({
        id_produit,
        quantite,
        prix_unitaire: prix_vente,
      })),
      paymentMethod,
      discount,
      totals,
    };

    try {
      // TODO: remplacer par votre appel API réel
      // await api.post("/ventes", payload);
      console.info("[Vente] Payload envoyé :", payload);

      clearCart();
      setDiscount(0);
      setSelectedClientId(null);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur lors de la finalisation.";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [cart, selectedClientId, paymentMethod, discount, totals, clearCart]);

  // ── API publique du hook ──────────────────────────────────────────────────
  return {
    // État panier
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Client
    selectedClientId,
    setSelectedClientId,

    // Remise & paiement
    discount,
    handleDiscountChange,
    paymentMethod,
    setPaymentMethod,

    // Totaux
    totals,
    TVA_RATE,

    // Requête
    isLoading,
    error,
    setError,
    finalizeSale,
  };
}
