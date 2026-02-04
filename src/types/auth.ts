export type UserRole = "ADMIN" | "VENDEUR" | "CAISSIER";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
