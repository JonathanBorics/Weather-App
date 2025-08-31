// src/screens/ArchiveScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { getWeatherArchive } from "../services/WeatherService";
import { useCities } from "../contexts/CityContext";
// A useFocusEffect helyett elég lesz az useEffect, mert a 'cities' változását figyeljük
// import { useFocusEffect } from "@react-navigation/native";

const ArchiveScreen = () => {
  const { cities, isLoading: areCitiesLoading } = useCities();
  const [archiveData, setArchiveData] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Ez csak az archívum betöltését jelzi

  const loadArchive = async (cityId) => {
    // Ha nincs cityId, ne csináljunk semmit
    if (!cityId) {
      setArchiveData([]);
      setSelectedCityId(null);
      return;
    }

    setIsLoading(true);
    setSelectedCityId(cityId);
    try {
      const data = await getWeatherArchive({ cityId: cityId });
      setArchiveData(data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült betölteni az archív adatokat.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- JAVÍTÁS #1: Automatikus betöltés ---
  // Ez az useEffect lefut, amikor a komponens betölt,
  // ÉS akkor is, ha a kedvenc városok listája (cities) megváltozik.
  useEffect(() => {
    // Ha a városok betöltődtek és még nincs kiválasztott város,
    // válasszuk ki az elsőt és töltsük be az ő archívumát.
    if (cities.length > 0 && !selectedCityId) {
      loadArchive(cities[0].id);
    }
    // Ha a felhasználó törli az utolsó kedvenc városát,
    // ürítsük ki az archívum listát is.
    if (cities.length === 0) {
      setArchiveData([]);
      setSelectedCityId(null);
    }
  }, [cities, selectedCityId]); // Figyeljük a 'cities' változását

  // --- JAVÍTÁS #2: Egyedi kulcs generálása ---
  // Mivel a backend nem küld ID-t az archív adatokhoz,
  // a dátumot használjuk kulcsnak, ami egyedi egy városon belül.
  const renderItem = ({ item }) => {
    // --- JAVÍTÁS ITT: Biztonságos számkonverzió ---

    // 1. A parseFloat() megpróbálja a stringet lebegőpontos számmá alakítani.
    // pl. "20.21" -> 20.21
    const tempAsNumber = parseFloat(item.temperature);

    // 2. Ellenőrizzük, hogy a konverzió sikeres volt-e. Ha nem (pl. a bemenet nem volt szám),
    // akkor az isNaN() (is Not a Number) igaz lesz. Ilyenkor egy 'N/A' szöveget jelenítünk meg.
    const tempDisplay = !isNaN(tempAsNumber)
      ? `${tempAsNumber.toFixed(1)}°C`
      : "N/A";

    return (
      <Card style={styles.card}>
        <Card.Title
          title={tempDisplay} // Itt már a biztonságosan formázott értéket használjuk
          subtitle={item.date}
        />
        <Card.Content>
          <Text variant="bodyMedium">Leírás: {item.description}</Text>
          <Text variant="bodySmall" style={{ marginTop: 8 }}>
            Páratartalom: {item.humidity}% | Szél: {item.wind_speed} m/s
          </Text>
        </Card.Content>
      </Card>
    );
  };

  if (areCitiesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Kedvenc városok betöltése...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Város kiválasztása:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cities.length > 0 ? (
            cities.map((city) => (
              <Chip
                key={city.id}
                selected={selectedCityId === city.id}
                onPress={() => loadArchive(city.id)}
                style={styles.chip}
                icon="city"
              >
                {city.cityName}
              </Chip>
            ))
          ) : (
            <Text style={styles.emptyText}>Nincsenek kedvenc városaid.</Text>
          )}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={archiveData}
          // JAVÍTÁS #2: A 'date' mezőt használjuk kulcsnak, mert az egyedi.
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 8 }}
          ListHeaderComponent={
            <Text variant="headlineSmall" style={styles.header}>
              Archív Adatok
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {selectedCityId
                  ? "Nincsenek archív adatok ehhez a városhoz."
                  : "Válassz egy várost a fenti listából."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

// ... a stílusok változatlanok, de egy kicsit finomítottam őket ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: { paddingVertical: 12, textAlign: "center", fontWeight: "bold" },
  filterContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chip: { marginRight: 8 },
  card: { marginHorizontal: 8, marginVertical: 6 },
  emptyText: { textAlign: "center", fontSize: 16, color: "gray", padding: 16 },
});

export default ArchiveScreen;
