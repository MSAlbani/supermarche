import api from "../api/axios";

export const fetchUtilisatuers = async () => {
  const utilisateurs = await api.get("users/allUsers");

  return utilisateurs.data;
};

export const fetchRoles = async () => {
  const roles = await api.get("roles/afficher");

  return roles.data;
};
