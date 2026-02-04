import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByLogin } from "../models/users.js";

// Inscription d'un nouvel utilisateur

export const register = async (req, res) => {
  const { nom_complet, login, mot_de_passe, id_role } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

  const user = await createUser(nom_complet, login, hashedPassword, id_role);

  res.status(201).json({ message: "Utilisateur créé", user });
};

// Connexion

export const login = async (req, res) => {
  const { login, mot_de_passe } = req.body;
  const user = await getUserByLogin(login);

  if (!user) return res.status(404).json({ message: "Accès refusé" });

  if (!user.actif)
    return res.status(403).json({ message: "Utilisateur désactivé" });

  const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

  if (!valid)
    return res.status(401).json({ message: "Mot de passe incorrect" });

  // Générer JWT

  const token = jwt.sign(
    {
      id_utilisateur: user.id_utilisateur,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const decodedToken = jwt.decode(token);

  res.json({
    message: "Connexion réussie",
    token,
    token_details: {
      iat: decodedToken.iat,
      exp: decodedToken.exp,
      expires_at: new Date(decodedToken.exp * 1000),
    },
    utilisateur: {
      id: user.id_utilisateur,
      nom: user.nom_complet,
      role: user.role,
    },
  });
};
