import { create } from "zustand";
import { fetchUtilisatuers, fetchRoles } from "../services/userService";

export interface Utilisateurs {
  id_utilisateur: number;
  nom_complet: string;
  login: string;
  role: string;
  actif: boolean;
}

export interface Role {
  id_role: number;
  libelle: string;
  description?: string;
  nombre: number;
}

interface utilisateurState {
  utilisateurs: Utilisateurs[];
  loadingUser: boolean;
  errorUser: string | null;
  getUtilisateurs: () => Promise<void>;
}
interface roleState {
  roles: Role[];
  loadingRole: boolean;
  erreurRole: string | null;
  getRoles: () => Promise<void>;
}

export const useUserStore = create<utilisateurState>((set) => ({
  utilisateurs: [],
  loadingUser: false,
  errorUser: null,

  getUtilisateurs: async () => {
    set({ loadingUser: true, errorUser: null });

    try {
      const data = await fetchUtilisatuers();

      set({ utilisateurs: data, loadingUser: false });
    } catch (error: unknown) {
      set({
        errorUser: "Erreur lors du chargement des utilisateurs " + error,
        loadingUser: false,
      });
    }
  },
}));

export const useRoleStore = create<roleState>((set) => ({
  roles: [],
  loadingRole: false,
  erreurRole: null,
  getRoles: async () => {
    set({ loadingRole: true, erreurRole: null });
    try {
      const data = await fetchRoles();
      set({ roles: data, loadingRole: false });
    } catch (error: unknown) {
      set({
        erreurRole: "Erreur lors du chargement des rôles " + error,
        loadingRole: false,
      });
    }
  },
}));
