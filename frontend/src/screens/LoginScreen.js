// src/screens/LoginScreen.js (DEBUG + DIZÁJN VERZIÓ)
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
} from "react-native";
import { TextInput, Button, Text, Card, useTheme } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/AuthService";

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Előre kitöltve a gyors teszteléshez
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("nagyonbiztonsagosadminjelszo");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("LOGIN_SCREEN: handleLogin elindult.");
    console.log("LOGIN_SCREEN: Bejelentkezési adatok:", { email, password });

    if (!email || !password) {
      Alert.alert("Hiba", "Kérjük, töltse ki az e-mail és jelszó mezőket!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("LOGIN_SCREEN: Hívás az AuthService.login() felé...");
      const response = await login(email, password);
      console.log("LOGIN_SCREEN: Visszatért a válasz a service-től:", response);

      if (response && response.token) {
        console.log(
          "LOGIN_SCREEN: A válasz tartalmaz tokent, hívás a signIn() felé..."
        );
        await signIn(response);
        console.log("LOGIN_SCREEN: A signIn() sikeresen lefutott.");
      } else {
        console.error(
          "LOGIN_SCREEN_HIBA: A service nem adott vissza tokent!",
          response
        );
        Alert.alert("Hiba", "Ismeretlen hiba történt (kód: LS-1).");
      }
    } catch (error) {
      console.error("LOGIN_SCREEN_HIBA: A try blokkban hiba történt!");
      // Az axios hibák specifikusabb kezelése
      if (error.isAxiosError) {
        console.error("HIBA RÉSZLETEI (Axios):", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          responseData: error.response?.data,
          responseStatus: error.response?.status,
        });
      } else {
        console.error("HIBA RÉSZLETEI (Általános):", error);
      }
      Alert.alert(
        "Bejelentkezési Hiba",
        error.message || "Ismeretlen hiba lépett fel."
      );
    } finally {
      setIsLoading(false);
      console.log("LOGIN_SCREEN: handleLogin finally blokk lefutott.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, isLargeScreen && styles.largeScreenCard]}>
        <Card.Title
          title="Bejelentkezés"
          titleVariant="headlineMedium"
          titleStyle={{ textAlign: "center", color: colors.primary }}
        />
        <Card.Content>
          <TextInput
            label="E-mail cím"
            value={email}
            onChangeText={setEmail}
            style={{ marginBottom: spacing.medium }}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={isLoading}
          />
          <TextInput
            label="Jelszó"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ marginBottom: spacing.medium }}
            disabled={isLoading}
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={{ marginTop: spacing.medium }}
            contentStyle={styles.buttonContent}
            loading={isLoading}
            disabled={isLoading}
          >
            Bejelentkezés
          </Button>
          <Button
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: spacing.small }}
            disabled={isLoading}
          >
            Regisztráció
          </Button>
          <Button
            onPress={() => navigation.navigate("ForgotPassword")}
            style={{ marginTop: spacing.medium }}
            labelStyle={{ fontSize: 12 }}
            disabled={isLoading}
          >
            Elfelejtett jelszó
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
  largeScreenCard: {
    padding: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LoginScreen;
