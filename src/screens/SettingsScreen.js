import Slider from "@react-native-community/slider";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSoundSettings } from "../context/SoundSettingsContext";
import { updateBackgroundMusicVolume } from "../soundManager";

const TAPETE = require("../../assets/tapete/Tapete2.png");

export default function SettingsScreen({ navigation }) {
  const {
    soundEnabled,
    toggleSound,
    backgroundVolume,
    updateBackgroundVolume,
    sfxVolume,
    updateSfxVolume,
  } = useSoundSettings();

  const handleBackgroundVolumeChange = async (value) => {
    await updateBackgroundVolume(value);
    await updateBackgroundMusicVolume(value);
  };

  return (
    <ImageBackground
      source={TAPETE}
      style={styles.backgroundImage}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>◀ Volver</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>⚙️ Ajustes de Sonido</Text>

          {/* Sound On/Off Button */}
          <View style={styles.soundToggleSection}>
            <TouchableOpacity
              style={[
                styles.soundToggle,
                soundEnabled ? styles.soundOn : styles.soundOff,
              ]}
              onPress={toggleSound}
            >
              <Text style={styles.soundIcon}>{soundEnabled ? "🔊" : "🔇"}</Text>
              <Text style={styles.soundToggleText}>
                {soundEnabled ? "Sonido Activado" : "Sonido Desactivado"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Background Music Volume */}
          <View style={styles.volumeSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>🎵 Música de Fondo</Text>
              <Text style={styles.volumeValue}>
                {Math.round(backgroundVolume * 100)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={backgroundVolume}
              onValueChange={handleBackgroundVolumeChange}
              minimumTrackTintColor="#FF6B6B"
              maximumTrackTintColor="#333"
              thumbTintColor="#FF6B6B"
              disabled={!soundEnabled}
            />
          </View>

          {/* SFX Volume (Cartas and Toast) */}
          <View style={styles.volumeSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>🔔 Efectos de Sonido</Text>
              <Text style={styles.volumeValue}>
                {Math.round(sfxVolume * 100)}%
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={sfxVolume}
              onValueChange={updateSfxVolume}
              minimumTrackTintColor="#4ECDC4"
              maximumTrackTintColor="#333"
              thumbTintColor="#4ECDC4"
              disabled={!soundEnabled}
            />
            <Text style={styles.description}>
              Sonidos de cartas, toasts y dados
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(27, 27, 27, 0.92)",
    paddingTop: 60,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#c0392b",
    zIndex: 10,
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FF6B35",
    marginBottom: 40,
    marginTop: 90,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  soundToggleSection: {
    width: "100%",
    marginBottom: 50,
    alignItems: "center",
  },
  soundToggle: {
    width: "95%",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  soundOn: {
    backgroundColor: "rgba(78, 205, 196, 0.15)",
    borderColor: "#4ECDC4",
  },
  soundOff: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderColor: "#FF6B6B",
  },
  soundIcon: {
    fontSize: 32,
  },
  soundToggleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  volumeSection: {
    width: "100%",
    marginBottom: 50,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "rgba(20, 20, 20, 0.6)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  volumeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4ECDC4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(78, 205, 196, 0.15)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4ECDC4",
  },
  slider: {
    width: "100%",
    height: 44,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
    letterSpacing: 0.2,
  },
});
