import { ChevronDown } from "lucide-react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────
// Contexte
// ─────────────────────────────────────────────

interface SelectContextType {
  value: string;
  setValue: (value: string) => void;
  label: string; // ✅ ajout : texte affiché (libellé)
  setLabel: (label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Composant utilisé hors de <Select>");
  return ctx;
};

// ─────────────────────────────────────────────
// Select (Root)
// ─────────────────────────────────────────────

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(""); // ✅ état label ajouté
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{ value, setValue: onValueChange, label, setLabel, open, setOpen }}
    >
      <div className="relative" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// ─────────────────────────────────────────────
// SelectTrigger
// ─────────────────────────────────────────────

export const SelectTrigger: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ctx = useSelectContext();

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      onKeyDown={(e) => {
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
        transition-colors hover:border-gray-400
      "
    >
      {children}
      <ChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          ctx.open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

// ─────────────────────────────────────────────
// SelectValue
// ─────────────────────────────────────────────

export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => {
  const ctx = useSelectContext();

  return (
    // ✅ Affiche le label (libellé) et non la value brute (id)
    // ✅ Condition corrigée : placeholder si rien n'est sélectionné
    <span className={ctx.label ? "text-gray-700" : "text-gray-400"}>
      {ctx.label || placeholder}
    </span>
  );
};

// ─────────────────────────────────────────────
// SelectContent
// ─────────────────────────────────────────────

export const SelectContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ctx = useSelectContext();

  if (!ctx.open) return null;

  return (
    <div
      role="listbox"
      className="
        absolute z-10 mt-1 w-full
        bg-white border border-gray-200 rounded-md shadow-lg
        animate-in fade-in-0 zoom-in-95
        max-h-60 overflow-y-auto
      "
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────
// SelectItem
// ─────────────────────────────────────────────

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const ctx = useSelectContext();
  const isSelected = ctx.value === value;

  const handleSelect = () => {
    ctx.setValue(value);
    ctx.setLabel(String(children)); // ✅ stocke le texte affiché
    ctx.setOpen(false);
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSelect();
      }}
      className={`
        px-3 py-2 text-sm cursor-pointer outline-none
        transition-colors duration-100
        hover:bg-green-50 focus:bg-green-100
        ${isSelected ? "bg-green-50 text-green-700 font-medium" : "text-gray-700"}
      `}
    >
      {children}
    </div>
  );
};
