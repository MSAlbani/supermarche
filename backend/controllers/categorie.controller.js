import { findAllCategories } from "../models/categorie.js";

export const getAllCategorie = async (req, res) => {
  const categories = await findAllCategories();

  res.status(200).json(categories);
};
