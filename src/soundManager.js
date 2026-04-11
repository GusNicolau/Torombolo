import { Audio } from "expo-av";

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

    const { sound } = await Audio.Sound.createAsync(soundFiles[soundName]);
    try {
      await sound.playAsync();
      console.log(`Playing sound: ${soundName}`);
      // Auto-unload after playing
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
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

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/mandolina.mp3"),
    );
    try {
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
