import React from "react";
import { View, StyleSheet } from "react-native";
import { List } from "react-native-paper";

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Kezelési Opciók</List.Subheader>
        <List.Item
          title="Felhasználók Kezelése"
          description="Felhasználók listázása, tiltása, törlése"
          left={() => <List.Icon icon="account-group" />}
          onPress={() => navigation.navigate("UserManagement")}
        />
        <List.Item
          title="Népszerűségi Statisztikák"
          description="Legkedveltebb városok megtekintése"
          left={() => <List.Icon icon="chart-bar" />}
          onPress={() => navigation.navigate("PopularityStats")}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AdminDashboardScreen;
