import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Divider } from "react-native-paper";
import { changePassword } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext"; // <-- 1. IMPORTÁLJUK A useAuth-ot

const ProfileScreen = () => {
  const { signOut } = useAuth(); // <-- 2. KISZEDJÜK A signOut FUNKCIÓT A KONTEXTUSBÓL

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
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
      Alert.alert("Siker", response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
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

     

      {/* --- 3. ITT AZ ÚJ GOMB --- */}
      <Divider style={styles.divider} />
      <Button
        icon="logout"
        mode="outlined" // Egy más stílusú gomb
        onPress={signOut} // Meghívja a kijelentkezési funkciót
        style={styles.button}
      >
        Kijelentkezés
      </Button>
      {/* --------------------------- */}
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
  // Egy stílus az elválasztó vonalnak
  divider: {
    marginVertical: 24,
  },
});

export default ProfileScreen;
