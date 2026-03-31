import { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayers } from "../context/PlayersContext";
import { playSound } from "../soundManager";

const CARTAS = {
  // Bastos
  "1Bastos": require("../../assets/cartas/1Bastos.png"),
  "2Bastos": require("../../assets/cartas/2Bastos.png"),
  "3Bastos": require("../../assets/cartas/3Bastos.png"),
  "4Bastos": require("../../assets/cartas/4Bastos.png"),
  "5Bastos": require("../../assets/cartas/5Bastos.png"),
  "6Bastos": require("../../assets/cartas/6Bastos.png"),
  "7Bastos": require("../../assets/cartas/7Bastos.png"),
  "10Bastos": require("../../assets/cartas/10Bastos.png"),
  "11Bastos": require("../../assets/cartas/11Bastos.png"),
  "12Bastos": require("../../assets/cartas/12Bastos.png"),
  // Copas
  "1Copas": require("../../assets/cartas/1Copas.png"),
  "2Copas": require("../../assets/cartas/2Copas.png"),
  "3Copas": require("../../assets/cartas/3Copas.png"),
  "4Copas": require("../../assets/cartas/4Copas.png"),
  "5Copas": require("../../assets/cartas/5Copas.png"),
  "6Copas": require("../../assets/cartas/6Copas.png"),
  "7Copas": require("../../assets/cartas/7Copas.png"),
  "10Copas": require("../../assets/cartas/10Copas.png"),
  "11Copas": require("../../assets/cartas/11Copas.png"),
  "12Copas": require("../../assets/cartas/12Copas.png"),
  // Espadas
  "1Espadas": require("../../assets/cartas/1Espadas.png"),
  "2Espadas": require("../../assets/cartas/2Espadas.png"),
  "3Espadas": require("../../assets/cartas/3Espadas.png"),
  "4Espadas": require("../../assets/cartas/4Espadas.png"),
  "5Espadas": require("../../assets/cartas/5Espadas.png"),
  "6Espadas": require("../../assets/cartas/6Espadas.png"),
  "7Espadas": require("../../assets/cartas/7Espadas.png"),
  "10Espadas": require("../../assets/cartas/10Espadas.png"),
  "11Espadas": require("../../assets/cartas/11Espadas.png"),
  "12Espadas": require("../../assets/cartas/12Espadas.png"),
  // Oros
  "1Oros": require("../../assets/cartas/1Oros.png"),
  "2Oros": require("../../assets/cartas/2Oros.png"),
  "3Oros": require("../../assets/cartas/3Oros.png"),
  "4Oros": require("../../assets/cartas/4Oros.png"),
  "5Oros": require("../../assets/cartas/5Oros.png"),
  "6Oros": require("../../assets/cartas/6Oros.png"),
  "7Oros": require("../../assets/cartas/7Oros.png"),
  "10Oros": require("../../assets/cartas/10Oros.png"),
  "11Oros": require("../../assets/cartas/11Oros.png"),
  "12Oros": require("../../assets/cartas/12Oros.png"),
};

const REVERSO = require("../../assets/cartas/reverso.jpg");
const TAPETE = require("../../assets/tapete/Tapete2.png");
const PALOS = ["Bastos", "Copas", "Espadas", "Oros"];

function crearBaraja() {
  const baraja = [];
  PALOS.forEach((palo) => {
    for (let valor = 1; valor <= 12; valor++) {
      if (valor === 8 || valor === 9) continue;
      const key = `${valor}${palo}`;
      baraja.push({
        valor,
        palo,
        tipo: valor <= 7 ? "numero" : "figura",
        imagen: CARTAS[key],
      });
    }
  });
  return baraja.sort(() => Math.random() - 0.5);
}

