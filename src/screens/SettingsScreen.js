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

const BARAJAS = [
  { id: "baraja", label: "🃏 Clásica", descripcion: "Baraja clásica" },
  { id: "cartas", label: "🂠 PixelArt", descripcion: "Baraja alternativa" },
];

export default function SettingsScreen({ navigation }) {
  const {
    soundEnabled,
    toggleSound,
    backgroundVolume,
    updateBackgroundVolume,
    sfxVolume,
    updateSfxVolume,
    barajaSeleccionada, // ← añade esto
    updateBaraja,
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>◀ Volver</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Ajustes</Text>
            <View style={styles.titleDivider}>
              <View style={styles.titleDividerLine} />
              <Text style={styles.titleDividerIcon}>✦</Text>
              <View style={styles.titleDividerLine} />
            </View>
          </View>

          {/* ── SECCIÓN BARAJA ── */}
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>🃏 Tipo de Baraja</Text>
            <View style={styles.barajaSection}>
              {BARAJAS.map((baraja) => {
                const isSelected = barajaSeleccionada === baraja.id;
                return (
                  <TouchableOpacity
                    key={baraja.id}
                    style={[
                      styles.barajaBtn,
                      isSelected && styles.barajaBtnSelected,
                    ]}
                    onPress={() => updateBaraja(baraja.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.barajaBtnLabel,
                        isSelected && styles.barajaBtnLabelSelected,
                      ]}
                    >
                      {baraja.label}
                    </Text>
                    <Text
                      style={[
                        styles.barajaBtnDesc,
                        isSelected && styles.barajaBtnDescSelected,
                      ]}
                    >
                      {baraja.descripcion}
                    </Text>
                    {isSelected && (
                      <View style={styles.barajaCheck}>
                        <Text style={styles.barajaCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── SECCIÓN SONIDO ── */}
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>🔊 Sonido</Text>

            {/* Toggle sonido */}
            <TouchableOpacity
              style={[
                styles.soundToggle,
                soundEnabled ? styles.soundOn : styles.soundOff,
              ]}
              onPress={toggleSound}
              activeOpacity={0.85}
            >
              <Text style={styles.soundIcon}>{soundEnabled ? "🔊" : "🔇"}</Text>
              <Text
                style={[
                  styles.soundToggleText,
                  soundEnabled
                    ? styles.soundToggleTextOn
                    : styles.soundToggleTextOff,
                ]}
              >
                {soundEnabled ? "Sonido Activado" : "Sonido Desactivado"}
              </Text>
            </TouchableOpacity>

            {/* Volumen música de fondo */}
            <View
              style={[
                styles.volumeSection,
                !soundEnabled && styles.volumeSectionDisabled,
              ]}
            >
              <View style={styles.labelContainer}>
                <Text style={styles.label}>🎵 Música de Fondo</Text>
                <Text style={[styles.volumeValue, styles.volumeValueOrange]}>
                  {Math.round(backgroundVolume * 100)}%
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={backgroundVolume}
                onValueChange={handleBackgroundVolumeChange}
                minimumTrackTintColor="#d4a04c"
                maximumTrackTintColor="#333"
                thumbTintColor="#d4a04c"
                disabled={!soundEnabled}
              />
            </View>

            {/* Volumen efectos */}
            <View
              style={[
                styles.volumeSection,
                !soundEnabled && styles.volumeSectionDisabled,
              ]}
            >
              <View style={styles.labelContainer}>
                <Text style={styles.label}>🔔 Efectos de Sonido</Text>
                <Text style={[styles.volumeValue, styles.volumeValueRed]}>
                  {Math.round(sfxVolume * 100)}%
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={sfxVolume}
                onValueChange={updateSfxVolume}
                minimumTrackTintColor="#c0392b"
                maximumTrackTintColor="#333"
                thumbTintColor="#c0392b"
                disabled={!soundEnabled}
              />
              <Text style={styles.description}>
                Sonidos de cartas, toasts y dados
              </Text>
            </View>
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
    backgroundColor: "rgba(20, 14, 10, 0.86)",
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a1c14",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleBlock: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#d4a04c",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "monospace",
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    width: 220,
  },
  titleDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(212, 160, 76, 0.4)",
  },
  titleDividerIcon: {
    color: "#d4a04c",
    fontSize: 14,
    marginHorizontal: 10,
  },

  // Paneles
  panel: {
    backgroundColor: "rgba(30, 20, 14, 0.75)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(212, 160, 76, 0.25)",
    padding: 18,
    marginBottom: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  sectionTitle: {
    color: "#d4a04c",
    fontSize: 15,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: "uppercase",
    borderLeftWidth: 3,
    borderLeftColor: "#d4a04c",
    paddingLeft: 10,
  },

  // Baraja: tarjetas con proporción de naipe
  barajaSection: {
    flexDirection: "row",
    gap: 14,
  },
  barajaBtn: {
    flex: 1,
    minHeight: 120,
    backgroundColor: "rgba(30, 20, 14, 0.8)",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  barajaBtnSelected: {
    borderColor: "#d4a04c",
    backgroundColor: "rgba(212, 160, 76, 0.12)",
    shadowColor: "#d4a04c",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  barajaBtnLabel: {
    color: "#aaa",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    marginBottom: 6,
    textAlign: "center",
  },
  barajaBtnLabelSelected: {
    color: "#fff",
  },
  barajaBtnDesc: {
    color: "#666",
    fontSize: 11,
    fontFamily: "monospace",
    textAlign: "center",
  },
  barajaBtnDescSelected: {
    color: "#d4a04c",
  },
  barajaCheck: {
    position: "absolute",
    top: -9,
    right: -9,
    backgroundColor: "#d4a04c",
    borderRadius: 11,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2a1c14",
  },
  barajaCheckText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  // Sonido
  soundToggle: {
    width: "100%",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    borderWidth: 2,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  soundOn: {
    backgroundColor: "rgba(212, 160, 76, 0.15)",
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
  },
  soundOff: {
    backgroundColor: "rgba(192, 57, 43, 0.15)",
    borderColor: "#c0392b",
    shadowColor: "#000",
  },
  soundIcon: {
    fontSize: 32,
  },
  soundToggleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  soundToggleTextOn: {
    color: "#fff",
  },
  soundToggleTextOff: {
    color: "#ddd",
  },
  volumeSection: {
    width: "100%",
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212, 160, 76, 0.2)",
  },
  volumeSectionDisabled: {
    opacity: 0.4,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  volumeValue: {
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  volumeValueOrange: {
    color: "#d4a04c",
    backgroundColor: "rgba(212, 160, 76, 0.14)",
    borderColor: "#d4a04c",
  },
  volumeValueRed: {
    color: "#e57368",
    backgroundColor: "rgba(192, 57, 43, 0.14)",
    borderColor: "#c0392b",
  },
  slider: {
    width: "100%",
    height: 44,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
