import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ManageCitiesScreen from "../screens/ManageCitiesScreen";
import AdminNavigator from "./AdminNavigator";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";

const Tab = createBottomTabNavigator();

// Ezt a komponenst definiáljuk a renderelési cikluson kívül,
// hogy megszüntessük a teljesítményre vonatkozó figyelmeztetést.
// Mivel ez egy konstans, a React nem hozza létre minden rendereléskor újra.
const EmptyComponent = () => null;

const AppNavigator = () => {
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
          {/* Bejelentkezett felhasználói fülek */}
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

          {/* Admin fül, ami csak adminoknak jelenik meg */}
          {userRole === "admin" && (
            <Tab.Screen
              name="Admin"
              component={AdminNavigator} // A belső navigátort használja
              options={{
                title: "Admin",
                headerShown: false, // Elrejtjük a Tab Navigator saját fejlécét, hogy a belsőé látszódjon
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
        </>
      ) : (
        <>
          {/* Vendég felhasználó "Bejelentkezés" füle */}
          <Tab.Screen
            name="LoginTab"
            component={EmptyComponent} // Itt használjuk a konstans komponenst
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
                e.preventDefault(); // Megakadályozzuk a navigációt a "nulla" komponensre
                navigation.navigate("Auth", { screen: "Login" }); // Átirányítjuk a modális bejelentkezőre
              },
            })}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;
