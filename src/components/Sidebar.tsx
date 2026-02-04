import { Link, useLocation } from "react-router-dom";
import { menuItems } from "../config/menu.config";
import type { UserRole } from "../types/auth";

interface SidebarProps {
  isOpen: boolean;
  role: UserRole;
}

export default function Sidebar({ isOpen, role }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`
        hidden md:flex flex-col
        transition-all duration-300
        ${isOpen ? "w-64" : "w-16"}
        bg-white/80 
        border-r border-green-100
      `}
    >
      <div className="h-16 flex items-center justify-center font-bold border-b dark:border-gray-700">
        {isOpen ? "MyApp" : "M"}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center m-2 gap-3 p-2 rounded-md
                  font-semibold
                  transition-colors
                  text-gray-700
                  ${
                    isActive
                      ? "bg-linear-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:text-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 text-white"
                      : "hover:bg-green-50 hover:text-green-700"
                  }
                `}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
