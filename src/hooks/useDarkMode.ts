import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", isDark);
  }, [isDark]);

  return { isDark, toggleDark: () => setIsDark((v) => !v) };
}
