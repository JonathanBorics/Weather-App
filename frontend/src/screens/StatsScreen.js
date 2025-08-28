import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, List, Card, ProgressBar } from "react-native-paper";
import { getPopularityStats } from "../services/AdminService";
import { useFocusEffect } from "@react-navigation/native";

const StatsScreen = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        setIsLoading(true);
        try {
          const data = await getPopularityStats();
          setStats(data);
        } catch (error) {
          Alert.alert("Hiba", "Nem sikerült betölteni a statisztikákat.");
        } finally {
          setIsLoading(false);
        }
      };
      loadStats();
    }, [])
  );

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
        Városok Népszerűsége
      </Text>
      <FlatList
        data={stats}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Card style={styles.card}>
            <List.Item
              title={`${index + 1}. ${item.cityName}`}
              description={`Népszerűség: ${item.popularity}`}
              left={() => <Text style={styles.ranking}>{index + 1}</Text>}
            />
            <ProgressBar
              progress={item.popularity / 100}
              style={styles.progressBar}
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
    marginHorizontal: 16,
    marginVertical: 6,
  },
  ranking: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 16,
    alignSelf: "center",
    color: "gray",
  },
  progressBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default StatsScreen;
