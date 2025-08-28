import React, { useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, TextInput, Button, IconButton, List } from "react-native-paper";
import { useCities } from "../contexts/CityContext"; // <-- A GLOBÁLIS ÁLLAPOT

const ManageCitiesScreen = () => {
  // A `cities` és `isLoading` most már a kontextusból jön
  const { cities, handleAddCity, handleDeleteCity } = useCities();
  const [newCityName, setNewCityName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Nincs többé szükség a useFocusEffect-re, mert az állapot globális!

  const onAddCity = async () => {
    if (newCityName.trim() === "") {
      Alert.alert("Hiba", "A városnév nem lehet üres.");
      return;
    }
    setIsAdding(true);
    const success = await handleAddCity(newCityName);
    if (success) {
      setNewCityName(""); // Csak akkor ürítjük, ha sikeres volt
    }
    setIsAdding(false);
  };

  const onDeleteCity = (cityId, cityName) => {
    Alert.alert(
      "Törlés megerősítése",
      `Biztosan törölni szeretnéd ezt a várost: ${cityName}?`,
      [
        { text: "Mégse", style: "cancel" },
        {
          text: "Törlés",
          style: "destructive",
          onPress: () => handleDeleteCity(cityId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Városok Kezelése
      </Text>
      <View style={styles.addCityContainer}>
        <TextInput
          label="Új város neve"
          value={newCityName}
          onChangeText={setNewCityName}
          style={styles.input}
          disabled={isAdding}
        />
        <Button
          mode="contained"
          onPress={onAddCity}
          style={styles.addButton}
          loading={isAdding}
          disabled={isAdding}
        >
          Hozzáadás
        </Button>
      </View>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.cityName}
            right={() => (
              <IconButton
                icon="delete"
                iconColor="red"
                onPress={() => onDeleteCity(item.id, item.cityName)}
              />
            )}
          />
        )}
      />
    </View>
  );
};

// --- ITT A HIÁNYZÓ RÉSZ ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  addCityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    height: 55,
    justifyContent: "center",
  },
});

export default ManageCitiesScreen;
