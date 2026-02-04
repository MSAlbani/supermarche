export interface Produit {
  id: number;
  nom: string;
  categorie: string;
  forme: string;
  prix: number;
  stock: number;
  ordonnance: boolean;
}

export const produits: Produit[] = [
  {
    id: 1,
    nom: "Paracétamol 500mg",
    categorie: "Antalgique",
    forme: "Comprimé",
    prix: 500,
    stock: 120,
    ordonnance: false,
  },
  {
    id: 2,
    nom: "Amoxicilline 500mg",
    categorie: "Antibiotique",
    forme: "Gélule",
    prix: 1200,
    stock: 45,
    ordonnance: true,
  },
  {
    id: 3,
    nom: "Ibuprofène 400mg",
    categorie: "Anti-inflammatoire",
    forme: "Comprimé",
    prix: 800,
    stock: 15,
    ordonnance: false,
  },
  {
    id: 4,
    nom: "Vitamine C",
    categorie: "Vitamine",
    forme: "Comprimé",
    prix: 300,
    stock: 200,
    ordonnance: false,
  },
];
