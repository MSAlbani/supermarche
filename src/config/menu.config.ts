import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Users,
} from "lucide-react";
import type { MenuItems } from "../types/menu";

export const menuItems: MenuItems[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN", "VENDEUR", "CAISSIER"],
  },
  {
    label: "Produits",
    path: "/produits",
    icon: Package,
    roles: ["ADMIN", "VENDEUR"],
  },
  {
    label: "Ventes",
    path: "/ventes",
    icon: ShoppingCart,
    roles: ["ADMIN", "VENDEUR", "CAISSIER"],
  },
  {
    label: "Utilisateurs",
    path: "/utilisateurs",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    label: "Paramètres",
    path: "/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
];
