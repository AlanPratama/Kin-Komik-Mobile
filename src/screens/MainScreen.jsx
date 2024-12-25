import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import FavoriteComicsScreen from "./main/FavoriteComicsScreen";
import HistoryComicsScreen from "./main/HistoryComicsScreen";
import HomeScreen from "./main/HomeScreen";
import InfoScreen from "./main/InfoScreen";
import SearchScreen from "./main/SearchScreen";

export default function MainScreen() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Favorite":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "History":
              iconName = focused ? "time" : "time-outline";
              break;
            case "Info":
              iconName = focused
                ? "information-circle"
                : "information-circle-outline";
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#f9cb55",
        tabBarInactiveTintColor: "#c1c1c1",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorite" component={FavoriteComicsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="History" component={HistoryComicsScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    borderColor: "#c1c1c1",
    borderTopWidth: 0.35,
    backgroundColor: "#121212",
    elevation: 0,
    paddingTop: 10,
    zIndex: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  screenText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
