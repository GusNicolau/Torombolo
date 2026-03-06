import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usePlayers } from "../context/PlayersContext";
const TAPETE = require("../../assets/tapete/Tapete2.png");
// Avatares por defecto disponibles
const AVATARES = [
  require("../../assets/moustache/ale.png"),
  require("../../assets/moustache/andreu.png"),
  require("../../assets/moustache/carlos.png"),
  require("../../assets/moustache/dani.png"),
  require("../../assets/moustache/gustavo.png"),
  require("../../assets/moustache/mario.png"),
];

export default function PlayersScreen({ navigation }) {
  const [playerName, setPlayerName] = useState("");
  const { jugadores, addJugador, removeJugador, moveJugador } = usePlayers();

  let maxAlertShown = false;
  const addPlayer = () => {
    if (playerName.trim() === "") return;
    if (jugadores.length >= 4) {
      if (!maxAlertShown) {
        Alert.alert(
          "Máximo 4 jugadores",
          "No puedes añadir más de 4 jugadores.",
        );
        maxAlertShown = true;
      }
      return;
    }
    // Evitar repetir avatar si hay disponibles
    const usados = jugadores.map((j) => j.imagen);
    const disponibles = AVATARES.filter((a) => !usados.includes(a));
    let randomAvatar;
    if (disponibles.length > 0) {
      randomAvatar =
        disponibles[Math.floor(Math.random() * disponibles.length)];
    } else {
      randomAvatar = AVATARES[Math.floor(Math.random() * AVATARES.length)];
    }
    addJugador({
      nombre: playerName.trim(),
      imagen: randomAvatar,
    });
    setPlayerName("");
    maxAlertShown = false;
  };

  const movePlayerUp = (nombre) => {
    const idx = jugadores.findIndex((j) => j.nombre === nombre);
    if (idx <= 0) return;

    const posiciones = ["top", "middle", "bottom"];
    const currentPos = jugadores[idx].posicion;
    const currentIdx = posiciones.indexOf(currentPos);
    if (currentIdx > 0) {
      moveJugador(nombre, posiciones[currentIdx - 1]);
    }
  };

  const movePlayerDown = (nombre) => {
    const idx = jugadores.findIndex((j) => j.nombre === nombre);
    if (idx >= jugadores.length - 1) return;

    const posiciones = ["top", "middle", "bottom"];
    const currentPos = jugadores[idx].posicion;
    const currentIdx = posiciones.indexOf(currentPos);
    if (currentIdx < posiciones.length - 1) {
      moveJugador(nombre, posiciones[currentIdx + 1]);
    }
  };

  // Roles dinámicos según número de jugadores
  const getRoleColor = (index) => {
    if (jugadores.length === 4) {
      // Oros, Copas, Espadas, Bastos
      return ["#fcb33f", "#40b1b9", "#9b59b6", "#b6ec23"][index] || "#95a5a6";
    } else {
      // 3 jugadores: 2-4, 5-7, figuras
      return ["#fcb33f", "#40b1b9", "#9b59b6"][index] || "#95a5a6";
    }
  };

  const getRoleLabel = (index) => {
    if (jugadores.length === 4) {
      // Moneda, Espada, Copa, Basto
      return (
        ["🪙 Oros", "⚔️ Espadas", "🍷 Copas", "🪵 Bastos"][index] || "Sin rol"
      );
    } else {
      return (
        ["🎴 Cartas 2-4", "🎴 Cartas 5-7", "👑 Figuras"][index] || "Sin rol"
      );
    }
  };

  const renderPlayer = (item, index) => {
    // Siempre mostrar imagen, si no hay, usar avatar por defecto
    const avatarSource = item.imagen || AVATARES[0];
    return (
      <View style={styles.playerCard}>
        <View style={styles.playerContent}>
          <View style={styles.playerInfo}>
            <Image source={avatarSource} style={styles.avatar} />
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{item.nombre}</Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: getRoleColor(index) },
                ]}
              >
                <Text style={styles.roleText}>{getRoleLabel(index)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.playerActions}>
            {index > 0 && (
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => movePlayerUp(item.nombre)}
              >
                <Text style={styles.moveButtonText}>⬆</Text>
              </TouchableOpacity>
            )}
            {index < jugadores.length - 1 && (
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() => movePlayerDown(item.nombre)}
              >
                <Text style={styles.moveButtonText}>⬇</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeJugador(item.nombre)}
            >
              <Text style={styles.deleteText}>✖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const canPlay = jugadores.length >= 3 && jugadores.length <= 4;

  return (
    <ImageBackground
      source={TAPETE}
      style={styles.bg}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Menu")}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>◀ Volver</Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 38 }} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Input + botón añadir */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              placeholder="Nombre del jugador"
              placeholderTextColor="#999"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              editable={jugadores.length < 4}
            />
            <TouchableOpacity
              style={[
                styles.primaryButton,
                jugadores.length >= 4 && styles.disabledButton,
              ]}
              onPress={addPlayer}
              activeOpacity={0.8}
              disabled={jugadores.length >= 4}
            >
              <Text style={styles.primaryButtonText}>+ AÑADIR</Text>
            </TouchableOpacity>
          </View>

          {jugadores.length >= 4 && (
            <View style={[styles.infoBox, { marginBottom: 0 }]}>
              <Text style={styles.infoText}>Máximo 4 jugadores alcanzado</Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                jugadores.length >= 4 && styles.disabledButton,
              ]}
              onPress={() => {
                if (jugadores.length >= 4) {
                  Alert.alert(
                    "Máximo 4 jugadores",
                    "Máximo de 4 jugadores alcanzado.",
                  );
                  return;
                }
                navigation.navigate("Moustache");
              }}
              activeOpacity={jugadores.length >= 4 ? 0.5 : 0.8}
              disabled={jugadores.length >= 4}
            >
              <Text style={styles.secondaryButtonText}>AVATARES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, !canPlay && styles.disabledButton]}
              onPress={() => {
                if (canPlay) {
                  navigation.navigate("Game", { numPlayers: jugadores.length });
                } else {
                  Alert.alert(
                    "Jugadores insuficientes",
                    "Debes añadir entre 3 y 4 jugadores para jugar.",
                  );
                }
              }}
              disabled={!canPlay}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                ▶ JUGAR{" "}
                {jugadores.length < 3
                  ? `(${jugadores.length}/3)`
                  : jugadores.length > 4
                    ? "(máx 4)"
                    : ""}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info si no hay suficientes jugadores o demasiados */}
          {jugadores.length < 3 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ⚠️ Se necesitan mínimo 3 jugadores
              </Text>
            </View>
          )}

          {/* Lista de jugadores */}
          <View style={styles.playersList}>
            {jugadores.length === 0 ? (
              <View style={styles.emptyState}></View>
            ) : (
              jugadores.map((j, idx) => (
                <View key={`${j.nombre}-${idx}`}>{renderPlayer(j, idx)}</View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 18,
    marginTop: 50,
    marginBottom: -20,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(27,27,27,0.92)",
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },

  inputSection: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#111",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "700",
    borderWidth: 2,
    borderColor: "#c0392b",
    fontFamily: "monospace",
    letterSpacing: 1,
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  secondaryButton: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    flex: 1,
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
    borderColor: "#ffffff",
    opacity: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    marginTop: 40,
  },
  infoBox: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#c0392b",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  infoText: {
    color: "#c0392b",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: "#222",
    borderRadius: 14,
    padding: 18,
    borderWidth: 2,
    borderColor: "#888",
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  playerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#888",
    borderWidth: 2,
    borderColor: "#c0392b",
  },
  playerDetails: {
    flex: 1,
    gap: 6,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    backgroundColor: "#888",
    borderWidth: 2,
    borderColor: "#b3afaf",
    marginTop: 2,
  },
  roleText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  moveButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  moveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  deleteButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  deleteText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontWeight: "900",
    fontFamily: "monospace",
    marginBottom: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyStateSubtext: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
