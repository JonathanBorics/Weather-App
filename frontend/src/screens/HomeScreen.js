// src/screens/HomeScreen.js

import React, { useState, useEffect } from "react"; // Az useEffect-et is importáljuk
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useCities } from "../contexts/CityContext";
import { getGuestCitiesWeather } from "../services/WeatherService";
import WeatherCard from "../components/WeatherCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userToken } = useAuth();

  // --- JAVÍTÁS #1: Átnevezzük a 'loadCities'-t 'refreshCities'-re ---
  // A clearCities funkcióra is szükségünk lesz
  const {
    cities: userCities,
    isLoading: userCitiesLoading,
    refreshCities,
    clearCities,
  } = useCities();

  const [guestCities, setGuestCities] = useState([]);
  const [isGuestLoading, setIsGuestLoading] = useState(false); // Alapból false

  useFocusEffect(
    React.useCallback(() => {
      if (userToken) {
        // Ha van user token, frissítsük a kedvenc városok listáját
        refreshCities();
      } else {
        // Ha nincs token (vendég nézet), töltsük be a vendég adatokat
        const loadGuestData = async () => {
          setIsGuestLoading(true);
          try {
            const data = await getGuestCitiesWeather();
            setGuestCities(data);
          } catch (error) {
            console.error("Hiba a vendég adatok betöltésekor:", error);
          } finally {
            setIsGuestLoading(false);
          }
        };
        loadGuestData();
      }
    }, [userToken, refreshCities]) // A függőségi lista is frissítve
  );

  // --- JAVÍTÁS #2: Kijelentkezéskor töröljük a városok listáját ---
  // Ez a useEffect figyelni fogja a userToken változását.
  useEffect(() => {
    // Ha a userToken null-ra változik (azaz a felhasználó kijelentkezett),
    // akkor töröljük a CityContext állapotából a városokat.
    if (!userToken) {
      clearCities();
    }
  }, [userToken, clearCities]);

  const isLoading = userToken ? userCitiesLoading : isGuestLoading;
  const data = userToken ? userCities : guestCities;

  // Ha töltünk és nincs adat, akkor jelenítsük meg a töltés jelzőt
  if (isLoading && data.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        // --- JAVÍTÁS ITT ---
        // Biztosítjuk, hogy a keyExtractor akkor is működjön, ha egy elemnek
        // véletlenül nincs id-ja. Ilyenkor az indexet használjuk.
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <WeatherCard
            cityName={item.cityName}
            temperature={item.temperature}
            condition={item.description}
            icon={item.icon}
          />
        )}
        ListHeaderComponent={
          <Text variant="headlineMedium" style={styles.header}>
            {userToken ? "Kedvenc Városaim" : "Időjárás-előrejelzés"}
          </Text>
        }
        ListFooterComponent={
          !userToken && (
            <View style={styles.guestFooter}>
              <Text>A folytatáshoz jelentkezz be vagy regisztrálj!</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("Auth", { screen: "Login" })}
              >
                Bejelentkezés
              </Button>
            </View>
          )
        }
        // Húzd le a frissítéshez funkció (Pull-to-refresh)
        onRefresh={userToken ? refreshCities : undefined}
        refreshing={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: { padding: 16, paddingBottom: 8, textAlign: "center" },
  guestFooter: { padding: 16, alignItems: "center", gap: 10 },
});

export default HomeScreen;