export default function GameScreen({ navigation, route }) {
  const { jugadores } = usePlayers();
  const numPlayers = route?.params?.numPlayers || 3;
  const players = jugadores.slice(0, numPlayers);

  const [deck, setDeck] = useState(crearBaraja());
  const [playerCards, setPlayerCards] = useState(Array(numPlayers).fill([]));
  const [revealedCard, setRevealedCard] = useState(null); // carta en grande
  const scaleAnim = useState(new Animated.Value(1))[0];
  // Final-phase state
  const [limit, setLimit] = useState(numPlayers === 4 ? 7 : 9);
  const [gameOver, setGameOver] = useState(false);
  const [finalCounts, setFinalCounts] = useState(null);
  const [loserIndex, setLoserIndex] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialFadeAnim = useState(new Animated.Value(0))[0];
  // Confirm finish popup
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // (Torombolo moved to its own screen)

  const drawCard = () => {
    if (gameOver) return;
    if (deck.length === 0 || revealedCard) return;
    const card = deck[0];
    setDeck(deck.slice(1));
    setRevealedCard(card);
    playSound("carta");
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Decide a qué jugador se asigna la carta
  function getPlayerIndex(card) {
    if (numPlayers === 3) {
      if (card.tipo === "numero") {
        if (card.valor === 1) {
          // Jugador con menos cartas
          const cardCounts = playerCards.map((c) => c.length);
          const minCount = Math.min(...cardCounts);
          const candidatos = cardCounts
            .map((count, i) => (count === minCount ? i : null))
            .filter((i) => i !== null);
          return candidatos[Math.floor(Math.random() * candidatos.length)];
        } else if (card.valor >= 2 && card.valor <= 4) {
          return 0;
        } else if (card.valor >= 5 && card.valor <= 7) {
          return 1;
        } else {
          return 2;
        }
      } else {
        return 2; // figuras
      }
    } else {
      // 4 jugadores: por palo
      return ["Oros", "Copas", "Espadas", "Bastos"].indexOf(card.palo);
    }
  }

  const placeRevealedCard = () => {
    if (gameOver) return;
    if (!revealedCard) return;
    const playerIndex = getPlayerIndex(revealedCard);
    if (playerIndex === -1) return;
    const newPlayerCards = playerCards.map((arr, i) =>
      i === playerIndex ? [...arr, revealedCard] : arr,
    );
    if (revealedCard.valor === 1) {
      playSound("toast");
    }
    setPlayerCards(newPlayerCards);
    checkFinalPhase(newPlayerCards);
    setRevealedCard(null);
  };

  // Comprueba la fase final según el límite actual
  const checkFinalPhase = (countsArray) => {
    const counts = countsArray.map((c) => c.length);
    // Encuentra índices que alcanzaron o superaron el límite
    const alcanzaron = counts
      .map((c, i) => (c >= limit ? i : null))
      .filter((i) => i !== null);
    // Si la baraja se queda sin cartas, determinar perdedor por menor cantidad
    if (deck.length === 0) {
      const min = Math.min(...counts);
      const losers = counts
        .map((count, idx) => ({ count, idx }))
        .filter((obj) => obj.count === min);
      setLoserIndex(losers[0].idx);
      setGameOver(true);
      setFinalCounts(counts);
      return;
    }
    if (alcanzaron.length === 0) return;
    // Lógica de perdedor: el que menos cartas tiene
    const min = Math.min(...counts);
    const losers = counts
      .map((count, idx) => ({ count, idx }))
      .filter((obj) => obj.count === min);
    if (losers.length === 1) {
      setLoserIndex(losers[0].idx);
      setGameOver(true);
      setFinalCounts(counts);
    } else {
      setLimit((l) => l + 1);
      setFinalCounts(counts);
    }
  };

  const showTutorialPopup = () => {
    setShowTutorial(true);
    tutorialFadeAnim.setValue(0);
    Animated.timing(tutorialFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeTutorialPopup = () => {
    Animated.timing(tutorialFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTutorial(false));
  };

  const tutorialContent = `Reglas del juego:\n\n• Cartas 1-7: Números\n  - 1: Va al jugador con menos cartas\n  - 2-4: Jugador izquierda\n  - 5-7: Jugador derecha\n\n• Cartas 10-12: Figuras\n  - Van al jugador derecha\n\n• El juego termina cuando un jugador alcanza el límite.\n\n• Si dos jugadores alcanzan el límite:\n  - El que tenga menos cartas pierde\n  - Si empatan, el límite sube +1`;

  const { width, height } = Dimensions.get("window");
  // Posiciones para 3 y 4 jugadores
  const playerPositions =
    numPlayers === 4
      ? [
          { left: -30, top: height / 2 - 110, rotate: "90deg" },
          { left: width / 2 - 120, top: 120, rotate: "0deg" },
          { right: -30, top: height / 2 - 120, rotate: "270deg" },
          { left: width / 2 - 120, bottom: 260, rotate: "0deg" }, // 4º jugador abajo centrado
        ]
      : [
          { left: -30, top: height / 2 - 70, rotate: "90deg" },
          { left: width / 2 - 120, top: 120, rotate: "0deg" },
          { right: -30, top: height / 2 - 150, rotate: "270deg" },
        ];

  const renderPlayer = (player, cards, style, rotate = "0deg") => {
    if (!player) return null;
    return (
      <View
        style={[
          styles.playerBox,
          style,
          { transform: [{ rotate: style.rotate || "0deg" }] },
        ]}
      >
        <View style={styles.playerHeader}>
          <Image source={player.imagen} style={styles.avatar} />
          <View style={styles.playerInfoBox}>
            <Text style={styles.playerName}>{player.nombre}</Text>
            <Text style={styles.cardCounter}>
              {cards.length} / {limit}
            </Text>
          </View>
        </View>
        {renderCards(cards)}
      </View>
    );
  };

  const renderCards = (cards) => (
    <View style={styles.cardsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cards.map((card, i) => (
          <Image
            key={i}
            source={card.imagen}
            style={[styles.cardImage, i !== 0 && { marginLeft: -35 }]}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ImageBackground
      source={TAPETE}
      style={[styles.container, { width: "100%", height: "100%" }]}
      imageStyle={{ resizeMode: "cover", width: "100%", height: "100%" }}
    >
      {!revealedCard && !gameOver && !showFinishConfirm && (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowFinishConfirm(true)}
          >
            <Text style={styles.backButtonText}>Finalizar juego</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tutorialBtn}
            onPress={showTutorialPopup}
          >
            <Text style={styles.tutorialBtnText}>?</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Popup de confirmación para finalizar partida */}
      {showFinishConfirm && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Finalizar partida?</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 18,
              }}
            >
              <TouchableOpacity
                style={[styles.btn, { marginHorizontal: 8 }]}
                onPress={() => {
                  setShowFinishConfirm(false);
                  navigation.navigate("Menu");
                }}
              >
                <Text style={styles.btnText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  { marginHorizontal: 8, backgroundColor: "#555" },
                ]}
                onPress={() => setShowFinishConfirm(false)}
              >
                <Text style={styles.btnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {players.map((player, idx) => (
        <View key={idx}>
          {renderPlayer(
            player,
            playerCards[idx],
            playerPositions[idx] || {},
            playerPositions[idx]?.rotate || "0deg",
          )}
        </View>
      ))}

      {/* Mazo / reverso */}
      <View style={[styles.deckWrapper]}>
        {!revealedCard && deck.length > 0 && (
          <TouchableOpacity onPress={drawCard} activeOpacity={0.85}>
            <Animated.Image
              source={REVERSO}
              style={[styles.deckImage, { transform: [{ scale: scaleAnim }] }]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Carta revelada */}
      {revealedCard && (
        <TouchableOpacity
          style={styles.revealedOverlay}
          onPress={placeRevealedCard}
          activeOpacity={0.9}
        >
          <Animated.Image
            source={revealedCard.imagen}
            style={[styles.revealedCard, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>
      )}

      {/* Overlay de fin de partida */}
      {gameOver && finalCounts && (
        <View style={styles.endOverlay}>
          <View
            style={[
              styles.endContainer,
              { maxWidth: 400, width: "90%", alignSelf: "center", padding: 20 },
            ]}
          >
            <Text style={styles.endTitle}>Fin de la partida</Text>
            <View
              style={[styles.endPlayersList, { padding: 8, marginBottom: 16 }]}
            >
              {players.map((p, i) => (
                <View
                  key={i}
                  style={[styles.endPlayerRow, { paddingVertical: 8 }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={
                        p?.imagen || require("../../assets/moustache/ale.png")
                      }
                      style={[
                        styles.endPlayerAvatar,
                        {
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        },
                      ]}
                    />
                    <View style={styles.endPlayerInfo}>
                      <Text style={[styles.endPlayerName, { fontSize: 14 }]}>
                        {p ? p.nombre : `Jugador ${i + 1}`}
                      </Text>
                      <Text style={[styles.endPlayerCards, { fontSize: 12 }]}>
                        {finalCounts[i]} cartas
                      </Text>
                    </View>
                  </View>
                  {i === loserIndex && (
                    <Text
                      style={{
                        color: "#FF6B35",
                        fontWeight: "bold",
                        marginLeft: 8,
                        fontSize: 14,
                      }}
                    >
                      👎 Perdedor
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.btn, { marginTop: 8, alignSelf: "center" }]}
              onPress={() => navigation.navigate("Torombolo", { loserIndex })}
            >
              <Text style={styles.btnText}>Torombolo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Torombolo moved to separate screen; any summary handled there */}
      {showTutorial && (
        <View style={styles.tutorialOverlay}>
          <Animated.View
            style={[styles.tutorialPopup, { opacity: tutorialFadeAnim }]}
          >
            <TouchableOpacity
              style={styles.tutorialClose}
              onPress={closeTutorialPopup}
            >
              <Text style={styles.tutorialCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.tutorialTitle}>Tutorial</Text>
            <Text style={styles.tutorialText}>{tutorialContent}</Text>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tutorialBtn: {
    position: "absolute",
    top: 56,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  tutorialBtnText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 56,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 100,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  playerInfoBox: {
    marginLeft: 12,
    alignItems: "flex-start",
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  cardCounter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  cardImage: { width: 50, height: 80, borderRadius: 5 },
  cardsContainer: {
    width: 250, // espacio para la fila
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "flex-start", // clave: que la fila quede alineada a la izquierda
    alignItems: "center",
  },
  playerBox: {
    position: "absolute",
    alignItems: "center",
  },
  deckWrapper: {
    position: "absolute",
    left: Dimensions.get("window").width / 2 - 120, // centrado
    width: 240, // más ancho
    height: 250, // mitad de la altura real
    overflow: "hidden", // solo se ve la parte que cabe
    alignItems: "center",
    bottom: 0, // lo colocamos un poco arriba del borde
  },
  deckImage: {
    width: 240, // más ancho que las cartas normales
    height: 370, // altura completa de la carta
    borderRadius: 10,
    marginTop: 0, // mover la carta hacia arriba para que solo se vea la mitad
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 0,
    borderWidth: 3,
    borderColor: "#fff",
  },
  revealedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "120%",
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  revealedCard: { width: 240, height: 370, borderRadius: 12 },
  endOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  endContainer: {
    alignItems: "center",
    backgroundColor: "rgba(30,30,30,0.95)",
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    maxWidth: "90%",
  },
  endTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  endPlayersList: {
    width: "100%",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 10,
    padding: 16,
  },
  endPlayerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  endPlayerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FF6B35",
    marginRight: 14,
  },
  endPlayerInfo: {
    flex: 1,
  },
  endPlayerName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  endPlayerCards: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  // ...estilos de endButton eliminados, se usa styles.btn y styles.btnText
  tOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  tInfo: { color: "#fff", fontSize: 16 },
  tButtonsRow: { flexDirection: "row", marginTop: 12 },
  tButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  tButton: {
    backgroundColor: "#2980b9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 6,
    marginVertical: 6,
  },
  tButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  tCard: { width: 120, height: 180, borderRadius: 8, marginTop: 8 },
  tCardSmall: { width: 60, height: 96, borderRadius: 6, marginRight: 8 },
  tLabel: { color: "#fff", marginTop: 8 },
  tStats: { color: "#fff", fontSize: 14 },
  tDiscardPile: {
    width: 220,
    height: 140,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tDiscardCard: {
    position: "absolute",
    width: 140,
    height: 210,
    borderRadius: 8,
    opacity: 0.95,
  },
  tRevealedCard: { width: 180, height: 270, borderRadius: 10, marginTop: 8 },
  tutorialOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
  },
  tutorialPopup: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
    width: "85%",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tutorialClose: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialCloseText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  tutorialTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  tutorialText: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 20,
  },
});
