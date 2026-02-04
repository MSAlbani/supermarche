import { Menu, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <header className="h-16 flex items-center px-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <Menu className="w-6 h-6 text-green-600" />
      </button>

      <div className="ml-auto">
        <button
          onClick={toggleDark}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
