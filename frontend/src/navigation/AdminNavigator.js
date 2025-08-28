import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../screens/AdminDashboardScreen"; // Ezt mindjárt létrehozzuk
import UserManagementScreen from "../screens/AdminScreen"; // Átnevezzük a logikában
import StatsScreen from "../screens/StatsScreen";

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Admin Kezelőpult" }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: "Felhasználók Kezelése" }}
      />
      <Stack.Screen
        name="PopularityStats"
        component={StatsScreen}
        options={{ title: "Népszerűségi Statisztikák" }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
