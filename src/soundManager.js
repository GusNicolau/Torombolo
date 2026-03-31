import { Audio, Sound } from "expo-video";

let backgroundSound = null;

export const initSounds = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
    console.log("Audio initialized successfully");
  } catch (error) {
    console.warn("Audio initialization error:", error.message);
  }
};

export const playSound = async (soundName) => {
  try {
    const soundFiles = {
      toast: require("../assets/audio/toast.mp3"),
      carta: require("../assets/audio/carta.mp3"),
    };

    if (!soundFiles[soundName]) {
      console.warn(`Sound ${soundName} not found`);
      return;
    }

    const sound = new Sound();
    try {
      await sound.loadAsync(soundFiles[soundName]);
      await sound.playAsync();
      console.log(`Playing sound: ${soundName}`);
    } catch (error) {
      console.warn(`Error playing ${soundName}:`, error.message);
      await sound.unloadAsync();
    }
  } catch (error) {
    console.warn(`Error playing ${soundName}:`, error.message);
  }
};

export const playBackgroundMusic = async () => {
  try {
    if (backgroundSound) {
      try {
        await backgroundSound.stopAsync();
        await backgroundSound.unloadAsync();
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    const sound = new Sound();
    try {
      await sound.loadAsync(require("../assets/audio/mandolina.mp3"));
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
      backgroundSound = sound;
      console.log("Background music playing");
    } catch (error) {
      console.warn("Error loading background music:", error.message);
      await sound.unloadAsync();
    }
  } catch (error) {
    console.warn("Error playing background music:", error.message);
  }
};

export const stopBackgroundMusic = async () => {
  try {
    if (backgroundSound) {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
    }
  } catch (error) {
    console.warn("Error stopping background music:", error.message);
  }
};
