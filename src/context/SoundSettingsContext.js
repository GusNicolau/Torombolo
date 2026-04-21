import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

const SoundSettingsContext = createContext();

export const SoundSettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [backgroundVolume, setBackgroundVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [appState, setAppState] = useState(AppState.currentState);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (!AsyncStorage.getItem) {
          console.warn("AsyncStorage not available, using defaults");
          return;
        }
        const [enabled, bgVol, sfxVol] = await Promise.all([
          AsyncStorage.getItem("soundEnabled"),
          AsyncStorage.getItem("backgroundVolume"),
          AsyncStorage.getItem("sfxVolume"),
        ]);

        if (enabled !== null) setSoundEnabled(JSON.parse(enabled));
        if (bgVol !== null) setBackgroundVolume(parseFloat(bgVol));
        if (sfxVol !== null) setSfxVolume(parseFloat(sfxVol));
      } catch (error) {
        console.warn("Error loading sound settings:", error.message);
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
    try {
      if (AsyncStorage.setItem) {
        await AsyncStorage.setItem("soundEnabled", JSON.stringify(newState));
      }
    } catch (error) {
      console.warn("Error saving sound enabled state:", error.message);
    }
  };

  const updateBackgroundVolume = async (volume) => {
    setBackgroundVolume(volume);
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
