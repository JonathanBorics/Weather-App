import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Avatar } from "react-native-paper";

// Ez a komponens "props"-ként kapja meg az adatokat
const WeatherCard = ({ cityName, temperature, condition, icon }) => {
  // Egy egyszerű logika, ami az ikon kódja alapján választ egy ikont
  // A jövőben itt az OpenWeather API által adott ikon kódokat lehet majd kezelni
  const WeatherIcon = (props) => (
    <Avatar.Icon
      {...props}
      icon={icon === "sun" ? "weather-sunny" : "weather-cloudy"}
    />
  );

  return (
    <Card style={styles.card}>
      <Card.Title
        title={cityName}
        titleVariant="headlineMedium"
        subtitle={condition}
        left={WeatherIcon} // Itt jelenítjük meg az ikont
      />
      <Card.Content>
        <Text variant="displayMedium" style={styles.temperature}>
          {temperature}°C
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  temperature: {
    textAlign: "center",
    marginTop: 8,
  },
});

export default WeatherCard;
