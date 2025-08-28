import React, { useState } from "react";
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
  const {
    cities: userCities,
    isLoading: userCitiesLoading,
    loadCities,
  } = useCities();

  const [guestCities, setGuestCities] = useState([]);
  const [isGuestLoading, setIsGuestLoading] = useState(true);

  // CSAK A useFocusEffect MARAD, MERT AZ MINDIG LEFUT, AMIKOR VISSZATÉRÜNK IDE
  useFocusEffect(
    React.useCallback(() => {
      if (userToken) {
        loadCities();
      } else {
        const loadGuestData = async () => {
          setIsGuestLoading(true);
          const data = await getGuestCitiesWeather();
          setGuestCities(data);
          setIsGuestLoading(false);
        };
        loadGuestData();
      }
    }, [userToken, loadCities])
  );

  const isLoading = userToken ? userCitiesLoading : isGuestLoading;
  const data = userToken ? userCities : guestCities;

  if (isLoading) {
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WeatherCard
            cityName={item.cityName}
            temperature={item.temperature}
            condition={item.condition}
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
