import { useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayers } from "../context/PlayersContext";
// dimensions available if needed

const CARTAS = {
  "1Bastos": require("../../assets/cartas/1Bastos.jpeg"),
  "2Bastos": require("../../assets/cartas/2Bastos.jpeg"),
  "3Bastos": require("../../assets/cartas/3Bastos.jpeg"),
  "4Bastos": require("../../assets/cartas/4Bastos.jpeg"),
  "5Bastos": require("../../assets/cartas/5Bastos.jpeg"),
  "6Bastos": require("../../assets/cartas/6Bastos.jpeg"),
  "7Bastos": require("../../assets/cartas/7Bastos.jpeg"),
  "10Bastos": require("../../assets/cartas/10Bastos.jpeg"),
  "11Bastos": require("../../assets/cartas/11Bastos.png"),
  "12Bastos": require("../../assets/cartas/12Bastos.png"),
  "1Copas": require("../../assets/cartas/1Copas.jpeg"),
  "2Copas": require("../../assets/cartas/2Copas.jpeg"),
  "3Copas": require("../../assets/cartas/3Copas.jpeg"),
  "4Copas": require("../../assets/cartas/4Copas.jpeg"),
  "5Copas": require("../../assets/cartas/5Copas.jpeg"),
  "6Copas": require("../../assets/cartas/6Copas.jpeg"),
  "7Copas": require("../../assets/cartas/7Copas.jpeg"),
  "10Copas": require("../../assets/cartas/10Copas.jpeg"),
  "11Copas": require("../../assets/cartas/11Copas.png"),
  "12Copas": require("../../assets/cartas/12Copas.png"),
  "1Espadas": require("../../assets/cartas/1Espadas.jpeg"),
  "2Espadas": require("../../assets/cartas/2Espadas.jpeg"),
  "3Espadas": require("../../assets/cartas/3Espadas.jpeg"),
  "4Espadas": require("../../assets/cartas/4Espadas.jpeg"),
  "5Espadas": require("../../assets/cartas/5Espadas.jpeg"),
  "6Espadas": require("../../assets/cartas/6Espadas.jpeg"),
  "7Espadas": require("../../assets/cartas/7Espadas.jpeg"),
  "10Espadas": require("../../assets/cartas/10Espadas.jpeg"),
  "11Espadas": require("../../assets/cartas/11Espadas.png"),
  "12Espadas": require("../../assets/cartas/12Espadas.png"),
  "1Oros": require("../../assets/cartas/1Oros.jpeg"),
  "2Oros": require("../../assets/cartas/2Oros.jpeg"),
  "3Oros": require("../../assets/cartas/3Oros.jpeg"),
  "4Oros": require("../../assets/cartas/4Oros.jpeg"),
  "5Oros": require("../../assets/cartas/5Oros.jpeg"),
  "6Oros": require("../../assets/cartas/6Oros.jpeg"),
  "7Oros": require("../../assets/cartas/7Oros.jpeg"),
  "10Oros": require("../../assets/cartas/10Oros.jpeg"),
  "11Oros": require("../../assets/cartas/11Oros.png"),
  "12Oros": require("../../assets/cartas/12Oros.png"),
};

const PALOS = ["Bastos", "Copas", "Espadas", "Oros"];
const TAPETE = require("../../assets/tapete/Tapete2.png");
const CERVEZA = require("../../assets/bebidas/Cerves.png");

const BEBIDAS = [
  require("../../assets/bebidas/Bebida1.png"),
  require("../../assets/bebidas/Bebida2.png"),
  require("../../assets/bebidas/Bebida3.png"),
  require("../../assets/bebidas/Bebida4.png"),
  require("../../assets/bebidas/Bebida5.png"),
  require("../../assets/bebidas/Bebida6.png"),
  require("../../assets/bebidas/Bebida7.png"),
  require("../../assets/bebidas/Bebida8.png"),
  require("../../assets/bebidas/Bebida9.png"),
  require("../../assets/bebidas/Bebida10.png"),
  require("../../assets/bebidas/Bebida11.png"),
  require("../../assets/bebidas/Bebida12.png"),
  require("../../assets/bebidas/Bebida13.png"),
];

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

