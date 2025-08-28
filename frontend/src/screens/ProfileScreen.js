import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { changePassword } from "../services/AuthService"; // <-- Az új service importálása

const ProfileScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    // 1. Kliens oldali validáció
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Hiba", "Kérjük, tölts ki minden mezőt.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Hiba", "Az új jelszavak nem egyeznek.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(currentPassword, newPassword);
      // Ha a service sikeresen lefutott, a `response` tartalmazza az üzenetet
      Alert.alert("Siker", response.message);
      // Sikeres változtatás után ürítsük a mezőket
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      // Ha a service hibát dob (pl. rossz jelenlegi jelszó)
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Profilom
      </Text>

      {/* Ide a jövőben jöhetnének egyéb profiladatok, pl. e-mail cím */}

      <Text variant="titleMedium" style={styles.subHeader}>
        Jelszó megváltoztatása
      </Text>
      <TextInput
        label="Jelenlegi jelszó"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
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
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading}
      />
      <Button
        mode="contained"
        onPress={handlePasswordChange}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Jelszó módosítása
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  subHeader: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ProfileScreen;
