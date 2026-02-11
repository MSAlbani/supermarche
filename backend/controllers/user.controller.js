import { allUsers } from "../models/users.js";

export const getAllUsers = async (req, res) => {
  const users = await allUsers();

  res.status(200).json(users);
};
