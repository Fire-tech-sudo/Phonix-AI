import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { themes, DEFAULT_THEME } from "../themes/themes";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("pixora-theme");
    return saved && themes[saved] ? saved : DEFAULT_THEME;
  });

  const applyTheme = useCallback((themeId) => {
    const theme = themes[themeId];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
    root.setAttribute("data-theme", themeId);
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem("pixora-theme", currentTheme);
  }, [currentTheme, applyTheme]);

  const changeTheme = (themeId) => {
    if (themes[themeId]) setCurrentTheme(themeId);
  };

  const getTheme = () => themes[currentTheme];
  const getAllThemes = () => Object.values(themes);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        changeTheme,
        getTheme,
        getAllThemes,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
