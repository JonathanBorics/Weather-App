// src/navigation/AuthNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { colors } = useTheme(); // Behúzzuk a téma színeit

  return (
    <Stack.Navigator
      screenOptions={{
        // Egységes stílus a fejlécnek
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // A Login képernyőn ne legyen fejléc
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Regisztráció" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Elfelejtett jelszó" }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: "Új jelszó" }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
