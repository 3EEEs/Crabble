import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Constants from "expo-constants";
console.log(Constants.systemFonts);

import MenuScreen from "./src/screens/MenuScreen";
import SearchScreen from "./src/screens/SearchScreen";
import GameScreen from "./src/screens/GameScreen";
import TestScreen from "./src/screens/TestScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitle: "Crabble" }}>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
