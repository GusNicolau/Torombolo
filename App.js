import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { PlayersProvider } from "./src/context/PlayersContext";
import {
  SoundSettingsProvider,
  useSoundSettings,
} from "./src/context/SoundSettingsContext";
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
  const { soundEnabled, isReady } = useSoundSettings();

  useEffect(() => {
    initSounds();
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  // Arranca la música una única vez, en cuanto se sabe si el usuario la
  // tenía desactivada (evita reproducirla siempre por defecto y luego
  // tener que pararla, que era lo que hacía parecer roto el toggle al
  // abrir la app). El encendido/apagado posterior ya lo gestiona
  // toggleSound() en el contexto pausando/reanudando el mismo sonido; si
  // este efecto reaccionara también a cada cambio de soundEnabled,
  // ambos caminos crearían pistas de música por separado y sonarían
  // superpuestas.
  const hasStartedAudio = useRef(false);
  useEffect(() => {
    if (!isReady || hasStartedAudio.current) return;
    hasStartedAudio.current = true;
    if (soundEnabled) {
      playBackgroundMusic();
    }
  }, [isReady, soundEnabled]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to foreground
        if (soundEnabled) {
          await playBackgroundMusic();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to background
        await stopBackgroundMusic();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [soundEnabled]);

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
