import { ChevronDown } from "lucide-react";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Contexte partagé entre tous les sous-composants Select
 */

interface SelectContextType {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

/* ============================================================
   Select (Root)
============================================================ */

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

/**
 * Composant racine Select
 * Fournit la valeur et l'état d'ouverture
 */

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider
      value={{ value, setValue: onValueChange, open, setOpen }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

/* ============================================================
   SelectTrigger
============================================================ */

/**
 * Bouton qui ouvre / ferme le Select
 */

export const SelectTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      onKeyDown={(e) => {
        // Support clavier
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.setOpen(!ctx.open);
        }
        if (e.key === "Escape") {
          ctx.setOpen(false);
        }
      }}
      className="
        w-full flex justify-between items-center border
        border-gray-300 rounded-md px-3 py-2 bg-white text-sm 
        focus:outline-none focus:ring-2 focus:ring-green-500
      "
    >
      {children}
      <ChevronDown className="w-4 h-4" />
    </button>
  );
};

/* ============================================================
   SelectValue
============================================================ */

/**
 * Affiche la valeur sélectionnée ou le placeholder
 */

export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  return (
    <span className="text-gray-700">
      {ctx.value !== "all" ? ctx.value : placeholder}
    </span>
  );
};

/* ============================================================
   SelectContent
============================================================ */

/**
 * Conteneur des options (menu déroulant)
 */

export const SelectContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div
      className="
        absolute z-10 mt-2 w-full
        bg-white border rounded-md shadow-md
        transition-all duration-150 ease-out
        origin-top animate-select-open
      "
    >
      {children}
    </div>
  );
};

/* ============================================================
   SelectItem
============================================================ */

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

/**
 * Élément sélectionnable
 */
export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  return (
    <div
      role="option"
      tabIndex={0}
      onClick={() => {
        ctx.setValue(value);
        ctx.setOpen(false); // fermeture après sélection
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          ctx.setValue(value);
          ctx.setOpen(false);
        }
      }}
      className="
        px-3 py-2 text-sm cursor-pointer
        hover:bg-green-50 focus:bg-green-100
        outline-none
      "
    >
      {children}
    </div>
  );
};