export default function ToromboloScreen({ navigation, route }) {
  const { jugadores } = usePlayers();
  const loserIndex = route?.params?.loserIndex ?? 0;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(loserIndex);
  const loser = jugadores[currentPlayerIndex];

  // Minigame state
  const [tDeck, setTDeck] = useState(crearBaraja());
  const [tCards, setTCards] = useState([]); // historial de cartas reveladas recientes
  const [tDiscarded, setTDiscarded] = useState([]); // monton en tapete (visualmente acumulado)
  const [tStep, setTStep] = useState(1); // 1..4 pruebas
  const [tSuccesses, setTSuccesses] = useState([]);
  const [tFailures, setTFailures] = useState(0);
  const [tDrinks, setTDrinks] = useState(0);
  const [tTotalPassed, setTTotalPassed] = useState(0);
  const [tFinished, setTFinished] = useState(false);
  const [tRevealedCount, setTRevealedCount] = useState(0);

  // Draw a card from tDeck; if empty, reshuffle
  const drawTCard = () => {
    let local = tDeck;
    if (!local || local.length === 0) {
      local = crearBaraja();
    }
    const card = local[0];
    setTDeck(local.slice(1));
    setTCards((prev) => [card, ...prev].slice(0, 5));
    setTRevealedCount((n) => n + 1);

    const entry = {
      ...card,
      _id: Date.now() + Math.floor(Math.random() * 10000),
      _x: Math.round((Math.random() - 0.5) * 200),
      _y: Math.round((Math.random() - 0.5) * 120),
      _rot: Math.round((Math.random() - 0.5) * 60),
    };
    setTDiscarded((prev) => [...prev, entry]);
    return card;
  };

  // NOTE: Removed auto-draw on mount. The player must choose before first draw.

  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialFadeAnim = useState(new Animated.Value(0))[0];
  const [bebidaImage, setBebidaImage] = useState(null);
  const bebidaFadeAnim = useState(new Animated.Value(0))[0];
  const playerChangeAnim = useState(new Animated.Value(0))[0];

  const fail = (card) => {
    setTFailures((f) => f + 1);
    setTDrinks((d) => d + 1);
    setTStep(1);
    setTCards([]);
    setTSuccesses([]);

    // Mostrar imagen de bebida
    if (card && card.valor === 1) {
      // Si es un 1, mostrar Cerves
      setBebidaImage(CERVEZA);
    } else {
      // Si no, mostrar una bebida aleatoria
      const randomBebida = BEBIDAS[Math.floor(Math.random() * BEBIDAS.length)];
      setBebidaImage(randomBebida);
    }

    // Animar fade in
    bebidaFadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(bebidaFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(bebidaFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setBebidaImage(null));
  };

  const handleParImpar = (choice) => {
    const card = drawTCard();
    if (!card) return;
    const isPar = card.valor % 2 === 0;
    const guessedPar = choice === "par";
    if (isPar === guessedPar) {
      setTStep(2);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      fail(card);
    }
  };

  const handleUpDownEqual = (choice) => {
    const prev = tCards[0];
    if (!prev) {
      // safety: draw one and ask again
      drawTCard();
      return;
    }
    const card = drawTCard();
    if (!card) return;
    let ok = false;
    if (choice === "arriba") ok = card.valor > prev.valor;
    else if (choice === "abajo") ok = card.valor < prev.valor;
    else ok = card.valor === prev.valor;

    if (ok) {
      setTStep(3);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      fail(card);
    }
  };

  const handleInsideOutsideEqual = (choice) => {
    const a = tCards[1];
    const b = tCards[0];
    if (!a || !b) {
      drawTCard();
      return;
    }
    const card = drawTCard();
    if (!card) return;
    const lo = Math.min(a.valor, b.valor);
    const hi = Math.max(a.valor, b.valor);
    let ok = false;
    if (choice === "dentro") ok = card.valor > lo && card.valor < hi;
    else if (choice === "fuera") ok = card.valor < lo || card.valor > hi;
    else ok = card.valor === a.valor || card.valor === b.valor;

    if (ok) {
      setTStep(4);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      fail(card);
    }
  };

  const handlePalo = (palo) => {
    const card = drawTCard();
    if (!card) return;
    if (card.palo === palo) {
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
      // Special passing rules on final round
      const n = jugadores.length || 3;
      if (card.valor === 1) {
        const next = (currentPlayerIndex + 1) % n; // pasa a la derecha
        // Animar el cambio de jugador sin mensaje
        playerChangeAnim.setValue(0);
        Animated.sequence([
          Animated.timing(playerChangeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(playerChangeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentPlayerIndex(next);
        setTStep(1);
        setTCards([]);
        setTSuccesses([]);
      } else if (card.valor === 12) {
        const prev = (currentPlayerIndex - 1 + n) % n; // pasa a la izquierda
        // Animar el cambio de jugador sin mensaje
        playerChangeAnim.setValue(0);
        Animated.sequence([
          Animated.timing(playerChangeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(playerChangeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentPlayerIndex(prev);
        setTStep(1);
        setTCards([]);
        setTSuccesses([]);
      } else {
        setTFinished(true);
      }
    } else {
      fail(card);
    }
  };

  return (
    <ImageBackground source={TAPETE} style={styles.container}>
      {tFinished && (
        <View style={styles.endOverlay}>
          <Text style={styles.endTitle}>Torombolo finalizado</Text>
          <Text style={styles.endText}>Cartas superadas: {tTotalPassed}</Text>
          <Text style={styles.endText}>Fallos: {tFailures}</Text>
          <Text style={styles.endText}>Traguitos: {tDrinks}</Text>
          <TouchableOpacity
            style={styles.endButton}
            onPress={() => navigation.navigate("Menu")}
          >
            <Text style={styles.endButtonText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.topRow}>
        <View style={styles.playerHeader}>
          {loser?.imagen && (
            <Image source={loser.imagen} style={styles.playerIcon} />
          )}
          <View>
            <Text style={styles.title}>Torombolo</Text>
            <Text style={styles.subtitle}>
              {loser?.nombre || `Jugador ${loserIndex + 1}`}
            </Text>
            <Text style={styles.counterText}>
              Cartas reveladas: {tRevealedCount}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.finalizarBtn}
          onPress={() => navigation.navigate("Menu")}
        >
          <Text style={styles.finalizarBtnText}>Finalizar partida</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tutorialBtn}
          onPress={() => {
            setShowTutorial(true);
            tutorialFadeAnim.setValue(0);
            Animated.timing(tutorialFadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Text style={styles.tutorialBtnText}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tTopSequence} pointerEvents="none">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tSuccesses.map((c, i) => (
            <Image key={i} source={c.imagen} style={styles.tCardSmall} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.tTableArea}>
        <View style={styles.tDiscardPile} pointerEvents="none">
          {tDiscarded.map((c) => (
            <Image
              key={c._id}
              source={c.imagen}
              style={[
                styles.tDiscardCard,
                {
                  transform: [
                    { translateX: c._x },
                    { translateY: c._y },
                    { rotate: `${c._rot}deg` },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View
        style={[
          styles.controls,
          bebidaImage && {
            pointerEvents: "none",
            opacity: 0.5,
          },
        ]}
      >
        <Text style={styles.info}>Prueba {tStep} de 4</Text>

        {tStep === 1 && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleParImpar("par")}
            >
              <Text style={styles.btnText}>Par</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleParImpar("impar")}
            >
              <Text style={styles.btnText}>Impar</Text>
            </TouchableOpacity>
          </View>
        )}

        {tStep === 2 && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleUpDownEqual("arriba")}
            >
              <Text style={styles.btnText}>Arriba</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleUpDownEqual("abajo")}
            >
              <Text style={styles.btnText}>Abajo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleUpDownEqual("igual")}
            >
              <Text style={styles.btnText}>Igual</Text>
            </TouchableOpacity>
          </View>
        )}

        {tStep === 3 && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleInsideOutsideEqual("dentro")}
            >
              <Text style={styles.btnText}>Dentro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleInsideOutsideEqual("fuera")}
            >
              <Text style={styles.btnText}>Fuera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleInsideOutsideEqual("igual")}
            >
              <Text style={styles.btnText}>Igual</Text>
            </TouchableOpacity>
          </View>
        )}

        {tStep === 4 && (
          <View style={styles.buttonGroup}>
            {PALOS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.btn, styles.paloBtn]}
                onPress={() => handlePalo(p)}
              >
                <Text style={styles.btnText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.finishBtn}
          onPress={() => setTFinished(true)}
        >
          <Text style={styles.finishBtnText}>Finalizar partida</Text>
        </TouchableOpacity>
      </View>

      {/* Popups */}
      {playerChangeAnim && (
        <Animated.View
          style={[
            styles.playerChangeOverlay,
            {
              opacity: playerChangeAnim,
              transform: [{ scale: playerChangeAnim }],
            },
          ]}
          pointerEvents="none"
        >
          {loser?.imagen && (
            <Image source={loser.imagen} style={styles.playerChangeAvatar} />
          )}
        </Animated.View>
      )}

      {bebidaImage && (
        <View style={styles.bebidaOverlay} pointerEvents="none">
          <Animated.View
            style={[styles.bebidaContainer, { opacity: bebidaFadeAnim }]}
          >
            <Image source={bebidaImage} style={styles.bebidaImage} />
          </Animated.View>
        </View>
      )}

      {showTutorial && (
        <View style={styles.tutorialOverlay}>
          <Animated.View
            style={[styles.tutorialPopup, { opacity: tutorialFadeAnim }]}
          >
            <TouchableOpacity
              style={styles.tutorialClose}
              onPress={() => {
                Animated.timing(tutorialFadeAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start(() => setShowTutorial(false));
              }}
            >
              <Text style={styles.tutorialCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.tutorialTitle}>Tutorial - Torombolo</Text>
            <ScrollView style={styles.tutorialScroll}>
              <Text style={styles.tutorialText}>{`El Torombolo tiene 4 pruebas:

1️⃣ PAR/IMPAR
Adivina si la siguiente carta será par o impar.

2️⃣ ARRIBA/ABAJO/IGUAL
Compara con la carta anterior.

3️⃣ DENTRO/FUERA/IGUAL
La carta debe estar entre las dos anteriores.

4️⃣ PALO
Adivina el palo (Bastos, Copas, Espadas, Oros).

⚠️ Cada fallo: ¡A beber!
🎉 Completa las 4 pruebas para ganar.`}</Text>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: {
    paddingTop: 40,
    paddingBottom: 12,
    alignItems: "center",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playerIcon: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: { color: "#fff", fontSize: 38, fontWeight: "700" },
  subtitle: { color: "#ddd", fontSize: 18, marginTop: 4, fontWeight: "600" },
  counterText: { color: "#fff", fontSize: 14, marginTop: 6 },
  tTopSequence: {
    height: 100,
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tTableArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 180,
  },
  tDiscardPile: {
    width: 280,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  tDiscardCard: {
    position: "absolute",
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  tRevealedCard: { width: 180, height: 270, borderRadius: 10 },
  drawPlaceholder: {
    width: 180,
    height: 270,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  drawText: { color: "#fff" },
  controls: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", justifyContent: "center" },
  buttonGroup: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  paloGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  paloBtn: {
    width: "46%",
    marginHorizontal: 6,
    marginVertical: 8,
    minWidth: undefined,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  btn: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 6,
    borderRadius: 2,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  finishBtn: {
    backgroundColor: "#FF1744",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  finishBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stats: { color: "#fff" },
  backBtn: {
    marginTop: 6,
    backgroundColor: "#c0392b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: { color: "#fff", fontWeight: "600" },
  tCardSmall: { width: 60, height: 96, borderRadius: 6, marginRight: 8 },
  tCardRef: { width: 60, height: 96, borderRadius: 6, marginHorizontal: 4 },
  tLabel: { color: "#fff", marginBottom: 8 },
  info: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  popupBox: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  popupText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  endOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  endTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  endText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  endButton: {
    backgroundColor: "#2980b9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  endButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  bebidaOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  bebidaContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bebidaImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },
  bebidaText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  tutorialBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  finalizarBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    zIndex: 100,
  },
  finalizarBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tutorialBtnText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
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
  tutorialScroll: {
    maxHeight: 300,
  },
  tutorialText: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 20,
  },
  playerChangeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 800,
  },
  playerChangeAvatar: {
    width: 150,
    height: 150,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#FFD700",
  },
});
