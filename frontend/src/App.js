import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./contexts/AuthContext";
import { CityProvider } from "./contexts/CityContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <CityProvider>
          <RootNavigator />
        </CityProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
