import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { resetPassword } from "../services/AuthService";

// A `route` propból kapnánk meg a tokent a valóságban
const ResetPasswordScreen = ({ navigation, route }) => {
  // const { token } = route.params; // pl. így: const token = 'valid-reset-token';
  const token = "valid-reset-token"; // Szimuláljuk, hogy megkaptuk a tokent

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Hiba", "A két jelszó nem egyezik.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await resetPassword(token, newPassword);
      Alert.alert("Siker", response.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") }, // Visszadobjuk a Login oldalra
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
      />
      <TextInput
        label="Új jelszó megerősítése"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleReset}
        loading={isLoading}
        disabled={isLoading}
      >
        Jelszó beállítása
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { textAlign: "center", marginBottom: 24 },
  input: { marginBottom: 16 },
});

export default ResetPasswordScreen;
