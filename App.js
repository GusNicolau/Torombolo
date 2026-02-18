import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlayersProvider } from "./src/context/PlayersContext";
import GameScreen from "./src/screens/GameScreen";
import MenuScreen from "./src/screens/MenuScreen";
import MoustacheScreen from "./src/screens/MoustacheScreen";
import PlayersScreen from "./src/screens/PlayersScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ToromboloScreen from "./src/screens/ToromboloScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PlayersProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{ animationEnabled: false }}
        >
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Players"
            component={PlayersScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Moustache"
            component={MoustacheScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Torombolo"
            component={ToromboloScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PlayersProvider>
  );
}
