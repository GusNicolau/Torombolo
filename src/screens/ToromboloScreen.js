import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
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
import { useSoundSettings } from "../context/SoundSettingsContext";
import { playSound } from "../soundManager";

// dimensions available if needed
const CARTAS_BARAJA = {
  cartas: {
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
  },
  baraja: {
    // Bastos
    "1Bastos": require("../../assets/baraja/1Bastos.png"),
    "2Bastos": require("../../assets/baraja/2Bastos.png"),
    "3Bastos": require("../../assets/baraja/3Bastos.png"),
    "4Bastos": require("../../assets/baraja/4Bastos.png"),
    "5Bastos": require("../../assets/baraja/5Bastos.png"),
    "6Bastos": require("../../assets/baraja/6Bastos.png"),
    "7Bastos": require("../../assets/baraja/7Bastos.png"),
    "10Bastos": require("../../assets/baraja/10Bastos.png"),
    "11Bastos": require("../../assets/baraja/11Bastos.png"),
    "12Bastos": require("../../assets/baraja/12Bastos.png"),
    // Copas
    "1Copas": require("../../assets/baraja/1Copas.png"),
    "2Copas": require("../../assets/baraja/2Copas.png"),
    "3Copas": require("../../assets/baraja/3Copas.png"),
    "4Copas": require("../../assets/baraja/4Copas.png"),
    "5Copas": require("../../assets/baraja/5Copas.png"),
    "6Copas": require("../../assets/baraja/6Copas.png"),
    "7Copas": require("../../assets/baraja/7Copas.png"),
    "10Copas": require("../../assets/baraja/10Copas.png"),
    "11Copas": require("../../assets/baraja/11Copas.png"),
    "12Copas": require("../../assets/baraja/12Copas.png"),
    // Espadas
    "1Espadas": require("../../assets/baraja/1Espadas.png"),
    "2Espadas": require("../../assets/baraja/2Espadas.png"),
    "3Espadas": require("../../assets/baraja/3Espadas.png"),
    "4Espadas": require("../../assets/baraja/4Espadas.png"),
    "5Espadas": require("../../assets/baraja/5Espadas.png"),
    "6Espadas": require("../../assets/baraja/6Espadas.png"),
    "7Espadas": require("../../assets/baraja/7Espadas.png"),
    "10Espadas": require("../../assets/baraja/10Espadas.png"),
    "11Espadas": require("../../assets/baraja/11Espadas.png"),
    "12Espadas": require("../../assets/baraja/12Espadas.png"),
    // Oros
    "1Oros": require("../../assets/baraja/1Oros.png"),
    "2Oros": require("../../assets/baraja/2Oros.png"),
    "3Oros": require("../../assets/baraja/3Oros.png"),
    "4Oros": require("../../assets/baraja/4Oros.png"),
    "5Oros": require("../../assets/baraja/5Oros.png"),
    "6Oros": require("../../assets/baraja/6Oros.png"),
    "7Oros": require("../../assets/baraja/7Oros.png"),
    "10Oros": require("../../assets/baraja/10Oros.png"),
    "11Oros": require("../../assets/baraja/11Oros.png"),
    "12Oros": require("../../assets/baraja/12Oros.png"),
  },
};

const PALOS = ["Bastos", "Copas", "Espadas", "Oros"];
const TAPETE = require("../../assets/tapete/Tapete2.png");
const CERVEZA = require("../../assets/bebidas/Cerves.png");
const TITULO = require("../../assets/images/Titulo.png");

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

const TOROMBOLO_TUTORIAL_RULES = [
  {
    icon: "🔢",
    title: "1. Par o impar",
    text: "Adivina si la siguiente carta será par o impar.",
  },
  {
    icon: "🔼",
    title: "2. Arriba, abajo o igual",
    text: "Compara con la carta anterior: ¿la siguiente será más alta, más baja o igual?",
  },
  {
    icon: "↔️",
    title: "3. Dentro o fuera",
    text: "Adivina si la carta estará entre las dos anteriores o fuera de ese rango.",
  },
  {
    icon: "♠️",
    title: "4. Palo",
    text: "Adivina el palo de la carta: Bastos, Copas, Espadas u Oros.",
  },
  {
    icon: "🍻",
    title: "Sale un 1",
    text: "¡Beben TODOS los jugadores!",
  },
  {
    icon: "👑",
    title: "Última carta",
    text: "Si aciertas y sale un As, continúa el jugador de la derecha. Si sale un Rey, continúa el de la izquierda. Con un 1 o un Rey como última carta, el Torombolo se reinicia para el siguiente jugador.",
  },
  {
    icon: "⚠️",
    title: "Cada fallo",
    text: "¡A beber!",
  },
  {
    icon: "🎉",
    title: "Victoria",
    text: "Completa las 4 pruebas para ganar.",
  },
];

