// src/screens/ResetPasswordScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { resetPassword } from "../services/AuthService";

const ResetPasswordScreen = ({ navigation, route }) => {
  // --- JAVÍTÁS: A tokent a 'route.params'-ból olvassuk ki ---
  // Ezt a Deep Linking fogja ideadni a jövőben.
  const { token } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    // JAVÍTÁS: Ellenőrizzük, hogy van-e token
    if (!token) {
      Alert.alert("Hiba", "Érvénytelen visszaállító link. Kérj egy újat!");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hiba", "A két jelszó nem egyezik.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPassword(token, newPassword);
      Alert.alert("Siker", response.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Új jelszó beállítása
      </Text>
      <TextInput
        label="Új jelszó"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Új jelszó megerősítése"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
      <Button
        mode="contained"
        onPress={handleReset}
        loading={isLoading}
        disabled={isLoading || !token} // Ha nincs token, a gomb inaktív
      >
        Jelszó beállítása
      </Button>
      {!token && (
        <Text style={styles.errorText}>
          Hiányzó visszaállító token. Kérjük, használd az e-mailben kapott
          linket.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: { textAlign: "center", marginBottom: 24 },
  input: { marginBottom: 16 },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 16,
  },
});

export default ResetPasswordScreen;
