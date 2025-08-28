import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { AuthContext } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoading } = useContext(AuthContext);

  // Amíg a tokent a SecureStore-ból olvassuk, mutassunk egy töltőképernyőt
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Az alap képernyőnk mindig a fő (Tab) navigátor */}
        <Stack.Screen name="App" component={AppNavigator} />

        {/* Az authentikációs képernyőket egy külön, modális csoportban jelenítjük meg */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
