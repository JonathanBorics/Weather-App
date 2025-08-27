import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import { register } from "../services/AuthService"; // <-- A most létrehozott service importálása

const RegisterScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext); // A signIn-re szükségünk van, hogy regisztráció után be is lépjünk

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- Új állapot a jelszó megerősítéséhez
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Kliens oldali ellenőrzés: egyezik-e a két jelszó?
    if (password !== confirmPassword) {
      Alert.alert("Hiba", "A két jelszó nem egyezik!");
      return; // Ha nem egyezik, nem is próbálkozunk tovább
    }

    setIsLoading(true);
    try {
      const response = await register(email, password);

      if (response.token) {
        // Sikeres regisztráció után egyből be is jelentkeztetjük a felhasználót
        signIn(response.token);
      }
    } catch (error) {
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Regisztráció
      </Text>
      <TextInput
        label="E-mail cím"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />
      <TextInput
        label="Jelszó"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Jelszó megerősítése"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Regisztráció
      </Button>
      <Button
        onPress={() => navigation.goBack()} // Ez a gomb visszavisz az előző képernyőre (Login)
        style={styles.button}
        disabled={isLoading}
      >
        Vissza a bejelentkezéshez
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default RegisterScreen;
