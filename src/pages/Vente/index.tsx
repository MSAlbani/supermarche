import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  DollarSign,
  Minus,
  Package,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";

import { useVente } from "../../hooks/useVente";
import { useVenteStore } from "../../store/venteStore";
import type { CartItem, Vente } from "../../types/vente";

// ─── Constante locale (liste clients — à remplacer par un vrai appel API) ─────
const CLIENTS: Array<{ id: string; nom: string }> = [
  // { id: "c1", nom: "Moussa Diallo" },
  // { id: "c2", nom: "Aïcha Konaté" },
];

// ─── Sous-composant : ligne de produit dans les résultats ─────────────────────
function ProductRow({
  produit,
  onAdd,
}: {
  produit: Vente;
  onAdd: (p: Vente) => void;
}) {
  const outOfStock = produit.stock === 0;

  return (
    <div
      className={`flex items-center justify-between p-3 border-b last:border-0 transition-colors ${
        outOfStock
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-green-50 cursor-pointer"
      }`}
      onClick={() => !outOfStock && onAdd(produit)}
      role="button"
      tabIndex={outOfStock ? -1 : 0}
      onKeyDown={(e) => e.key === "Enter" && !outOfStock && onAdd(produit)}
      aria-disabled={outOfStock}
    >
      <div>
        <p className="font-medium text-gray-800">{produit.produits}</p>
        <p className="text-sm text-gray-500">{produit.categories}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">
          {produit.prix_vente.toLocaleString()} FCFA
        </p>
        <p
          className={`text-xs ${outOfStock ? "text-red-500" : "text-gray-400"}`}
        >
          {outOfStock ? "Rupture de stock" : `Stock : ${produit.stock}`}
        </p>
      </div>
    </div>
  );
}

