import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import { createUser, getUserByLogin, getUserById } from "../models/users.js";
import {
  create as createRefreshToken,
  findByRefreshToken,
  deleteByRefreshToken,
} from "../models/refresh.js";

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

  // ACCESS TOKEN

  const accessToken = jwt.sign(
    {
      id_utilisateur: user.id_utilisateur,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1m" },
  );

  // REFRESH TOKEN

  const refreshToken = jwt.sign(
    {
      id_utilisateur: user.id_utilisateur,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Stockage refresh en base

  // await pool.query(
  //   `INSERT INTO refresh_tokens (id_utilisateur, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
  //   [user.id_utilisateur, refreshToken],
  // );

  await createRefreshToken({
    idUtilisateur: user.id_utilisateur,
    token: refreshToken,
  });

  // Cookies

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.json({
    message: "Connexion réussie",
    utilisateur: {
      id: user.id_utilisateur,
      nom: user.nom_complet,
      role: user.role,
    },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  // const stored = await pool.query(
  //   `SELECT * FROM refresh_tokens WHERE token=$1`,
  //   [refreshToken],
  // );

  const stored = await findByRefreshToken(refreshToken);

  if (Object.keys(stored).length === 0) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    // rotation

    await deleteByRefreshToken(refreshToken);

    const user = await getUserById(decoded.id_utilisateur);

    const newAccess = jwt.sign(
      {
        id_utilisateur: user.id_utilisateur,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" },
    );

    const newRefresh = jwt.sign(
      { id_utilisateur: user.id_utilisateur },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // await pool.query(
    //   `INSERT INTO refresh_tokens (id_utilisateur, token, expires_at)
    //    VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    //   [user.id_utilisateur, newRefresh],
    // );

    await createRefreshToken({
      idUtilisateur: user.id_utilisateur,
      token: newRefresh,
    });

    res.cookie("accessToken", newAccess, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ message: "Token renouvelé" });
  });
};

export const logout = async (req, res) => {
  const { refresh_token, accessToken } = req.cookies;

  // await pool.query(`DELETE FROM refresh_tokens WHERE token=$1`, [
  //   refresh_token,
  // ]);

  await deleteByRefreshToken(refresh_token);

  res.clearCookie(accessToken);
  res.clearCookie(refresh_token);

  res.json({ message: "Deconnecté" });
};
