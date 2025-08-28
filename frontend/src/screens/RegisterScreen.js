import React, { useState } from "react"; // A 'useContext' importra már nincs szükség
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext"; // <-- HELYES IMPORT
import { register } from "../services/AuthService";

const RegisterScreen = ({ navigation }) => {
  const { signIn } = useAuth(); // <-- A HELYES HOOK HASZNÁLATA

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hiba", "A két jelszó nem egyezik!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(email, password);
      if (response.token) {
        // A register service-nek is a teljes { token, role } objektumot kell visszaadnia!
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
