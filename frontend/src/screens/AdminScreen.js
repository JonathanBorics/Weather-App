import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const AdminScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Adminisztrátori Felület</Text>
      <Text>
        Itt lehet majd a felhasználókat kezelni és statisztikákat nézni.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default AdminScreen;
