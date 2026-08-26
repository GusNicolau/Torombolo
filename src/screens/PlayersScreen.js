import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usePlayers } from "../context/PlayersContext";

const ROW_GAP = 12;
const FALLBACK_ROW_HEIGHT = 94;
const FONDO = require("../../assets/images/Inicio5.png");

const AVATARES = [
  require("../../assets/moustache/ale.png"),
  require("../../assets/moustache/andreu.png"),
  require("../../assets/moustache/carlos.png"),
  require("../../assets/moustache/dani.png"),
  require("../../assets/moustache/gustavo.png"),
  require("../../assets/moustache/mario.png"),
  require("../../assets/moustache/lara.png"),
  require("../../assets/avatares/Avatar1.png"),
  require("../../assets/avatares/Avatar2.png"),
  require("../../assets/avatares/Avatar3.png"),
  require("../../assets/avatares/Avatar4.png"),
  require("../../assets/avatares/Avatar5.png"),
  require("../../assets/avatares/Avatar6.png"),
  require("../../assets/avatares/Avatar7.png"),
  require("../../assets/avatares/Avatar8.png"),
];

export default function PlayersScreen({ navigation }) {
  const [playerName, setPlayerName] = useState("");
  const { jugadores, addJugador, removeJugador, reorderJugadores } =
    usePlayers();

  // Estado para edición de nombre
  const [editingName, setEditingName] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Estado para edición de avatar
  const [editingAvatar, setEditingAvatar] = useState(null);

  // Estado para arrastrar y reordenar jugadores
  const [draggingIndex, setDraggingIndex] = useState(null);
  const dragY = useRef(new Animated.Value(0)).current;
  const dragStateRef = useRef({ fromIndex: null, targetIndex: null });
  const shiftAnimsRef = useRef({});
  const rowHeightRef = useRef(FALLBACK_ROW_HEIGHT);

  const getShiftAnim = (index) => {
    if (!shiftAnimsRef.current[index]) {
      shiftAnimsRef.current[index] = new Animated.Value(0);
    }
    return shiftAnimsRef.current[index];
  };

  const resetShifts = () => {
    Object.values(shiftAnimsRef.current).forEach((anim) => anim.setValue(0));
  };

  const finishDrag = () => {
    const { fromIndex, targetIndex } = dragStateRef.current;
    const rowHeight = rowHeightRef.current;
    const snapOffset =
      fromIndex !== null && targetIndex !== null
        ? (targetIndex - fromIndex) * rowHeight
        : 0;
    Animated.timing(dragY, {
      toValue: snapOffset,
      duration: 140,
      useNativeDriver: true,
    }).start(() => {
      setDraggingIndex(null);
      dragY.setValue(0);
      resetShifts();
      if (
        fromIndex !== null &&
        targetIndex !== null &&
        fromIndex !== targetIndex
      ) {
        reorderJugadores(fromIndex, targetIndex);
      }
      dragStateRef.current = { fromIndex: null, targetIndex: null };
    });
  };

  const createRowPanResponder = (index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 2,
      onPanResponderGrant: () => {
        dragStateRef.current = { fromIndex: index, targetIndex: index };
        dragY.setValue(0);
        setDraggingIndex(index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
      onPanResponderMove: (_, gesture) => {
        dragY.setValue(gesture.dy);
        const rowHeight = rowHeightRef.current;
        const newTarget = Math.min(
          Math.max(index + Math.round(gesture.dy / rowHeight), 0),
          jugadores.length - 1,
        );
        if (newTarget !== dragStateRef.current.targetIndex) {
          dragStateRef.current.targetIndex = newTarget;
          for (let i = 0; i < jugadores.length; i++) {
            if (i === index) continue;
            let shift = 0;
            if (index < newTarget && i > index && i <= newTarget) shift = -1;
            else if (index > newTarget && i < index && i >= newTarget)
              shift = 1;
            Animated.spring(getShiftAnim(i), {
              toValue: shift * rowHeight,
              useNativeDriver: true,
              friction: 8,
              tension: 60,
            }).start();
          }
        }
      },
      onPanResponderRelease: finishDrag,
      onPanResponderTerminate: finishDrag,
    });

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
    const usados = jugadores.map((j) => j.imagen);
    const disponibles = AVATARES.filter((a) => !usados.includes(a));
    let randomAvatar;
    if (disponibles.length > 0) {
      randomAvatar =
        disponibles[Math.floor(Math.random() * disponibles.length)];
    } else {
      randomAvatar = AVATARES[Math.floor(Math.random() * AVATARES.length)];
    }
    addJugador({ nombre: playerName.trim(), imagen: randomAvatar });
    setPlayerName("");
    maxAlertShown = false;
  };

  // Edición de nombre
  const confirmEdit = (oldName) => {
    const trimmed = editingValue.trim();
    if (trimmed === "" || trimmed === oldName) {
      setEditingName(null);
      return;
    }
    if (jugadores.some((j) => j.nombre === trimmed)) {
      Alert.alert("Nombre repetido", "Ya existe un jugador con ese nombre.");
      return;
    }
    const jugador = jugadores.find((j) => j.nombre === oldName);
    removeJugador(oldName);
    addJugador({ ...jugador, nombre: trimmed });
    setEditingName(null);
  };

  // Edición de avatar
  const confirmAvatarChange = (jugadorNombre, newImagen) => {
    const jugador = jugadores.find((j) => j.nombre === jugadorNombre);
    if (!jugador) return;
    removeJugador(jugadorNombre);
    addJugador({ ...jugador, imagen: newImagen });
    setEditingAvatar(null);
  };

  const getRoleColor = (index) => {
    if (jugadores.length === 4) {
      return ["#fcb33f", "#40b1b9", "#9b59b6", "#b6ec23"][index] || "#95a5a6";
    } else {
      return ["#fcb33f", "#40b1b9", "#9b59b6"][index] || "#95a5a6";
    }
  };

  const getRoleLabel = (index) => {
    if (jugadores.length === 4) {
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
    const avatarSource = item.imagen || AVATARES[0];
    const isEditingThisName = editingName === item.nombre;
    const isDragging = draggingIndex === index;
    const panResponder = createRowPanResponder(index);
    const translateY = isDragging ? dragY : getShiftAnim(index);

    return (
      <Animated.View
        onLayout={(e) => {
          rowHeightRef.current = e.nativeEvent.layout.height + ROW_GAP;
        }}
        style={[
          { transform: [{ translateY }] },
          isDragging && styles.playerCardWrapperDragging,
        ]}
      >
        <View
          style={[styles.playerCard, isDragging && styles.playerCardDragging]}
        >
          <View
            style={[styles.roleAccent, { backgroundColor: getRoleColor(index) }]}
          />
          <View style={styles.playerContent}>
          <View style={styles.playerInfo}>
            {/* Avatar editable */}
            <TouchableOpacity
              onPress={() => setEditingAvatar(item.nombre)}
              style={styles.avatarWrapper}
            >
              <Image source={avatarSource} style={styles.avatar} />
              <View style={styles.avatarEditBadge}>
                <Text style={styles.avatarEditBadgeText}>✏️</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.playerDetails}>
              {/* Nombre editable */}
              {isEditingThisName ? (
                <TextInput
                  style={styles.playerNameInput}
                  value={editingValue}
                  onChangeText={setEditingValue}
                  onBlur={() => confirmEdit(item.nombre)}
                  onSubmitEditing={() => confirmEdit(item.nombre)}
                  autoFocus
                  maxLength={20}
                  selectTextOnFocus
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setEditingName(item.nombre);
                    setEditingValue(item.nombre);
                  }}
                >
                  <Text
                    style={styles.playerName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.roleBadge}>
                <View
                  style={[
                    styles.roleDot,
                    { backgroundColor: getRoleColor(index) },
                  ]}
                />
                <Text
                  style={styles.roleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {getRoleLabel(index)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.playerActions}>
            <View style={styles.dragHandle} {...panResponder.panHandlers}>
              <Text style={styles.dragHandleText}>⠿</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeJugador(item.nombre)}
            >
              <Text style={styles.deleteText}>✖</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const canPlay = jugadores.length >= 3 && jugadores.length <= 4;

  return (
    <ImageBackground
      source={FONDO}
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
          scrollEnabled={draggingIndex === null}
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
              style={[
                styles.primaryButton,
                { flex: 1 },
                !canPlay && styles.disabledButton,
              ]}
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
              <Text
                style={styles.primaryButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                ▶ JUGAR{" "}
                {jugadores.length < 3
                  ? `(${jugadores.length}/3)`
                  : jugadores.length > 4
                    ? "(máx 4)"
                    : ""}
              </Text>
            </TouchableOpacity>
          </View>

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
              <View style={styles.emptyState} />
            ) : (
              jugadores.map((j, idx) => (
                <View key={`${j.nombre}-${idx}`}>{renderPlayer(j, idx)}</View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Modal de selección de avatar */}
        {editingAvatar && (
          <View style={styles.avatarModalOverlay}>
            <View style={styles.avatarModal}>
              <Text style={styles.avatarModalTitle}>Cambiar avatar</Text>
              <Text style={styles.avatarModalSubtitle}>
                {jugadores.find((j) => j.nombre === editingAvatar)?.nombre}
              </Text>
              <FlatList
                data={AVATARES}
                keyExtractor={(_, i) => String(i)}
                numColumns={4}
                contentContainerStyle={styles.avatarGrid}
                renderItem={({ item }) => {
                  const currentImagen = jugadores.find(
                    (j) => j.nombre === editingAvatar,
                  )?.imagen;
                  const isSelected = currentImagen === item;
                  return (
                    <TouchableOpacity
                      onPress={() => confirmAvatarChange(editingAvatar, item)}
                      style={[
                        styles.avatarOption,
                        isSelected && styles.avatarOptionSelected,
                      ]}
                    >
                      <Image source={item} style={styles.avatarOptionImage} />
                      {isSelected && (
                        <View style={styles.avatarOptionCheck}>
                          <Text style={styles.avatarOptionCheckText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                style={styles.avatarModalClose}
                onPress={() => setEditingAvatar(null)}
              >
                <Text style={styles.avatarModalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: "#2a1c14",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#d4a04c",
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
    backgroundColor: "rgba(20,14,10,0.86)",
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
    backgroundColor: "#1c130d",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "700",
    borderWidth: 2,
    borderColor: "#d4a04c",
    fontFamily: "monospace",
    letterSpacing: 1,
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: "#2a1c14",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
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
    backgroundColor: "#2a1c14",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4a04c",
    flex: 1,
    shadowColor: "#d4a04c",
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
    color: "#d4a04c",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: "#2a1c14",
    borderRadius: 14,
    padding: 10,
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: "#8a6a3a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  roleAccent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
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
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#888",
    borderWidth: 3,
    borderColor: "#d4a04c",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2a1c14",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4a04c",
  },
  avatarEditBadgeText: {
    fontSize: 10,
  },
  playerDetails: {
    flex: 1,
    gap: 6,
  },
  playerName: {
    color: "#f3e6d3",
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "serif",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playerNameInput: {
    color: "#f3e6d3",
    fontSize: 19,
    fontWeight: "700",
    fontFamily: "serif",
    borderBottomWidth: 2,
    borderBottomColor: "#d4a04c",
    paddingVertical: 2,
    minWidth: 120,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    maxWidth: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(212,160,76,0.4)",
    marginTop: 2,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleText: {
    color: "#e8d5b7",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
    flexShrink: 1,
  },
  playerActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dragHandle: {
    backgroundColor: "#2a1c14",
    borderRadius: 8,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  dragHandleText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playerCardWrapperDragging: {
    zIndex: 10,
  },
  playerCardDragging: {
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    transform: [{ scale: 1.03 }],
  },
  deleteButton: {
    backgroundColor: "#2a1c14",
    borderRadius: 8,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#000",
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

  // Modal de avatar
  avatarModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  avatarModal: {
    backgroundColor: "#2a1c14",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    borderWidth: 2,
    borderColor: "#d4a04c",
    maxHeight: "70%",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatarModalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1,
  },
  avatarModalSubtitle: {
    color: "#d4a04c",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 16,
  },
  avatarGrid: {
    alignItems: "center",
    paddingBottom: 10,
  },
  avatarOption: {
    margin: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    overflow: "visible",
    position: "relative",
  },
  avatarOptionSelected: {
    borderColor: "#d4a04c",
    transform: [{ scale: 1.1 }],
  },
  avatarOptionImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
  },
  avatarOptionCheck: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#d4a04c",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOptionCheckText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
  avatarModalClose: {
    marginTop: 16,
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#555",
  },
  avatarModalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
});
