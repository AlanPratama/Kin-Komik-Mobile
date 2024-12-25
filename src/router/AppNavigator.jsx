import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ChapterDetailScreen from "../screens/ChapterDetailScreen";
import ComicByGenreScreen from "../screens/ComicByGenreScreen";
import ComicDetailScreen from "../screens/ComicDetailScreen";
import MainScreen from "../screens/MainScreen";

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="MainScreen"
            >
              <Stack.Screen name="MainScreen" component={MainScreen} />

              <Stack.Screen name="ComicByGenre" component={ComicByGenreScreen} />

              <Stack.Screen name="ComicDetail" component={ComicDetailScreen} />
              <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} />

            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
