import React, { createContext, useState, useContext, useCallback } from "react";
import {
  getFavoriteCitiesWeather,
  addCity,
  deleteCity,
} from "../services/WeatherService";
import { Alert } from "react-native";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const loadCities = useCallback(async () => {
    if (initialLoadDone) return;
    setIsLoading(true);
    try {
      const data = await getFavoriteCitiesWeather();
      setCities(data);
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Hiba a városok betöltésekor a kontextusban:", error);
    } finally {
      setIsLoading(false);
    }
  }, [initialLoadDone]);

  const handleAddCity = useCallback(async (cityName) => {
    try {
      const newCity = await addCity(cityName);
      setCities((prevCities) => [...prevCities, newCity]);
      return true;
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült hozzáadni a várost.");
      return false;
    }
  }, []);

  const handleDeleteCity = useCallback(async (cityId) => {
    try {
      await deleteCity(cityId);
      setCities((prevCities) =>
        prevCities.filter((city) => city.id !== cityId)
      );
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült törölni a várost.");
    }
  }, []);

  const value = {
    cities,
    isLoading,
    loadCities,
    handleAddCity,
    handleDeleteCity,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCities = () => {
  return useContext(CityContext);
};
