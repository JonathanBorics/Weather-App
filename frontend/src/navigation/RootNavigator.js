import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoading, userToken } = useAuth(); // Itt is lekérdezzük a tokent

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
        {userToken ? (
          // Ha be vagyunk lépve, CSAK az AppNavigator létezik a stack-en
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          // Ha nem vagyunk belépve, az AppNavigator és az AuthNavigator is létezik
          <>
            <Stack.Screen name="App" component={AppNavigator} />
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
              options={{ presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
