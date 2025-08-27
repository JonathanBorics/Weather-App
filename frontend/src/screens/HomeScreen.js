import React, { useContext } from "react";
import { View, Button, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";

const HomeScreen = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Főoldal</Text>
      <Button title="Kijelentkezés" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HomeScreen;
