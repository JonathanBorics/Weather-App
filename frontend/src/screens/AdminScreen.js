// src/screens/AdminScreen.js

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, List, IconButton, Divider, Card } from "react-native-paper";
// JAVÍTÁS: Importáljuk az updateUserStatus-t a toggle helyett
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../services/AdminService";
import { useFocusEffect } from "@react-navigation/native";

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    // Külön funkcióba szervezve, hogy újra felhasználhassuk
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült betölteni a felhasználókat.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  const handleToggleStatus = async (userToUpdate) => {
    const { id, isActive } = userToUpdate;
    const newStatus = !isActive; // Kiszámoljuk a cél állapotot

    try {
      // Optimistic UI: Először frissítjük a helyi állapotot
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, isActive: newStatus } : user
        )
      );
      // Majd elküldjük a kérést a szervernek
      await updateUserStatus(id, newStatus);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült frissíteni a felhasználó státuszát.");
      // Hiba esetén visszaállítjuk az eredeti állapotot
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, isActive: isActive } : user
        )
      );
    }
  };

  const handleDelete = (userId, userName) => {
    Alert.alert(
      "Törlés megerősítése",
      `Biztosan törölni szeretnéd ${userName} felhasználót?`,
      [
        { text: "Mégse", style: "cancel" },
        {
          text: "Törlés",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userId);
              setUsers((currentUsers) =>
                currentUsers.filter((user) => user.id !== userId)
              );
            } catch (error) {
              Alert.alert("Hiba", "Nem sikerült törölni a felhasználót.");
            }
          },
        },
      ]
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()} // Biztos, ami biztos
        ItemSeparatorComponent={() => <Divider />}
        ListHeaderComponent={
          <Text variant="headlineMedium" style={styles.header}>
            Felhasználók Kezelése
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <List.Item
              title={item.email} // Inkonzisztens adatok miatt inkább az emailt használjuk
              description={`Role: ${item.role}`}
              titleStyle={!item.isActive && styles.inactiveUser}
              left={() => (
                <List.Icon
                  icon={item.isActive ? "account-check" : "account-off"}
                  color={item.isActive ? "green" : "gray"}
                />
              )}
              right={() => (
                <View style={styles.actions}>
                  <IconButton
                    icon={item.isActive ? "cancel" : "check-circle"}
                    iconColor={item.isActive ? "orange" : "green"}
                    onPress={() => handleToggleStatus(item)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    onPress={() => handleDelete(item.id, item.email)}
                  />
                </View>
              )}
            />
          </Card>
        )}
        onRefresh={loadUsers}
        refreshing={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, textAlign: "center", backgroundColor: "#fff" },
  card: { marginHorizontal: 8, marginVertical: 4 },
  actions: { flexDirection: "row", alignItems: "center" },
  inactiveUser: { textDecorationLine: "line-through", color: "gray" },
});

export default AdminScreen;
