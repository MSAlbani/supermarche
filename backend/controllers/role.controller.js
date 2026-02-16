import { allRole, create } from "../models/role.js";

export const afficher = async (req, res) => {
  const roles = await allRole();
  res.status(200).json(roles);
};
