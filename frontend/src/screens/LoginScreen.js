import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import { login } from "../services/AuthService"; // <-- IMPORTÁLJUK AZ ÚJ SZERVIZT

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- ÚJ ÁLLAPOT A TÖLTÉS JELZÉSÉRE

  const handleLogin = async () => {
    setIsLoading(true); // Elkezdjük a töltést
    try {
      // Meghívjuk a szervizünket az email és jelszó értékekkel
      const response = await login(email, password);

      // Ha sikeres volt a hívás, és van token...
      if (response.token) {
        signIn(response.token); // ...akkor bejelentkeztetjük a felhasználót a context segítségével
      }
    } catch (error) {
      // Ha a szerviz hibát dobott, megjelenítjük egy felugró ablakban
      Alert.alert("Hiba", error.message);
    } finally {
      setIsLoading(false); // Befejezzük a töltést (akár sikeres, akár nem)
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
        disabled={isLoading} // Ha tölt, tiltsuk le a mezőt
      />
      <TextInput
        label="Jelszó"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        disabled={isLoading} // Ha tölt, tiltsuk le a mezőt
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={isLoading} // A gomb mutatja a töltés jelzést
        disabled={isLoading} // Ha tölt, a gombot is letiltjuk
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
    </View>
  );
};

// A styles rész nem változott, maradhat ugyanaz

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

export default LoginScreen;