function crearBaraja(cartas) {
  const baraja = [];
  PALOS.forEach((palo) => {
    for (let valor = 1; valor <= 12; valor++) {
      if (valor === 8 || valor === 9) continue;
      const key = `${valor}${palo}`;
      baraja.push({
        valor,
        palo,
        tipo: valor <= 7 ? "numero" : "figura",
        imagen: cartas[key],
      });
    }
  });
  return baraja.sort(() => Math.random() - 0.5);
}

export default function ToromboloScreen({ navigation, route }) {
  const { jugadores } = usePlayers();
  const { barajaSeleccionada } = useSoundSettings(); // ← añade esto

  // ← CARTAS debe estar aquí dentro, usando el hook
  const CARTAS = CARTAS_BARAJA[barajaSeleccionada] ?? CARTAS_BARAJA["cartas"];
  const loserIndex = route?.params?.loserIndex ?? 0;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(loserIndex);
  const loser = jugadores[currentPlayerIndex];

  // Minigame state
  const [tDeck, setTDeck] = useState(() => crearBaraja(CARTAS));
  const [tCards, setTCards] = useState([]); // historial de cartas reveladas recientes
  const [tDiscarded, setTDiscarded] = useState([]); // monton en tapete (visualmente acumulado)
  const [tStep, setTStep] = useState(1); // 1..4 pruebas
  const [tSuccesses, setTSuccesses] = useState([]);
  const [tDrinks, setTDrinks] = useState(0);
  const [tTotalPassed, setTTotalPassed] = useState(0);
  const [tFinished, setTFinished] = useState(false);
  const [tRevealedCount, setTRevealedCount] = useState(0);
  const [extraRoundAllowed, setExtraRoundAllowed] = useState(false);
  const [extraRoundUsed, setExtraRoundUsed] = useState(false);

  // Draw a card from tDeck; if empty, allow only one extra round if permitted
  const drawTCard = () => {
    let card;
    if (!tDeck || tDeck.length === 0) {
      if (!extraRoundAllowed || extraRoundUsed) {
        setTFinished(true);
        return null;
      }
      setExtraRoundUsed(true);
      const palo = PALOS[Math.floor(Math.random() * PALOS.length)];
      const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
      const valor = valores[Math.floor(Math.random() * valores.length)];
      const key = `${valor}${palo}`;
      card = {
        valor,
        palo,
        tipo: valor <= 7 ? "numero" : "figura",
        imagen: CARTAS[key],
      };
    } else {
      card = tDeck[0];
      setTDeck(tDeck.slice(1));
    }
    playSound("carta");
    setTCards((prev) => [card, ...prev].slice(0, 5));
    setTRevealedCount((n) => n + 1);

    const entry = {
      ...card,
      _id: Date.now() + Math.floor(Math.random() * 10000),
      _x: Math.round((Math.random() - 0.5) * 150),
      _y: Math.round((Math.random() - 0.5) * 60),
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
  const endFadeAnim = useState(new Animated.Value(0))[0];

  const showTutorialPopup = () => {
    setShowTutorial(true);
    tutorialFadeAnim.setValue(0);
    Animated.timing(tutorialFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // El tutorial se abre solo al empezar el Torombolo para que el
  // jugador lo lea antes de jugar.
  useEffect(() => {
    showTutorialPopup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tFinished) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      endFadeAnim.setValue(0);
      Animated.spring(endFadeAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [tFinished, endFadeAnim]);

  const fail = (card) => {
    playSound("toast");
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
      Animated.delay(1500),
      Animated.timing(bebidaFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setBebidaImage(null));
  };

  const handleParImpar = (choice) => {
    // Si quedan 1 carta en el mazo, y acierta, permitir extraRound
    if (tDeck.length === 1) setExtraRoundAllowed(false);
    const card = drawTCard();
    if (!card) return;
    const isPar = card.valor % 2 === 0;
    const guessedPar = choice === "par";
    if (isPar === guessedPar) {
      // Si justo hemos acertado la carta 40, permitir extraRound
      if (tDeck.length === 0) {
        setExtraRoundAllowed(true);
        setExtraRoundUsed(false);
      }
      setTStep(2);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      setExtraRoundAllowed(false); // Si fallas la 40, no hay extra
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
      if (tDeck.length === 0) {
        setExtraRoundAllowed(true);
        setExtraRoundUsed(false);
      }
      setTStep(3);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      setExtraRoundAllowed(false);
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
      if (tDeck.length === 0) {
        setExtraRoundAllowed(true);
        setExtraRoundUsed(false);
      }
      setTStep(4);
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
    } else {
      setExtraRoundAllowed(false);
      fail(card);
    }
  };

  const handlePalo = (palo) => {
    const card = drawTCard();
    if (!card) return;
    if (card.palo === palo) {
      setTTotalPassed((n) => n + 1);
      setTSuccesses((s) => [...s, card]);
      // Si la carta ganadora es Rey o As, pasa al jugador del lado.
      // Si además era la última carta del mazo (la nº40, o una extra si hizo
      // falta sacar más para terminar), el mazo se reinicia entero para que
      // el siguiente jugador tenga cartas con las que jugar.
      const n = jugadores.length || 3;
      const isLastCard = tDeck.length <= 1;
      if (card.valor === 1) {
        const next = (currentPlayerIndex + 1) % n; // pasa a la derecha
        playerChangeAnim.setValue(0);
        Animated.sequence([
          Animated.timing(playerChangeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
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
        if (isLastCard) {
          setTDeck(crearBaraja(CARTAS));
          setExtraRoundAllowed(false);
          setExtraRoundUsed(false);
        }
      } else if (card.valor === 12) {
        const prev = (currentPlayerIndex - 1 + n) % n; // pasa a la izquierda
        playerChangeAnim.setValue(0);
        Animated.sequence([
          Animated.timing(playerChangeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
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
        if (isLastCard) {
          setTDeck(crearBaraja(CARTAS));
          setExtraRoundAllowed(false);
          setExtraRoundUsed(false);
        }
      } else {
        setTFinished(true);
      }
    } else {
      setExtraRoundAllowed(false);
      fail(card);
    }
  };

  return (
    <ImageBackground source={TAPETE} style={styles.container}>
      {tFinished && (
        <Animated.View style={[styles.endOverlay, { opacity: endFadeAnim }]}>
          <Animated.View
            style={[
              styles.endContainer,
              {
                transform: [
                  {
                    scale: endFadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {loser?.imagen && (
              <Image source={loser.imagen} style={styles.endAvatar} />
            )}
            <Text style={styles.endTitle}>¡Torombolo superado!</Text>
            <Text style={styles.endCaption}>
              {loser?.nombre || `Jugador ${loserIndex + 1}`}
            </Text>

            <View style={styles.endStatsPanel}>
              <View style={[styles.endStatRow, styles.endStatRowMid]}>
                <Text style={styles.endStatLabel}>🃏 Cartas superadas</Text>
                <Text style={styles.endStatValue}>{tTotalPassed}</Text>
              </View>
              <View style={styles.endStatRow}>
                <Text style={styles.endStatLabel}>🍺 Traguitos</Text>
                <Text style={styles.endStatValue}>{tDrinks}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.endButton}
              onPress={() => navigation.navigate("Menu")}
            >
              <Text style={styles.endButtonText}>Volver al menú</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.finalizarBtn}
        onPress={() => setTFinished(true)}
      >
        <Text style={styles.finalizarBtnText}>Finalizar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tutorialBtn} onPress={showTutorialPopup}>
        <Text style={styles.tutorialBtnText}>?</Text>
      </TouchableOpacity>

      <View style={styles.topRow}>
        <View style={styles.playerHeader}>
          {loser?.imagen && (
            <Image source={loser.imagen} style={styles.playerIcon} />
          )}
          <View style={styles.playerHeaderInfo}>
            <Text
              style={styles.subtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {loser?.nombre || `Jugador ${loserIndex + 1}`}
            </Text>
            <Text style={styles.counterText}>
              Cartas reveladas: {tRevealedCount}
            </Text>
          </View>
        </View>
        <Image
          source={TITULO}
          resizeMode="contain"
          style={styles.titleImage}
        />
      </View>

      <View style={styles.tTopSequence} pointerEvents="none">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tSuccesses.map((c, i) => (
            <Image key={i} source={c.imagen} style={styles.tCardSmall} />
          ))}
        </ScrollView>
      </View>

      <View
        style={[
          styles.tTableArea,
          {
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 120,
          },
        ]}
      >
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
            <Text style={styles.tutorialTitle}>Tutorial</Text>
            <ScrollView
              style={styles.tutorialScroll}
              showsVerticalScrollIndicator={true}
            >
              {TOROMBOLO_TUTORIAL_RULES.map((rule, i) => (
                <View key={i} style={styles.tutorialRuleCard}>
                  <View style={styles.tutorialRuleIconBox}>
                    <Text style={styles.tutorialRuleIcon}>{rule.icon}</Text>
                  </View>
                  <View style={styles.tutorialRuleTextBox}>
                    <Text style={styles.tutorialRuleTitle}>{rule.title}</Text>
                    <Text style={styles.tutorialRuleText}>{rule.text}</Text>
                  </View>
                </View>
              ))}
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
    paddingTop: 110,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    gap: 14,
  },
  playerIcon: {
    width: 112,
    height: 112,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#d4a04c",
  },
  title: { color: "#fff", fontSize: 38, fontWeight: "700" },
  playerHeaderInfo: {
    justifyContent: "center",
    flexShrink: 1,
  },
  titleImage: {
    width: "88%",
    maxWidth: 340,
    aspectRatio: 340 / 94,
    marginTop: 16,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  counterText: { color: "#ccc", fontSize: 12, marginTop: 4 },
  tTopSequence: {
    height: 100,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tTableArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  tDiscardPile: {
    top: -50,
    width: 210,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  tDiscardCard: {
    position: "absolute",
    width: 74,
    height: 111,
    borderRadius: 6,
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
    backgroundColor: "#d4a04c",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    margin: 5,
    minWidth: 92,
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: "monospace",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: "uppercase",
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
    borderColor: "#ffffff",
    opacity: 0.5,
  },
  stats: { color: "#fff" },
  backBtn: {
    marginTop: 6,
    backgroundColor: "#d4a04c",
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
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 999,
  },
  endContainer: {
    alignItems: "center",
    backgroundColor: "rgba(30,20,14,0.98)",
    borderRadius: 20,
    padding: 28,
    borderWidth: 3,
    borderColor: "#d4a04c",
    width: "100%",
    maxWidth: 380,
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  endAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#d4a04c",
    marginBottom: 12,
  },
  endTitle: {
    color: "#d4a04c",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  endCaption: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 18,
  },
  endStatsPanel: {
    width: "100%",
    backgroundColor: "rgba(212,160,76,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212,160,76,0.3)",
    paddingVertical: 6,
    marginBottom: 24,
  },
  endStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  endStatRowMid: {
    borderBottomWidth: 1,
    borderColor: "rgba(212,160,76,0.2)",
  },
  endStatLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  endStatValue: {
    color: "#d4a04c",
    fontSize: 17,
    fontWeight: "900",
  },
  endButton: {
    backgroundColor: "#d4a04c",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  endButtonText: {
    color: "#fff",
    fontWeight: "700",
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
    width: 230,
    height: 280,
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
    top: 56,
    right: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2a1c14",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  finalizarBtn: {
    position: "absolute",
    top: 56,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#2a1c14",
    borderRadius: 8,
    zIndex: 100,
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  finalizarBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tutorialBtnText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
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
    backgroundColor: "#2a1c14",
    borderRadius: 16,
    padding: 20,
    paddingTop: 24,
    maxHeight: "80%",
    width: "88%",
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tutorialClose: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    zIndex: 1,
  },
  tutorialCloseText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tutorialTitle: {
    color: "#d4a04c",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  tutorialScroll: {
    maxHeight: 420,
  },
  tutorialRuleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(212, 160, 76, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 160, 76, 0.25)",
  },
  tutorialRuleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 160, 76, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tutorialRuleIcon: {
    fontSize: 20,
  },
  tutorialRuleTextBox: {
    flex: 1,
  },
  tutorialRuleTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  tutorialRuleText: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 17,
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
