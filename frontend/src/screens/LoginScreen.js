// src/screens/LoginScreen.js
// EZ A FÁJL TÖKÉLETES, NINCS SZÜKSÉG MÓDOSÍTÁSRA.

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/AuthService";

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response && response.token) {
        signIn(response);
      } else {
        Alert.alert("Hiba", "Ismeretlen hiba történt a bejelentkezés során.");
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
        Időjárás App
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
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Bejelentkezés
      </Button>
      <Button
        onPress={() => navigation.navigate("Register")}
        style={styles.button}
        disabled={isLoading}
      >
        Regisztráció
      </Button>
      <Button
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.forgotPasswordButton}
        disabled={isLoading}
        labelStyle={styles.forgotPasswordLabel}
      >
        Elfelejtettem a jelszavam
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Adunk egy tiszta fehér hátteret
  },
  title: {
    textAlign: "center",
    marginBottom: 32, // Nagyobb tér a címnek
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4, // Kényelmesebb gombméret
  },
  forgotPasswordButton: {
    marginTop: 16,
  },
  forgotPasswordLabel: {
    fontSize: 12,
  },
});

export default LoginScreen;
