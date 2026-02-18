import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayers } from "../context/PlayersContext";

export default function PlayersScreen({ navigation }) {
  const [playerName, setPlayerName] = useState("");
  const { jugadores, addJugador, removeJugador, moveJugador } = usePlayers();

  const addPlayer = () => {
    if (playerName.trim() === "") return;

    addJugador({
      nombre: playerName.trim(),
      imagen: null,
    });

    setPlayerName("");
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
      return ["#FFD700", "#E74C3C", "#2980b9", "#27ae60"][index] || "#95a5a6";
    } else {
      // 3 jugadores: 2-4, 5-7, figuras
      return ["#f39c12", "#3498db", "#9b59b6"][index] || "#95a5a6";
    }
  };

  const getRoleLabel = (index) => {
    if (jugadores.length === 4) {
      return ["♦ Oros", "♥ Copas", "♠ Espadas", "♣ Bastos"][index] || "Sin rol";
    } else {
      return (
        ["🎴 Cartas 2-4", "🎴 Cartas 5-7", "👑 Figuras"][index] || "Sin rol"
      );
    }
  };

  const renderPlayer = (item, index) => {
    const tieneImagen = !!item.imagen;
    return (
      <View style={styles.playerCard}>
        <View style={styles.playerContent}>
          <View style={styles.playerInfo}>
            {tieneImagen ? (
              <Image source={item.imagen} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>👤</Text>
              </View>
            )}
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

  const canPlay = jugadores.length === 3 || jugadores.length === 4;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título con espaciado superior */}
        <Text style={styles.title}>JUGADORES</Text>

        {/* Input + botón añadir */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del jugador"
            placeholderTextColor="#999"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={addPlayer}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>+ AÑADIR</Text>
          </TouchableOpacity>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Moustache")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>🎭 MOUSTACHE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, !canPlay && styles.disabledButton]}
            onPress={() => {
              if (canPlay)
                navigation.navigate("Game", { numPlayers: jugadores.length });
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

        {/* Info si no hay suficientes jugadores */}
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
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No hay jugadores</Text>
              <Text style={styles.emptyStateSubtext}>
                Añade al menos 3 para empezar
              </Text>
            </View>
          ) : (
            jugadores.map((j, idx) => (
              <View key={`${j.nombre}-${idx}`}>{renderPlayer(j, idx)}</View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#f5f5f5",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
    letterSpacing: 2,
  },
  inputSection: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "500",
    borderWidth: 2,
    borderColor: "#444",
  },
  primaryButton: {
    backgroundColor: "#c0392b",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#a03028",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: "#2980b9",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2371a0",
    flex: 1,
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
    borderColor: "#6b7778",
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: "#34495e",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f39c12",
  },
  infoText: {
    color: "#ecf0f1",
    fontSize: 14,
    fontWeight: "600",
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    padding: 14,
    borderWidth: 2,
    borderColor: "#444",
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
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#444",
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#3c3c3c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  placeholderText: {
    fontSize: 24,
  },
  playerDetails: {
    flex: 1,
    gap: 6,
  },
  playerName: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "700",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  roleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  playerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  moveButton: {
    backgroundColor: "#34495e",
    borderRadius: 6,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  moveButtonText: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
  },
  deleteText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#95a5a6",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: "#7f8c8d",
    fontSize: 14,
  },
});
