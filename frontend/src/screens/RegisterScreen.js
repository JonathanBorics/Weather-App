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
import { register } from "../services/AuthService";

const RegisterScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    console.log("REGISTER_SCREEN: handleRegister elindult.");
    console.log("REGISTER_SCREEN: Regisztrációs adatok:", {
      email,
      password,
      confirmPassword,
    });

    if (!email || !password || !confirmPassword) {
      Alert.alert("Hiba", "Minden mező kitöltése kötelező!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hiba", "A két jelszó nem egyezik!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("REGISTER_SCREEN: Hívás az AuthService.register() felé...");
      const response = await register(email, password);
      console.log(
        "REGISTER_SCREEN: Visszatért a válasz a service-től:",
        response
      );

      if (response && response.token) {
        console.log(
          "REGISTER_SCREEN: A válasz tartalmaz tokent, hívás a signIn() felé..."
        );
        await signIn(response);
        console.log("REGISTER_SCREEN: A signIn() sikeresen lefutott.");
      } else {
        console.error(
          "REGISTER_SCREEN_HIBA: A service nem adott vissza tokent!",
          response
        );
        Alert.alert(
          "Hiba",
          "Ismeretlen hiba történt a regisztráció során (kód: RS-1)."
        );
      }
    } catch (error) {
      console.error("REGISTER_SCREEN_HIBA: A try blokkban hiba történt!");
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
        "Regisztrációs Hiba",
        error.message || "Ismeretlen hiba lépett fel."
      );
    } finally {
      setIsLoading(false);
      console.log("REGISTER_SCREEN: handleRegister finally blokk lefutott.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, isLargeScreen && styles.largeScreenCard]}>
        <Card.Content style={{ paddingVertical: spacing.medium }}>
          <Text
            variant="headlineMedium"
            style={[
              styles.title,
              { color: colors.text, marginBottom: spacing.large },
            ]}
          >
            Regisztráció
          </Text>
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
          <TextInput
            label="Jelszó megerősítése"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={{ marginBottom: spacing.medium }}
            disabled={isLoading}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            style={{ marginTop: spacing.medium }}
            contentStyle={styles.buttonContent}
            loading={isLoading}
            disabled={isLoading}
          >
            Regisztráció
          </Button>
          <Button
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.small }}
            disabled={isLoading}
          >
            Vissza a bejelentkezéshez
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
  title: {
    textAlign: "center",
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default RegisterScreen;
