import React, { useState } from "react"; // A 'useContext' importra már nincs szükség
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext"; // <-- HELYES IMPORT
import { login } from "../services/AuthService";

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth(); // <-- A HELYES HOOK HASZNÁLATA

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("--- LOGIN SCREEN: handleLogin elindult ---");
    setIsLoading(true);
    try {
      const response = await login(email, password);
      console.log(
        "--- LOGIN SCREEN: Service válasza megérkezett ---",
        response
      );

      if (response && response.token) {
        console.log(
          "--- LOGIN SCREEN: Token létezik, signIn hívás indul... ---"
        );
        signIn(response);
        console.log("--- LOGIN SCREEN: signIn hívás befejeződött. ---");
      } else {
        console.error(
          "--- LOGIN SCREEN HIBA: A service nem adott vissza tokent! ---",
          response
        );
        Alert.alert("Hiba", "Ismeretlen hiba történt a bejelentkezés során.");
      }
    } catch (error) {
      console.error("--- LOGIN SCREEN HIBA: a service hibát dobott ---", error);
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false);
      console.log(
        "--- LOGIN SCREEN: handleLogin befejeződött (finally blokk) ---"
      );
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
  forgotPasswordButton: {
    marginTop: 16,
  },
  forgotPasswordLabel: {
    fontSize: 12,
  },
});

export default LoginScreen;
