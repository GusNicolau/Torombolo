import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { PlayersProvider } from "./src/context/PlayersContext";
import GameScreen from "./src/screens/GameScreen";
import MenuScreen from "./src/screens/MenuScreen";
import MoustacheScreen from "./src/screens/MoustacheScreen";
import PlayersScreen from "./src/screens/PlayersScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ToromboloScreen from "./src/screens/ToromboloScreen";
import {
  initSounds,
  playBackgroundMusic,
  stopBackgroundMusic,
} from "./src/soundManager";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const setupAudio = async () => {
      await initSounds();
      await playBackgroundMusic();
    };
    setupAudio();
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  return (
    <PlayersProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            animationEnabled: true,
            presentation: "transparentModal",
            cardStyleInterpolator: ({ current, next, layouts }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              };
            },
            transitionSpec: {
              open: {
                animation: "timing",
                config: {
                  duration: 400,
                  easing: require("react-native").Easing.inOut(
                    require("react-native").Easing.ease,
                  ),
                },
              },
              close: {
                animation: "timing",
                config: {
                  duration: 400,
                  easing: require("react-native").Easing.inOut(
                    require("react-native").Easing.ease,
                  ),
                },
              },
            },
          }}
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
