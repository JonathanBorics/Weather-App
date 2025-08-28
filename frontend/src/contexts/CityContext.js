import React, { createContext, useState, useContext } from "react";
import {
  getFavoriteCitiesWeather,
  addCity,
  deleteCity,
} from "../services/WeatherService";
import { Alert } from "react-native";

const CityContext = createContext();

export const useCities = () => {
  return useContext(CityContext);
};

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Nyomon követi, hogy az első betöltés megtörtént-e

  // Városok betöltése az API-ról (csak egyszer)
  const loadCities = async () => {
    if (initialLoadDone) return; // Ha már betöltöttük, ne tegyük újra
    setIsLoading(true);
    try {
      const data = await getFavoriteCitiesWeather();
      setCities(data);
      setInitialLoadDone(true);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült betölteni a városokat.");
    } finally {
      setIsLoading(false);
    }
  };

  // Város hozzáadása
  const handleAddCity = async (cityName) => {
    try {
      const newCity = await addCity(cityName);
      setCities((prevCities) => [...prevCities, newCity]);
      return true; // Sikert jelez
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült hozzáadni a várost.");
      return false; // Hibát jelez
    }
  };

  // Város törlése
  const handleDeleteCity = async (cityId) => {
    try {
      await deleteCity(cityId);
      setCities((prevCities) =>
        prevCities.filter((city) => city.id !== cityId)
      );
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült törölni a várost.");
    }
  };

  const value = {
    cities,
    isLoading,
    loadCities, // Elérhetővé tesszük, hogy a komponensek elindíthassák a betöltést
    handleAddCity,
    handleDeleteCity,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};
