// src/App.js
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthContext";
import { CityProvider } from "./contexts/CityContext";
import RootNavigator from "./navigation/RootNavigator";
import { theme } from "./styles/theme"; // <-- IMPORTÁLJUK A TÉMÁT

export default function App() {
  return (
    // A PaperProvider-nek átadjuk a saját témánkat
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CityProvider>
          <RootNavigator />
        </CityProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
