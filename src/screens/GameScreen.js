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
import DiceRoller from "../components/DiceRoller";
import DiceSelectionPopup from "../components/DiceSelectionPopup";
import { usePlayers } from "../context/PlayersContext";

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
  // Dice state para el 1
  const [showDiceSelection, setShowDiceSelection] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [diceSelectedChoice, setDiceSelectedChoice] = useState(null);
  const [pendingCard, setPendingCard] = useState(null);

  // (Torombolo moved to its own screen)

  const drawCard = () => {
    if (gameOver) return;
    if (deck.length === 0 || revealedCard) return;
    const card = deck[0];
    setDeck(deck.slice(1));
    setRevealedCard(card);
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
    if (card.valor === 1) {
      // El 1 requiere el dado
      return -2; // Código especial para indicar que se necesita el dado
    }

    if (numPlayers === 3) {
      if (card.tipo === "numero") {
        if (card.valor >= 2 && card.valor <= 4) {
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

  // Función para determinar ganador del 1 basado en el dado
  function determineWinnerOf1(diceResult, selectedChoice) {
    const isEven = diceResult % 2 === 0;
    const playerWins =
      (selectedChoice === "pares" && isEven) ||
      (selectedChoice === "impares" && !isEven);

    if (numPlayers === 3) {
      // En el juego de 3 jugadores, determinar quién hizo la predicción
      // Asumimos que el jugador actual es quien hace la predicción
      // pero en un juego real, deberías tener un turno definido
      if (playerWins) {
        // El jugador que eligió correctamente se queda el 1
        // Por ahora, asignamos al jugador con menos cartas (el que predijo)
        const cardCounts = playerCards.map((c) => c.length);
        const minCount = Math.min(...cardCounts);
        const candidatos = cardCounts
          .map((count, i) => (count === minCount ? i : null))
          .filter((i) => i !== null);
        return candidatos[0];
      } else {
        // El jugador que no eligió correctamente
        // asignamos al segundo jugador con menos cartas
        const cardCounts = playerCards.map((c) => c.length);
        const sorted = cardCounts
          .map((count, i) => ({ count, i }))
          .sort((a, b) => a.count - b.count);
        return sorted.length > 1 ? sorted[1].i : sorted[0].i;
      }
    } else {
      // 4 jugadores
      if (playerWins) {
        return Math.floor(Math.random() * 2); // Uno de los dos primeros
      } else {
        return Math.floor(Math.random() * 2) + 2; // Uno de los dos últimos
      }
    }
  }

  const placeRevealedCard = () => {
    if (gameOver) return;
    if (!revealedCard) return;

    // Si es un 1, mostrar el popup de selección
    if (revealedCard.valor === 1) {
      setPendingCard(revealedCard);
      setShowDiceSelection(true);
      return;
    }

    const playerIndex = getPlayerIndex(revealedCard);
    if (playerIndex === -1) return;
    const newPlayerCards = playerCards.map((arr, i) =>
      i === playerIndex ? [...arr, revealedCard] : arr,
    );
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

  const handleDiceSelection = (choice) => {
    setDiceSelectedChoice(choice);
    // El dado se lanzará automáticamente después de seleccionar
    setTimeout(() => {
      setShowDiceSelection(false);
      setShowDiceRoller(true);
    }, 800);
  };

  // Determina el otro jugador que se enfrenta por el 1
  const getOpponentIndex = () => {
    const cardCounts = playerCards.map((c) => c.length);
    const sorted = cardCounts
      .map((count, i) => ({ count, i }))
      .sort((a, b) => a.count - b.count);
    // Retorna el segundo con menos cartas (contrincante del que eligió)
    return sorted.length > 1
      ? sorted[1].i
      : sorted.length > 0
        ? sorted[0].i
        : 0;
  };

  const handleDiceRollComplete = (diceResult, selectedChoice) => {
    if (!pendingCard) return;

    // Determinar quién gana el 1
    const winnerIndex = determineWinnerOf1(diceResult, selectedChoice);
    const newPlayerCards = playerCards.map((arr, i) =>
      i === winnerIndex ? [...arr, pendingCard] : arr,
    );
    setPlayerCards(newPlayerCards);
    checkFinalPhase(newPlayerCards);

    // Resetear todo
    setRevealedCard(null);
    setShowDiceRoller(false);
    setDiceSelectedChoice(null);
    setPendingCard(null);
  };

  const tutorialContent = `Reglas del juego:\n\n• Cartas 1-7: Números\n  - 1: ¡Especial! Se lanza un dado\n    • Elige PARES o IMPARES\n    • El que acierte se queda el 1\n  - 2-4: Jugador izquierda\n  - 5-7: Jugador derecha\n\n• Cartas 10-12: Figuras\n  - Van al jugador derecha\n\n• El juego termina cuando un jugador alcanza el límite.\n\n• Si dos jugadores alcanzan el límite:\n  - El que tenga menos cartas pierde\n  - Si empatan, el límite sube +1`;

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
    const rotateValue = typeof rotate === "string" ? rotate : "0deg";
    return (
      <View
        style={[
          styles.playerBox,
          style,
          { transform: [{ rotate: rotateValue }] },
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
            key={`${card.palo}-${card.valor}-${i}`}
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
          <TouchableOpacity
            style={[
              styles.backButton,
              { top: 120, backgroundColor: "#FF6B35" },
            ]}
            onPress={() => {
              setPendingCard({ valor: 1, palo: "test" });
              setShowDiceSelection(true);
            }}
          >
            <Text style={styles.backButtonText}>Test Dado</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Popup de confirmación para finalizar partida */}
      {showFinishConfirm && (
        <View style={styles.endOverlay}>
          <View style={styles.endContainer}>
            <Text style={styles.endTitle}>¿Finalizar partida?</Text>
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
        <View key={player.id || idx}>
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

      {/* Popup de selección pares/impares */}
      <DiceSelectionPopup
        visible={showDiceSelection}
        player1={players[0]}
        player2={players[getOpponentIndex()]}
        playerImage1={players[0]?.imagen}
        playerImage2={players[getOpponentIndex()]?.imagen}
        onSelect={handleDiceSelection}
      />

      {/* Componente del dado */}
      {showDiceRoller && (
        <View style={styles.diceRollerOverlay}>
          <DiceRoller
            onRollComplete={handleDiceRollComplete}
            selectedChoice={diceSelectedChoice}
            player1={players[0]}
            player2={players[getOpponentIndex()]}
            image1={players[0]?.imagen}
            image2={players[getOpponentIndex()]?.imagen}
          />
        </View>
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
                <View key={i} style={[styles.endPlayerRow]}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
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
                    <View
                      style={{
                        marginLeft: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#FF6B35",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        👎
                      </Text>
                      <Text
                        style={{
                          color: "#FF6B35",
                          fontWeight: "bold",
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        Perdedor
                      </Text>
                    </View>
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
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  endContainer: {
    alignItems: "center",
    backgroundColor: "rgba(20,20,20,0.98)",
    borderRadius: 20,
    padding: 32,
    borderWidth: 3,
    borderColor: "#FF6B35",
    maxWidth: 420,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  endTitle: {
    color: "#FF6B35",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 28,
    textAlign: "center",
    letterSpacing: 1,
  },
  endPlayersList: {
    width: "100%",
    marginBottom: 28,
    backgroundColor: "rgba(255,107,53,0.08)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.3)",
  },
  endPlayerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,107,53,0.2)",
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
  btn: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  diceRollerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
