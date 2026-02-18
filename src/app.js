import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GameScreen from "../src/screens/GameScreen";
import MenuScreen from "../src/screens/MenuScreen";
import PlayersScreen from "../src/screens/PlayersScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import ToromboloScreen from "../src/screens/ToromboloScreen"; // 👈 FALTABA

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Torombolo"
          component={ToromboloScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: "Juego" }}
        />

        <Stack.Screen
          name="Players"
          component={PlayersScreen}
          options={{ title: "Jugadores" }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Ajustes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
