import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { forgotPassword } from "../services/AuthService";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      Alert.alert("Siker", response.message, [
        // Az OK gomb megnyomása után visszanavigálunk a login képernyőre
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Bár a mi szimulációnk sosem dob hibát, a valóságban kell
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Elfelejtett jelszó
      </Text>
      <Text style={styles.description}>
        Add meg a regisztrált e-mail címedet, és küldünk egy linket a jelszavad
        visszaállításához.
      </Text>
      <TextInput
        label="E-mail cím"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleRequest}
        loading={isLoading}
        disabled={isLoading}
      >
        Visszaállító link küldése
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { textAlign: "center", marginBottom: 16 },
  description: { textAlign: "center", marginBottom: 24 },
  input: { marginBottom: 16 },
});

export default ForgotPasswordScreen;
