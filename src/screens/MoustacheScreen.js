import { useState } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePlayers } from "../context/PlayersContext";
const FONDO = require("../../assets/images/Inicio5.png");

const moustacheAmigas = [
  { nombre: "Sherco", imagen: require("../../assets/moustache/gustavo.png") },
  { nombre: "Carlota", imagen: require("../../assets/moustache/carlos.png") },
  { nombre: "Toffe", imagen: require("../../assets/moustache/andreu.png") },
  { nombre: "Mariojt72", imagen: require("../../assets/moustache/mario.png") },
  { nombre: "Calent", imagen: require("../../assets/moustache/dani.png") },
  { nombre: "Amerla", imagen: require("../../assets/moustache/ale.png") },
  { nombre: "Cigrona", imagen: require("../../assets/moustache/lara.png") },
];

const avatares = [
  { nombre: "Avatar 1", imagen: require("../../assets/avatares/Avatar1.png") },
  { nombre: "Avatar 2", imagen: require("../../assets/avatares/Avatar2.png") },
  { nombre: "Avatar 3", imagen: require("../../assets/avatares/Avatar3.png") },
  { nombre: "Avatar 4", imagen: require("../../assets/avatares/Avatar4.png") },
  { nombre: "Avatar 5", imagen: require("../../assets/avatares/Avatar5.png") },
  { nombre: "Avatar 6", imagen: require("../../assets/avatares/Avatar6.png") },
  { nombre: "Avatar 7", imagen: require("../../assets/avatares/Avatar7.png") },
  { nombre: "Avatar 8", imagen: require("../../assets/avatares/Avatar8.png") },
];

export default function MoustacheScreen({ navigation }) {
  const { addJugador, getAllPlayers } = usePlayers();
  const [seleccionados, setSeleccionados] = useState([]);
  const [maxAlertShown, setMaxAlertShown] = useState(false);
  const [tabActivo, setTabActivo] = useState("avatares"); // "moustache" o "avatares"

  const allPlayers = getAllPlayers() || [];
  const jugadoresCount = allPlayers.length;
  const totalSeleccionados = jugadoresCount + seleccionados.length;
  const maxReached = totalSeleccionados >= 4;

  const avataresMostrados =
    tabActivo === "avatares" ? avatares : moustacheAmigas;
  const disponibles = avataresMostrados.filter(
    (a) => !allPlayers.some((j) => j && j.nombre === a.nombre),
  );

  const toggleSeleccion = (nombre) => {
    if (seleccionados.includes(nombre)) {
      setSeleccionados((prev) => prev.filter((n) => n !== nombre));
      setMaxAlertShown(false);
      return;
    }
    if (totalSeleccionados >= 4) {
      if (!maxAlertShown) {
        Alert.alert(
          "Máximo 4 jugadores",
          "No se puede añadir más de 4 jugadores.",
        );
        setMaxAlertShown(true);
      }
      return;
    }
    setSeleccionados((prev) => [...prev, nombre]);
    setMaxAlertShown(false);
  };

  const confirmarSeleccion = () => {
    if (totalSeleccionados > 4) {
      if (!maxAlertShown) {
        Alert.alert(
          "Máximo 4 jugadores",
          "No se puede añadir más de 4 jugadores.",
        );
        setMaxAlertShown(true);
      }
      return;
    }
    seleccionados.forEach((nombre) => {
      const seleccionado = avataresMostrados.find((a) => a.nombre === nombre);
      addJugador({ nombre, imagen: seleccionado?.imagen ?? null });
    });
    navigation.goBack();
    setMaxAlertShown(false);
  };

  return (
    <ImageBackground
      source={FONDO}
      style={{ flex: 1, width: "100%", height: "100%" }}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>◀ Volver</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Selecciona tus jugadores</Text>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, tabActivo === "avatares" && styles.tabActive]}
              onPress={() => {
                setTabActivo("avatares");
                setSeleccionados([]);
              }}
            >
              <Text style={styles.tabText}>Avatares</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                tabActivo === "moustache" && styles.tabActive,
              ]}
              onPress={() => {
                setTabActivo("moustache");
                setSeleccionados([]);
              }}
            >
              <Text style={styles.tabText}>Moustache</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.counter}>
            Jugadores actuales: {jugadoresCount + seleccionados.length}/4
          </Text>

          {maxReached && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Máximo 4 jugadores alcanzado</Text>
            </View>
          )}

          <FlatList
            data={disponibles}
            keyExtractor={(item) => item.nombre}
            numColumns={2}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => {
              const isSelected = seleccionados.includes(item.nombre);
              const disabled = !isSelected && totalSeleccionados >= 4;
              return (
                <TouchableOpacity
                  onPress={() => toggleSeleccion(item.nombre)}
                  style={[
                    styles.cardContainer,
                    isSelected && styles.cardSelected,
                    disabled && styles.disabledButton,
                  ]}
                  disabled={disabled}
                  activeOpacity={disabled ? 0.5 : 0.8}
                >
                  <ImageBackground
                    source={item.imagen}
                    style={styles.image}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <View style={styles.nameOverlay}>
                      <Text style={styles.name}>{item.nombre}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />

          {seleccionados.length > 0 && (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                totalSeleccionados > 4 && styles.disabledButton,
              ]}
              onPress={confirmarSeleccion}
              disabled={totalSeleccionados > 4}
              activeOpacity={totalSeleccionados > 4 ? 0.5 : 0.8}
            >
              <Text style={styles.confirmText}>
                CONFIRMAR ({seleccionados.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20,14,10,0.86)",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
    marginTop: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#666",
  },
  tabActive: {
    backgroundColor: "#2a1c14",
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  tabText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  backButton: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "#2a1c14",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d4a04c",
    zIndex: 10,
    shadowColor: "#d4a04c",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 40,
  },
  grid: { justifyContent: "center" },
  cardContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#888",
    overflow: "hidden",
    backgroundColor: "#2a1c14",
  },
  counter: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardSelected: {
    borderColor: "#d4a04c",
    transform: [{ scale: 1.05 }],
  },
  image: { flex: 1, justifyContent: "flex-end" },
  nameOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: "#1c130d",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
    borderColor: "#d4a04c",
    opacity: 0.5,
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 60,
    backgroundColor: "#2a1c14",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
