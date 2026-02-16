import { allCategories } from "../models/categorie.js";

export const getAllCategorie = async (req, res) => {
  const categories = await allCategories();

  res.status(200).json(categories);
};
