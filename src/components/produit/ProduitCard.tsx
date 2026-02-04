import React from "react";
import Card from "../ui/Card";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";

interface ProduitCardProps {
  nom: string;
  dosage: string;
  marque: string;
  prix: number;
  stock: number;
  expire: string;
  categories: string[];
  forme: string;
  lowStock?: boolean;
}

export const ProduitCard: React.FC<ProduitCardProps> = ({
  nom,
  dosage,
  marque,
  prix,
  stock,
  expire,
  categories,
  forme,
  lowStock = false,
}) => {
  return (
    <Card className={`${lowStock ? "border-red-500" : ""} hover:shadow-xl `}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{nom}</h3>
        <div className="flex space-x-2">
          <button className="text-green-500 justify-items-center  rounded-sm h-8 w-8 hover:bg-green-100">
            <Edit className="w-4 h-4" />
          </button>
          <button className="h-8 w-8 rounded-sm justify-items-center hover:bg-red-100 text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-500">{marque}</p>
      <div>
        <span className="text-green-600 font-semibold text-lg mt-2">
          {prix} FCFA
        </span>
        <Badge className="text-xs">{dosage}</Badge>
      </div>

      <div className="flex justify-between mt-2 text-gray-600 text-sm">
        <span>Stock: {stock}</span>
        <span>Expire: {expire}</span>
      </div>
      <div className="flex flex-wrap mt-2 gap-1">
        {categories.map((cat, idx) => (
          <span
            key={idx}
            className="bg-gray-200 rounded-full px-2 py-0.5 text-xs"
          >
            {cat}
          </span>
        ))}
        <span className="bg-gray-200 rounded-full px-2 py-0.5 text-xs">
          {forme}
        </span>
      </div>
    </Card>
  );
};
