import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { PlayersProvider } from "./src/context/PlayersContext";
import { SoundSettingsProvider } from "./src/context/SoundSettingsContext";
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

function AppContent() {
  const appState = useRef(AppState.currentState);

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

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has come to foreground
      await playBackgroundMusic();
    } else if (nextAppState.match(/inactive|background/)) {
      // App has gone to background
      await stopBackgroundMusic();
    }
    appState.current = nextAppState;
  };

  return (
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
  );
}

export default function App() {
  return (
    <PlayersProvider>
      <SoundSettingsProvider>
        <AppContent />
      </SoundSettingsProvider>
    </PlayersProvider>
  );
}
