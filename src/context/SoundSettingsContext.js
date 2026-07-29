import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { updateSoundSettings } from "../soundManager"; // añade este import

const SoundSettingsContext = createContext();

export const SoundSettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [backgroundVolume, setBackgroundVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [appState, setAppState] = useState(AppState.currentState);
  const [barajaSeleccionada, setBarajaSeleccionada] = useState("cartas");
  const [isReady, setIsReady] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const baraja = await AsyncStorage.getItem("barajaSeleccionada");
        if (baraja !== null) setBarajaSeleccionada(baraja);

        const [enabledRaw, bgVolRaw, sfxVolRaw] = await Promise.all([
          AsyncStorage.getItem("soundEnabled"),
          AsyncStorage.getItem("backgroundVolume"),
          AsyncStorage.getItem("sfxVolume"),
        ]);

        const enabled =
          enabledRaw !== null ? JSON.parse(enabledRaw) : soundEnabled;
        const bgVol =
          bgVolRaw !== null ? parseFloat(bgVolRaw) : backgroundVolume;
        const sfxVol =
          sfxVolRaw !== null ? parseFloat(sfxVolRaw) : sfxVolume;

        setSoundEnabled(enabled);
        setBackgroundVolume(bgVol);
        setSfxVolume(sfxVol);

        // Sincroniza el motor de audio ya mismo: App.js arranca la música
        // de fondo en cuanto esto resuelve, y debe respetar lo guardado.
        updateSoundSettings({
          enabled,
          backgroundVolume: bgVol,
          sfxVolume: sfxVol,
        });
      } catch (error) {
        console.warn("Error loading sound settings:", error.message);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, []);

  // Listen to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [soundEnabled]);

  const updateBaraja = async (baraja) => {
    setBarajaSeleccionada(baraja); // ← esto debe ejecutarse SIEMPRE
    try {
      await AsyncStorage.setItem("barajaSeleccionada", baraja);
    } catch (error) {
      console.warn("Error saving baraja:", error.message);
      // El estado ya se actualizó arriba, el error solo afecta a la persistencia
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // App has come to foreground - you can restart music if needed
    } else if (nextAppState.match(/inactive|background/)) {
      // App has gone to background - should stop music
    }
    setAppState(nextAppState);
  };

  const toggleSound = async () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);

    // Esto ahora también para/reanuda la música automáticamente
    updateSoundSettings({
      enabled: newState,
      sfxVolume,
      backgroundVolume,
    });

    try {
      await AsyncStorage.setItem("soundEnabled", JSON.stringify(newState));
    } catch (error) {
      console.warn("Error saving sound enabled state:", error.message);
    }
  };

  const updateBackgroundVolume = async (volume) => {
    setBackgroundVolume(volume);
    updateSoundSettings({
      enabled: soundEnabled,
      sfxVolume,
      backgroundVolume: volume,
    });
    try {
      if (AsyncStorage.setItem) {
        await AsyncStorage.setItem("backgroundVolume", volume.toString());
      }
    } catch (error) {
      console.warn("Error saving background volume:", error.message);
    }
  };

  const updateSfxVolume = async (volume) => {
    setSfxVolume(volume);
    updateSoundSettings({
      enabled: soundEnabled,
      sfxVolume: volume,
      backgroundVolume,
    });
    try {
      if (AsyncStorage.setItem) {
        await AsyncStorage.setItem("sfxVolume", volume.toString());
      }
    } catch (error) {
      console.warn("Error saving sfx volume:", error.message);
    }
  };

  const value = {
    soundEnabled,
    toggleSound,
    backgroundVolume,
    updateBackgroundVolume,
    sfxVolume,
    updateSfxVolume,
    appState,
    barajaSeleccionada,
    updateBaraja,
    isReady,
  };

  return (
    <SoundSettingsContext.Provider value={value}>
      {children}
    </SoundSettingsContext.Provider>
  );
};

export const useSoundSettings = () => {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error(
      "useSoundSettings must be used within SoundSettingsProvider",
    );
  }
  return context;
};
