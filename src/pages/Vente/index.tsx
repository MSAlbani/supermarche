import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import {
  Search,
  Plus,
  Trash2,
  DollarSign,
  Receipt,
  Package,
  User,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
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
import Table from "../../components/ui/Table";
import { produits } from "./produit";
import { columns } from "./columns";

const CATEGORIES = [
  "antalgique",
  "antibiotique",
  "anti-inflammatoire",
  "vitamine",
  "cardiovasculaire",
  "digestif",
  "respiratoire",
  "dermatologie",
  "autre",
];

export default function Vente(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("new_sale");
  const [cart, setCart] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState("espèces");
  const [filteredProduits, setFiltredProduitss] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0);
  const TVA_RATE = 0.19;

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert(
        "Veuillez ajouter des médicaments au panier avant de finaliser la vente.",
      );
      return;
    }
  };

  const calculateTotals = () => {
    const subtotal = 100;
    // cart.reduce(
    //   (sum, item) => sum + item.quantite * item.prix_unitaire,
    //   0,
    // );
    const discountAmount = subtotal;
    const totalHT = subtotal - discountAmount;
    const tva = totalHT * TVA_RATE;
    const totalTTC = totalHT + tva;

    return {
      subtotal,
      totalHT,
      tva,
      totalTTC,
      discountAmount,
    };
  };

  const { subtotal, totalHT, tva, totalTTC, discountAmount } =
    calculateTotals();
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestion des Ventes
          </h1>
          <p className="text-gray-600">
            Interface de point de vente et historique des transactions
          </p>
        </div>

        {/* Onglets */}
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
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Vente
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
            <Receipt className="w-4 h-4 mr-2" /> Historique
          </Button>
        </div>
        {activeTab === "new_sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche: Recherche et Panier */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recherche des produits */}
              <Card className="border-gray-300 bg-white/90 backdrop-blur-sm shadow-lg">
                {/* Titre de la carte */}
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <Search className="w-5 h-5 text-green-600" />
                  Rechercher des produits
                </div>
                {/* Body de la carte  */}
                <div className="mb-5">
                  <div className="relative">
                    <Search className="top-1/2 left-3 text-gray-400 -translate-y-1/2 absolute w-4 h-4" />
                    <Input
                      placeholder="Nom du produit ou Fabricant"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {searchTerm && (
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                    {filteredProduits.length > 0 ? (
                      filteredProduits.map((med) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between p-3 border-b hover:bg-green-50 cursor-pointer"
                          onClick={() => addToCart(med)}
                        >
                          <div>
                            <p className="font-medium">{med.nom}</p>
                            <p className="text-sm text-gray-600">
                              {med.fabricant} - {med.dosage}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-green-600">
                              {med.prix_unitaire?.toFixed(2)} DH
                            </span>
                            <p className="text-xs text-gray-500">
                              Stock: {med.stock_actuel}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun médicament trouvé
                      </div>
                    )}
                  </div>
                )}
              </Card>

              <Card className="bg-white/90 border-gray-300 backdrop-blur-sm shadow-lg">
                {/* Titre de la carte */}
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  Panier
                </div>

                {/* Body de la carte  */}
                <div className="">
                  {cart.length !== 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Votre panier est vide</p>
                    </div>
                  ) : (
                    <Table data={produits} columns={columns} />
                  )}
                </div>
              </Card>
            </div>
            {/* Colonne droite: Client et Totaux */}
            <div className="space-y-6">
              {/* Informations sur le client */}
              <Card className="border-gray-300">
                {/* Titre de la carte */}
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <User className="w-5 h-5 text-green-600" />
                  Client
                </div>
                <div>
                  <Label htmlFor="client-select">Sélectionner un client</Label>
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Client anonyme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Client anonyme</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
              {/* Résumé et paiement */}
              <Card className="border-gray-300">
                {/* Titre de la carte */}
                <div className="flex items-center font-semibold text-xl gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Résumé de la vente
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{subtotal.toFixed(2)} FCFA</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Remise (%):</span>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          Math.max(
                            0,
                            Math.min(100, parseFloat(e.target.value) || 0),
                          ),
                        )
                      }
                      className="text-right"
                      min="0"
                      max="100"
                    />
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Remise appliquée:</span>
                      <span>-{discountAmount.toFixed(2)} DH</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Total HT:</span>
                    <span>{totalHT.toFixed(2)} FCFA</span>
                  </div>

                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span>{tva.toFixed(2)} FCFA</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between text-xl font-bold">
                    <span>Total TTC:</span>
                    <span className="text-green-600">
                      {totalTTC.toFixed(2)} FCFA
                    </span>
                  </div>
                </div>

                <div className="space-y-2 my-8">
                  <Label>Mode de paiement</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
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
                  className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 text-lg font-semibold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isLoading ? "Finalisation..." : "Finaliser la Vente"}
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "sales_history" && (
          <div>
            <div>Historiques</div>
          </div>
        )}
      </div>
    </div>
  );
}
