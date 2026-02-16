import api from "../api/axios";

export const loginRequest = async (data: {
  login: string;
  mot_de_passe: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
