import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ee", // Élénk lila a gombokhoz és aktív elemekhez
    accent: "#03dac4", // Kiegészítő türkiz szín (opcionális)
    background: "#f6f6f6", // Világosszürke háttér
    surface: "#ffffff", // A kártyák és dialógusok fehér háttere
    text: "#000000", // Fekete szöveg a jó olvashatóságért
    placeholder: "#888888", // Halványszürke placeholder szöveg
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  roundness: 8, // Lekerekített sarkok
  spacing: {
    // Térközök a konzisztens elrendezéshez
    small: 8,
    medium: 16,
    large: 24,
  },
};
