import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

let backgroundSound = null;
let cachedSounds = {};
let soundSettings = {
  enabled: true,
  backgroundVolume: 0.7,
  sfxVolume: 1,
};

export const initSounds = async () => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      interruptionMode: "duckOthers",
    });

    // Preload sounds for faster playback
    await preloadSounds();
  } catch (error) {
    console.warn("Audio initialization error:", error.message);
  }
};

const preloadSounds = async () => {
  const soundFiles = {
    toast: require("../assets/audio/toast.mp3"),
    carta: require("../assets/audio/carta.mp3"),
  };

  for (const [name, file] of Object.entries(soundFiles)) {
    try {
      cachedSounds[name] = createAudioPlayer(file);
    } catch (error) {
      console.warn(`Error preloading ${name}:`, error.message);
    }
  }
};

export const updateSoundSettings = (settings) => {
  const wasEnabled = soundSettings.enabled;
  soundSettings = { ...soundSettings, ...settings };

  // Si cambió el estado de enabled, actuar sobre la música
  if (settings.enabled !== undefined && settings.enabled !== wasEnabled) {
    toggleBackgroundMusic(settings.enabled);
  }
};

export const playSound = async (soundName) => {
  try {
    // Skip if sounds are disabled
    if (!soundSettings.enabled) {
      return;
    }

    // Try to use cached sound first
    let sound = cachedSounds[soundName];
    let isNew = false;

    if (!sound) {
      const soundFiles = {
        toast: require("../assets/audio/toast.mp3"),
        carta: require("../assets/audio/carta.mp3"),
      };

      if (!soundFiles[soundName]) {
        console.warn(`Sound ${soundName} not found`);
        return;
      }

      sound = createAudioPlayer(soundFiles[soundName]);
      isNew = true;
    }

    try {
      // Set volume based on sound type
      sound.volume = soundSettings.sfxVolume;

      // Reset playback to start if using cached sound
      if (!isNew) {
        sound.pause();
        await sound.seekTo(0);
      }
      sound.play();

      // Auto-release after playing if it was newly created
      if (isNew) {
        const subscription = sound.addListener(
          "playbackStatusUpdate",
          (status) => {
            if (status.didJustFinish) {
              subscription.remove();
              sound.remove();
            }
          },
        );
      }
    } catch (error) {
      console.warn(`Error playing ${soundName}:`, error.message);
      if (isNew) {
        sound.remove();
      }
    }
  } catch (error) {
    console.warn(`Error playing ${soundName}:`, error.message);
  }
};

export const playBackgroundMusic = async () => {
  // Ningún llamador (GameScreen al volver del menú, reanudar desde
  // background, etc.) debe poder arrancar música si el sonido está
  // desactivado; centralizarlo aquí evita tener que repetir el chequeo
  // en cada sitio que llama a esta función.
  if (!soundSettings.enabled) return;
  try {
    if (backgroundSound) {
      try {
        backgroundSound.pause();
        backgroundSound.remove();
      } catch (_e) {
        // Ignore cleanup errors
      }
    }

    const sound = createAudioPlayer(require("../assets/audio/mandolina.mp3"));
    try {
      sound.loop = true;
      const volumeToSet = soundSettings.backgroundVolume || 0.7;
      sound.volume = volumeToSet;
      sound.play();
      backgroundSound = sound;
    } catch (error) {
      console.warn("Error during background music setup:", error.message);
      sound.remove();
    }
  } catch (error) {
    console.warn("Error playing background music:", error.message);
  }
};

export const updateBackgroundMusicVolume = async (volume) => {
  try {
    if (backgroundSound) {
      backgroundSound.volume = volume;
    }
  } catch (error) {
    console.warn("Error updating background music volume:", error.message);
  }
};

export const toggleBackgroundMusic = async (enabled) => {
  try {
    if (enabled) {
      // Resume or start background music
      if (backgroundSound) {
        backgroundSound.play();
      } else {
        await playBackgroundMusic();
      }
    } else {
      // Pause background music
      if (backgroundSound) {
        backgroundSound.pause();
      }
    }
  } catch (error) {
    console.warn("Error toggling background music:", error.message);
  }
};

export const stopBackgroundMusic = async () => {
  try {
    if (backgroundSound) {
      backgroundSound.pause();
      backgroundSound.remove();
      backgroundSound = null;
    }
  } catch (error) {
    console.warn("Error stopping background music:", error.message);
  }
};
