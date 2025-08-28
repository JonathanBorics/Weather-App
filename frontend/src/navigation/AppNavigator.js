import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ManageCitiesScreen from "../screens/ManageCitiesScreen";
import AdminScreen from "../screens/AdminScreen"; // Admin képernyő importálása
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  // A userToken mellé most már a userRole-t is lekérdezzük a kontextusból
  const { userToken, userRole } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Kezdőlap",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      {userToken ? (
        <>
          {/* Ezek a fülek csak bejelentkezett felhasználóknak jelennek meg */}
          <Tab.Screen
            name="ManageCities"
            component={ManageCitiesScreen}
            options={{
              title: "Városok",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="city-variant"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "Profil",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          {/* --- EZ A BEILLESZTETT ÚJ RÉSZ --- */}
          {/* Ez a fül csak akkor jelenik meg, ha a felhasználó admin */}
          {userRole === "admin" && (
            <Tab.Screen
              name="Admin"
              component={AdminScreen}
              options={{
                title: "Admin",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="shield-account"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          )}
          {/* --- EDDIG TART AZ ÚJ RÉSZ --- */}
        </>
      ) : (
        <>
          {/* Ez a fül csak vendégeknek jelenik meg */}
          <Tab.Screen
            name="LoginTab"
            component={() => null} // Nincs valódi képernyője
            options={{
              title: "Bejelentkezés",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="login"
                  color={color}
                  size={size}
                />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault(); // Megakadályozzuk az alapértelmezett navigációt
                navigation.navigate("Auth", { screen: "Login" }); // Átirányítjuk az Auth stack-re
              },
            })}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;