// ─── Sous-composant : ligne dans le panier ────────────────────────────────────
function CartRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem;
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="font-medium text-gray-800 truncate">{item.produits}</p>
        <p className="text-sm text-gray-500">
          {item.prix_vente.toLocaleString()} FCFA / unité
        </p>
      </div>

      {/* Contrôle quantité */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onUpdateQty(item.id_produit, item.quantite - 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors"
          aria-label="Diminuer la quantité"
        >
          <Minus className="w-3 h-3" />
        </button>

        <span className="w-8 text-center font-semibold text-gray-800">
          {item.quantite}
        </span>

        <button
          onClick={() => onUpdateQty(item.id_produit, item.quantite + 1)}
          disabled={item.quantite >= item.stock}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Augmenter la quantité"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Sous-total ligne */}
      <p className="w-28 text-right font-semibold text-gray-800 shrink-0">
        {(item.quantite * item.prix_vente).toLocaleString()} FCFA
      </p>

      {/* Supprimer */}
      <button
        onClick={() => onRemove(item.id_produit)}
        className="ml-3 text-gray-400 hover:text-red-500 transition-colors shrink-0"
        aria-label={`Retirer ${item.produits} du panier`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Vente(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"new_sale" | "sales_history">(
    "new_sale",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Données produits depuis le store Zustand
  const { produitsVente, getProduitsVente, loadingVente } = useVenteStore();

  // Logique métier isolée dans le hook
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    selectedClientId,
    setSelectedClientId,
    discount,
    handleDiscountChange,
    paymentMethod,
    setPaymentMethod,
    totals,
    TVA_RATE,
    isLoading,
    error,
    setError,
    finalizeSale,
  } = useVente();

  useEffect(() => {
    getProduitsVente();
  }, [getProduitsVente]);

  // Recherche textuelle mémoïsée
  const filteredProduits = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];
    return produitsVente.filter((p: Vente) =>
      p.produits.toLowerCase().includes(term),
    );
  }, [searchTerm, produitsVente]);

  // Gestion de la finalisation avec feedback utilisateur
  const handleFinalizeSale = async () => {
    const success = await finalizeSale();
    if (success) {
      setSuccessMessage("Vente finalisée avec succès !");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* En-tête ──────────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Ventes
          </h1>
          <p className="text-gray-600">
            Interface de point de vente et historique des transactions
          </p>
        </div>

        {/* Messages globaux ─────────────────────────────────────────────────── */}
        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Onglets ─────────────────────────────────────────────────────────── */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "new_sale" ? "primary" : "outline"}
            onClick={() => setActiveTab("new_sale")}
            className={
              activeTab === "new_sale"
                ? "bg-linear-to-r from-green-500 to-emerald-600 text-white"
                : ""
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Vente
            {totalItems > 0 && (
              <span className="ml-2 bg-white text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Button>

          <Button
            variant={activeTab === "sales_history" ? "primary" : "outline"}
            onClick={() => setActiveTab("sales_history")}
            className={
              activeTab === "sales_history"
                ? "bg-linear-to-r from-green-500 to-emerald-600 text-white"
                : ""
            }
          >
            <Receipt className="w-4 h-4 mr-2" />
            Historique
          </Button>
        </div>

        {/* ─── Onglet Nouvelle Vente ──────────────────────────────────────── */}
        {activeTab === "new_sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche ──────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recherche -------------------------------------------------- */}
              <Card className="border-gray-300 bg-white/90 backdrop-blur-sm shadow-lg">
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <Search className="w-5 h-5 text-green-600" />
                  Rechercher des produits
                </div>

                <div className="mb-5">
                  <div className="relative">
                    <Search className="top-1/2 left-3 text-gray-400 -translate-y-1/2 absolute w-4 h-4" />
                    <Input
                      placeholder="Nom du produit ou catégorie…"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Rechercher un produit"
                    />
                  </div>
                </div>

                {loadingVente && (
                  <p className="text-sm text-gray-400 text-center py-2">
                    Chargement des produits…
                  </p>
                )}

                {searchTerm && !loadingVente && (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredProduits.length > 0 ? (
                      filteredProduits.map((prod: Vente) => (
                        <ProductRow
                          key={prod.id_produit}
                          produit={prod}
                          onAdd={(p) => {
                            addToCart(p);
                            setSearchTerm(""); // ferme la liste après ajout
                          }}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun médicament trouvé pour «&nbsp;{searchTerm}&nbsp;»
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Panier ----------------------------------------------------- */}
              <Card className="bg-white/90 border-gray-300 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center font-semibold text-xl gap-2">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    Panier
                    {totalItems > 0 && (
                      <span className="text-sm font-normal text-gray-500">
                        ({totalItems} article{totalItems > 1 ? "s" : ""})
                      </span>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Vider le panier
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p>Votre panier est vide</p>
                    <p className="text-sm mt-1">
                      Utilisez la recherche pour ajouter des produits
                    </p>
                  </div>
                ) : (
                  <div>
                    {cart.map((item) => (
                      <CartRow
                        key={item.id_produit}
                        item={item}
                        onRemove={removeFromCart}
                        onUpdateQty={updateQuantity}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Colonne droite ─────────────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Sélection client ------------------------------------------ */}
              <Card className="border-gray-300">
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <User className="w-5 h-5 text-green-600" />
                  Client
                </div>

                <div>
                  <Label>Sélectionner un client</Label>
                  <Select
                    value={selectedClientId ?? "anonymous"}
                    onValueChange={(v) =>
                      setSelectedClientId(v === "anonymous" ? null : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Client anonyme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anonymous">Client anonyme</SelectItem>
                      {CLIENTS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Résumé & paiement ----------------------------------------- */}
              <Card className="border-gray-300">
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Résumé de la vente
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total :</span>
                    <span className="font-medium">
                      {totals.subtotal.toLocaleString()} FCFA
                    </span>
                  </div>

                  {/* Remise */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-600 shrink-0">Remise (%) :</span>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="text-right w-24"
                      min="0"
                      max="100"
                      aria-label="Remise en pourcentage"
                    />
                  </div>

                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Remise appliquée :</span>
                      <span>
                        − {totals.discountAmount.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total HT :</span>
                    <span className="font-medium">
                      {totals.totalHT.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      TVA ({(TVA_RATE * 100).toFixed(0)}%) :
                    </span>
                    <span className="font-medium">
                      {totals.tva.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      FCFA
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-base font-bold">
                    <span>Total TTC :</span>
                    <span className="text-green-600">
                      {totals.totalTTC.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Mode de paiement */}
                <div className="space-y-2 my-6">
                  <Label>Mode de paiement</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setPaymentMethod(v as typeof paymentMethod)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="espèces">💵 Espèces</SelectItem>
                      <SelectItem value="carte_bancaire">
                        💳 Carte bancaire
                      </SelectItem>
                      <SelectItem value="chèque">📝 Chèque</SelectItem>
                      <SelectItem value="assurance">🏥 Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleFinalizeSale}
                  disabled={cart.length === 0 || isLoading}
                  className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 text-base font-semibold disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isLoading ? "Finalisation en cours…" : "Finaliser la Vente"}
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* ─── Onglet Historique ──────────────────────────────────────────── */}
        {activeTab === "sales_history" && (
          <div className="text-gray-500 text-center py-16">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>L'historique des ventes sera affiché ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
