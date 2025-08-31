// src/screens/RegisterScreen.js

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { register } from "../services/AuthService";

const RegisterScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // JAVÍTÁS: Üres mezők ellenőrzése
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
      const response = await register(email, password);
      if (response.token) {
        signIn(response);
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
        onPress={() => navigation.goBack()}
        style={styles.button}
        disabled={isLoading}
      >
        Vissza a bejelentkezéshez
      </Button>
    </View>
  );
};

// Ugyanaz a stílus, mint a LoginScreen-en
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
});

export default RegisterScreen;
