import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, List, IconButton, Divider, Card } from "react-native-paper";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} from "../services/AdminService";
import { useFocusEffect } from "@react-navigation/native";

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // A useFocusEffect biztosítja, hogy a lista mindig frissüljön,
  // amikor erre a képernyőre navigálunk.
  useFocusEffect(
    React.useCallback(() => {
      const loadUsers = async () => {
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
      loadUsers();
    }, [])
  );

  const handleToggleStatus = async (userId) => {
    await toggleUserStatus(userId);
    // Frissítjük a UI-t a service-ben történt változás alapján
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleDelete = (userId, userName) => {
    Alert.alert(
      "Törlés megerősítése",
      `Biztosan törölni szeretnéd ${userName} felhasználót? Ez a művelet nem vonható vissza.`,
      [
        { text: "Mégse", style: "cancel" },
        {
          text: "Törlés",
          style: "destructive",
          onPress: async () => {
            await deleteUser(userId);
            setUsers((currentUsers) =>
              currentUsers.filter((user) => user.id !== userId)
            );
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Felhasználók Kezelése
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <List.Item
              title={item.name}
              description={item.email}
              titleStyle={!item.isActive && styles.inactiveUser}
              left={() => (
                <List.Icon
                  icon={item.isActive ? "account-check" : "account-off"}
                />
              )}
              right={() => (
                <View style={styles.actions}>
                  <IconButton
                    icon={item.isActive ? "cancel" : "check-circle"}
                    iconColor={item.isActive ? "orange" : "green"}
                    onPress={() => handleToggleStatus(item.id)}
                  />
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    onPress={() => handleDelete(item.id, item.name)}
                  />
                </View>
              )}
            />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    textAlign: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
  },
  inactiveUser: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default AdminScreen;
