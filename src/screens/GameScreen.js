import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
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
import CoinFlipper from "../components/CoinFlipper";
import { usePlayers } from "../context/PlayersContext";
import { useSoundSettings } from "../context/SoundSettingsContext";
import {
  playBackgroundMusic,
  playSound,
  stopBackgroundMusic,
} from "../soundManager";

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

const REVERSO = require("../../assets/cartas/reverso.jpg");
const TAPETE = require("../../assets/tapete/Tapete2.png");
const PALOS = ["Bastos", "Copas", "Espadas", "Oros"];

// Reparto por posición (3 jugadores): izquierda=2-4, arriba=5-7, derecha=figuras
const TUTORIAL_RULES_3P = [
  {
    icon: "⬅️",
    title: "Izquierda: cartas 2, 3 y 4",
    text: "Las cartas numéricas del 2 al 4 van al jugador de la izquierda.",
  },
  {
    icon: "⬆️",
    title: "Arriba: cartas 5, 6 y 7",
    text: "Las cartas numéricas del 5 al 7 van al jugador de arriba.",
  },
  {
    icon: "➡️",
    title: "Derecha: Figuras",
    text: "El 10, 11 y 12 (figuras) van al jugador de la derecha.",
  },
];

// Reparto por palo (4 jugadores): izquierda=Oros, arriba=Copas, derecha=Espadas, abajo=Bastos
const TUTORIAL_RULES_4P = [
  {
    icon: "⬅️",
    title: "Izquierda: Oros",
    text: "Todas las cartas de Oros van al jugador de la izquierda.",
  },
  {
    icon: "⬆️",
    title: "Arriba: Copas",
    text: "Todas las cartas de Copas van al jugador de arriba.",
  },
  {
    icon: "➡️",
    title: "Derecha: Espadas",
    text: "Todas las cartas de Espadas van al jugador de la derecha.",
  },
  {
    icon: "⬇️",
    title: "Abajo: Bastos",
    text: "Todas las cartas de Bastos van al jugador de abajo.",
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
export default function GameScreen({ navigation, route }) {
  const { jugadores } = usePlayers();
  const { barajaSeleccionada } = useSoundSettings();
  const numPlayers = route?.params?.numPlayers || 3;

  const players = jugadores.slice(0, numPlayers);

  const CARTAS = CARTAS_BARAJA[barajaSeleccionada] ?? CARTAS_BARAJA["cartas"];
  const [deck, setDeck] = useState(() => crearBaraja(CARTAS));
  const [playerCards, setPlayerCards] = useState(Array(numPlayers).fill([]));
  const [revealedCard, setRevealedCard] = useState(null); // carta en grande
  const scaleAnim = useState(new Animated.Value(1))[0];
  const targetAnim = useState(new Animated.Value(0))[0];
  // Final-phase state
  const [limit, setLimit] = useState(numPlayers === 4 ? 7 : 9);
  const [gameOver, setGameOver] = useState(false);
  const [finalCounts, setFinalCounts] = useState(null);
  const [loserIndex, setLoserIndex] = useState(null);
  // Revelado en cadena del fin de partida: cartas boca abajo → se giran una
  // a una → se señala al perdedor
  const [revealStep, setRevealStep] = useState(0);
  const [showLoserReveal, setShowLoserReveal] = useState(false);
  const cardRevealAnims = useState(() =>
    players.map(() => new Animated.Value(0)),
  )[0];
  const loserBadgeAnim = useState(new Animated.Value(0))[0];
  const ctaAnim = useState(new Animated.Value(0))[0];
  const [showTutorial, setShowTutorial] = useState(false);
  const tutorialFadeAnim = useState(new Animated.Value(0))[0];
  // Confirm finish popup
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  // Coin flip state: sirve tanto para el 1 ("card") como para el empate de
  // perdedores al terminar la partida ("loser")
  const [showCoinFlipper, setShowCoinFlipper] = useState(false);
  const [coinFlipMode, setCoinFlipMode] = useState("card");
  const [coinCandidates, setCoinCandidates] = useState([]); // indices
  const [coinChooserIdx, setCoinChooserIdx] = useState(0);
  const [coinChoices, setCoinChoices] = useState({}); // {playerIdx: 'cara'|'cruz'}
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [pendingCard, setPendingCard] = useState(null);
  const [pendingFinalCounts, setPendingFinalCounts] = useState(null);
  const [revealedCardTarget, setRevealedCardTarget] = useState(null); // { player, index }

  // Stop background music when game starts, resume when game ends
  useEffect(() => {
    // Stop background music immediately when entering game
    stopBackgroundMusic();

    // Cleanup: resume background music when leaving game
    return () => {
      playBackgroundMusic();
    };
  }, []);

  // (Torombolo moved to its own screen)

  // Secuencia de revelado del fin de partida: las cartas empiezan boca
  // abajo, se giran una a una, y tras una pequeña pausa se señala a quien
  // pierde con el sello y aparece el botón de Torombolo.
  useEffect(() => {
    if (!gameOver) return;
    let cancelled = false;
    const timers = [];

    setRevealStep(0);
    setShowLoserReveal(false);
    cardRevealAnims.forEach((anim) => anim.setValue(0));
    loserBadgeAnim.setValue(0);
    ctaAnim.setValue(0);

    const revealNext = (i) => {
      if (cancelled) return;
      if (i >= players.length) {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setShowLoserReveal(true);
            playSound("toast").catch(() => {});
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            ).catch(() => {});
            Animated.spring(loserBadgeAnim, {
              toValue: 1,
              friction: 5,
              tension: 80,
              useNativeDriver: true,
            }).start();
            Animated.timing(ctaAnim, {
              toValue: 1,
              duration: 350,
              delay: 200,
              useNativeDriver: true,
            }).start();
          }, 500),
        );
        return;
      }
      setRevealStep(i + 1);
      playSound("carta").catch(() => {});
      Animated.spring(cardRevealAnims[i], {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }).start();
      timers.push(setTimeout(() => revealNext(i + 1), 380));
    };

    timers.push(setTimeout(() => revealNext(0), 300));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [gameOver, cardRevealAnims, ctaAnim, loserBadgeAnim, players.length]);

  const drawCard = () => {
    if (gameOver) return;
    if (deck.length === 0 || revealedCard) return;
    const card = deck[0];
    setDeck(deck.slice(1));
    setRevealedCard(card);

    // Calcular a quién va la carta
    const targetIdx = card.valor === 1 ? -1 : getPlayerIndex(card);
    if (targetIdx >= 0 && players[targetIdx]) {
      setRevealedCardTarget({ player: players[targetIdx], index: targetIdx });
    } else if (card.valor === 1) {
      const cardCounts = playerCards.map((c) => c.length);
      const min = Math.min(...cardCounts);
      const candidates = cardCounts
        .map((count, i) => (count === min ? i : null))
        .filter((i) => i !== null);

      if (candidates.length === 1) {
        // Un solo ganador claro
        setRevealedCardTarget({
          player: players[candidates[0]],
          index: candidates[0],
        });
      } else {
        // Empate → moneda
        setRevealedCardTarget({ player: null, index: -1, candidates });
      }
    } else {
      const targetIdx = getPlayerIndex(card);
      if (targetIdx >= 0 && players[targetIdx]) {
        setRevealedCardTarget({ player: players[targetIdx], index: targetIdx });
      } else {
        setRevealedCardTarget(null);
      }
    }

    playSound("carta").catch((err) =>
      console.warn("Card sound error:", err?.message),
    );

    targetAnim.setValue(0);
    Animated.spring(targetAnim, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();

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

  const placeRevealedCard = () => {
    if (gameOver) return;
    if (!revealedCard) return;

    // Si es un 1, preparar la fase de moneda entre los empates
    if (revealedCard.valor === 1) {
      playSound("toast").catch((err) =>
        console.warn("Toast sound error:", err?.message),
      );

      const cardCounts = playerCards.map((c) => c.length);
      const min = Math.min(...cardCounts);
      const candidates = cardCounts
        .map((count, i) => (count === min ? i : null))
        .filter((i) => i !== null);

      if (candidates.length === 1) {
        // Un solo jugador con menos cartas → carta directa, sin moneda
        const winnerIndex = candidates[0];
        const newPlayerCards = playerCards.map((arr, i) =>
          i === winnerIndex ? [...arr, revealedCard] : arr,
        );
        setPlayerCards(newPlayerCards);
        checkFinalPhase(newPlayerCards);
        setRevealedCard(null);
        setRevealedCardTarget(null);
      } else {
        // Empate → lanzar moneda entre los candidatos
        setPendingCard(revealedCard);
        setRevealedCard(null);
        setCoinCandidates(candidates);
        setCoinChooserIdx(0);
        setCoinChoices({});
        setCoinFlipping(false);
        setShowCoinFlipper(true);
      }
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
    setRevealedCardTarget(null);
  };

  // Lanza el duelo de moneda para decidir quién pierde entre varios
  // jugadores empatados a menos cartas. Reutiliza el mismo mecanismo del 1:
  // quien acierta cara/cruz "gana" el duelo, pero aquí ganar el duelo
  // significa ser el perdedor de la partida.
  const startLoserCoinFlip = (candidateIdxs, counts) => {
    setPendingFinalCounts(counts);
    setCoinFlipMode("loser");
    setPendingCard(null);
    setCoinCandidates(candidateIdxs);
    setCoinChooserIdx(0);
    setCoinChoices({});
    setCoinFlipping(false);
    setShowCoinFlipper(true);
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
      if (losers.length === 1) {
        setLoserIndex(losers[0].idx);
        setGameOver(true);
        setFinalCounts(counts);
      } else {
        startLoserCoinFlip(
          losers.map((l) => l.idx),
          counts,
        );
      }
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

  // TODO(debug): quitar junto con el botón "Forzar final" cuando terminemos
  // de probar la pantalla de resultados
  const debugForceGameOver = () => {
    if (gameOver || revealedCard || showCoinFlipper || showFinishConfirm)
      return;
    const counts = playerCards.map((c) => c.length);
    const min = Math.min(...counts);
    const losers = counts
      .map((count, idx) => ({ count, idx }))
      .filter((obj) => obj.count === min);
    if (losers.length === 1) {
      setLoserIndex(losers[0].idx);
      setFinalCounts(counts);
      setGameOver(true);
    } else {
      startLoserCoinFlip(
        losers.map((l) => l.idx),
        counts,
      );
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

  const handleCoinFlipComplete = (result) => {
    const winners = coinCandidates.filter(
      (pIdx) => coinChoices[pIdx] === result,
    );

    if (coinFlipMode === "loser") {
      if (winners.length === 1) {
        // Ganador claro del duelo → es quien pierde la partida
        setLoserIndex(winners[0]);
        setFinalCounts(pendingFinalCounts);
        setGameOver(true);
        setShowCoinFlipper(false);
        setCoinCandidates([]);
        setCoinChoices({});
        setCoinChooserIdx(0);
        setCoinFlipping(false);
        setCoinFlipMode("card");
        setPendingFinalCounts(null);
      } else if (winners.length === 0) {
        setCoinCandidates(coinCandidates);
        setCoinChooserIdx(0);
        setCoinChoices({});
        setCoinFlipping(false);
      } else {
        setCoinCandidates(winners);
        setCoinChooserIdx(0);
        setCoinChoices({});
        setCoinFlipping(false);
      }
      return;
    }

    if (!pendingCard) return;

    if (winners.length === 1) {
      // Ganador claro → asignar carta
      const winnerIndex = winners[0];
      const newPlayerCards = playerCards.map((arr, i) =>
        i === winnerIndex ? [...arr, pendingCard] : arr,
      );
      setPlayerCards(newPlayerCards);
      checkFinalPhase(newPlayerCards);
      setRevealedCard(null);
      setShowCoinFlipper(false);
      setPendingCard(null);
      setCoinCandidates([]);
      setCoinChoices({});
      setCoinChooserIdx(0);
      setCoinFlipping(false);
    } else if (winners.length === 0) {
      // Nadie acertó → todos los candidatos vuelven a jugar
      setCoinCandidates(coinCandidates);
      setCoinChooserIdx(0);
      setCoinChoices({});
      setCoinFlipping(false);
    } else {
      // Varios acertaron → nueva ronda solo entre los ganadores
      setCoinCandidates(winners);
      setCoinChooserIdx(0);
      setCoinChoices({});
      setCoinFlipping(false);
    }
  };

  const handleChoice = (choice) => {
    const currentPlayerIdx = coinCandidates[coinChooserIdx];
    const updated = { ...coinChoices, [currentPlayerIdx]: choice };
    const nextChooserIdx = coinChooserIdx + 1;
    const remaining = coinCandidates.length - nextChooserIdx;

    // Si solo queda un jugador por elegir y todos los anteriores coinciden
    // en el mismo lado, no le dejamos duplicar: se le asigna directamente
    // el lado que falta y se lanza la moneda, sin pedirle que toque un
    // botón (así el lanzamiento siempre es decisivo). Con 2 jugadores esto
    // se cumple siempre nada más elegir el primero.
    if (remaining === 1 && new Set(Object.values(updated)).size === 1) {
      const lastIdx = coinCandidates[nextChooserIdx];
      updated[lastIdx] = choice === "cara" ? "cruz" : "cara";
      setCoinChoices(updated);
      setCoinFlipping(true);
      return;
    }

    setCoinChoices(updated);
    if (nextChooserIdx < coinCandidates.length) {
      setCoinChooserIdx(nextChooserIdx);
    } else {
      setCoinFlipping(true);
    }
  };

  // El reparto de cartas depende del número de jugadores, así que el
  // tutorial también: por posición (3) o por palo (4).
  const tutorialRules = [
    ...(numPlayers === 4 ? TUTORIAL_RULES_4P : TUTORIAL_RULES_3P),
    {
      icon: "🪙",
      title: "El 1 es especial",
      text: "Se lanza una moneda entre los jugadores con menos cartas. Quien acierte cara o cruz se la lleva.",
    },
    {
      icon: "🏁",
      title: "Fin de la partida",
      text: `Termina en cuanto algún jugador alcanza el límite de cartas (ahora mismo: ${limit}).`,
    },
    {
      icon: "⚖️",
      title: "Empate en el límite",
      text: "Si varios llegan a la vez, pierde quien tenga menos cartas. Si también empatan ahí, el límite sube +1.",
    },
  ];

  const { width, height } = Dimensions.get("window");
  // Posiciones para 3 y 4 jugadores
  const playerPositions =
    numPlayers === 4
      ? [
          { left: -30, top: height / 2 - 110, rotate: "90deg" },
          { left: width / 2 - 120, top: 120, rotate: "0deg" },
          { right: -30, top: height / 2 - 120, rotate: "270deg" },
          { left: width / 2 - 120, top: height - 420, rotate: "0deg" }, // ← top en vez de bottom
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
          {/* TODO(debug): quitar cuando terminemos de probar resultados */}
          <TouchableOpacity
            style={styles.debugEndBtn}
            onPress={debugForceGameOver}
          >
            <Text style={styles.debugEndBtnText}>🏁 Forzar final</Text>
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
          {/* Indicador del jugador destino */}
          {revealedCardTarget?.player && (
            <Animated.View
              style={[
                styles.revealedTarget,
                {
                  opacity: targetAnim,
                  transform: [
                    {
                      translateY: targetAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-16, 0],
                      }),
                    },
                    {
                      scale: targetAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.revealedTargetLabel}>Le toca a</Text>
              <Image
                source={revealedCardTarget.player.imagen}
                style={styles.revealedTargetAvatar}
              />
              <Text style={styles.revealedTargetName}>
                {revealedCardTarget.player.nombre}
              </Text>
            </Animated.View>
          )}
          {revealedCardTarget?.index === -1 && (
            <Animated.View
              style={[
                styles.revealedTarget,
                styles.revealedTargetDuel,
                {
                  opacity: targetAnim,
                  transform: [
                    {
                      translateY: targetAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-16, 0],
                      }),
                    },
                    {
                      scale: targetAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.revealedTargetCoinBadge}>
                <Text style={styles.revealedTargetCoinIcon}>🪙</Text>
              </View>
              <Text style={styles.revealedTargetCoinLabel}>
                ¡Duelo por la carta!
              </Text>
              <View style={styles.revealedTargetDuelRow}>
                {revealedCardTarget.candidates?.map((pIdx, i) => (
                  <View key={pIdx} style={styles.revealedTargetDuelPair}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={players[pIdx].imagen}
                        style={styles.revealedTargetAvatarSmall}
                      />
                      <Text style={styles.revealedTargetNameSmall}>
                        {players[pIdx].nombre}
                      </Text>
                    </View>
                    {i < revealedCardTarget.candidates.length - 1 && (
                      <Text style={styles.revealedTargetVs}>VS</Text>
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
          <Animated.Image
            source={revealedCard.imagen}
            style={[styles.revealedCard, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>
      )}

      {/* Popup de selección pares/impares */}
      {/* Componente de la moneda */}
      {showCoinFlipper && (
        <View style={styles.coinFlipperOverlay}>
          {coinFlipMode === "loser" && (
            <Text style={styles.coinModeCaption}>
              🍺 Duelo por quién pierde
            </Text>
          )}
          <View style={styles.coinContent}>
            <View style={styles.coinAvatarRow} pointerEvents="box-none">
              {coinCandidates.map((pIdx, i) => {
                const p = players[pIdx];
                const chosen = coinChoices[pIdx];
                const isActive = i === coinChooserIdx && !coinFlipping;
                return (
                  <View
                    key={pIdx}
                    style={styles.coinAvatarBox}
                    pointerEvents="box-none"
                  >
                    <View style={styles.coinAvatarWrap}>
                      <Image
                        source={p?.imagen}
                        style={[
                          styles.coinAvatar,
                          isActive && styles.coinAvatarActive,
                        ]}
                        pointerEvents="none"
                      />
                      {chosen && (
                        <View
                          style={[
                            styles.coinChoiceBadge,
                            chosen === "cara"
                              ? styles.coinChoiceBadgeCara
                              : styles.coinChoiceBadgeCruz,
                          ]}
                        >
                          <Text style={styles.coinChoiceBadgeIcon}>
                            {chosen === "cara" ? "👑" : "✦"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.coinAvatarName}>{p?.nombre}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.coinCenter}>
              {!coinFlipping ? (
                <View style={styles.coinChooserArea}>
                  <Text style={styles.coinChooserText}>
                    {players[coinCandidates[coinChooserIdx]]?.nombre ||
                      "Jugador"}{" "}
                    selecciona:
                  </Text>
                  <View style={styles.coinChoiceButtons}>
                    <TouchableOpacity
                      style={[styles.coinChoiceBtn, styles.coinChoiceBtnCara]}
                      onPress={() => handleChoice("cara")}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.coinChoiceBtnIcon}>👑</Text>
                      <Text
                        style={[
                          styles.coinChoiceBtnText,
                          styles.coinChoiceBtnTextCara,
                        ]}
                      >
                        Cara
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.coinChoiceBtn, styles.coinChoiceBtnCruz]}
                      onPress={() => handleChoice("cruz")}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.coinChoiceBtnIcon}>✦</Text>
                      <Text
                        style={[
                          styles.coinChoiceBtnText,
                          styles.coinChoiceBtnTextCruz,
                        ]}
                      >
                        Cruz
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <CoinFlipper
                  start={coinFlipping}
                  onFlipComplete={handleCoinFlipComplete}
                  size={200}
                />
              )}
            </View>
          </View>
        </View>
      )}

      {/* Overlay de fin de partida: revelado en cadena */}
      {gameOver && finalCounts && (
        <View style={styles.endOverlay}>
          <View
            style={[
              styles.endContainer,
              { maxWidth: 400, width: "90%", alignSelf: "center", padding: 20 },
            ]}
          >
            <Text style={styles.endTitle}>Fin de la partida</Text>
            <Text style={styles.endCaption}>
              {showLoserReveal
                ? "A por el Torombolo"
                : revealStep === 0
                  ? "Girando las cartas…"
                  : "Contando cartas…"}
            </Text>
            {!showLoserReveal && (
              <View style={styles.endTensionTrack}>
                <View
                  style={[
                    styles.endTensionFill,
                    { width: `${(revealStep / players.length) * 100}%` },
                  ]}
                />
              </View>
            )}
            <View
              style={[styles.endPlayersList, { padding: 8, marginBottom: 16 }]}
            >
              {players.map((p, i) => {
                const anim = cardRevealAnims[i];
                const isLoser = i === loserIndex;
                const isLast = i === players.length - 1;
                return (
                  <View
                    key={i}
                    style={[styles.endPlayerRow, isLast && styles.endPlayerRowLast]}
                  >
                    <View style={styles.endPlayerRowInner}>
                      {/* Boca abajo */}
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.endCardBack,
                          {
                            opacity: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 0],
                            }),
                          },
                        ]}
                      >
                        <Text style={styles.endCardBackText}>?</Text>
                      </Animated.View>
                      {/* Revelada */}
                      <Animated.View
                        style={[
                          styles.endPlayerRowContent,
                          showLoserReveal &&
                            isLoser &&
                            styles.endPlayerRowLoser,
                          {
                            opacity: anim,
                            transform: [
                              {
                                rotateY: anim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ["-90deg", "0deg"],
                                }),
                              },
                              {
                                scale: anim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <Image
                          source={
                            p?.imagen ||
                            require("../../assets/moustache/ale.png")
                          }
                          style={styles.endPlayerAvatar}
                        />
                        <View style={styles.endPlayerInfo}>
                          <Text style={styles.endPlayerName}>
                            {p ? p.nombre : `Jugador ${i + 1}`}
                          </Text>
                          <Text style={styles.endPlayerCards}>
                            {finalCounts[i]} cartas
                          </Text>
                        </View>
                        {showLoserReveal && isLoser && (
                          <Animated.View
                            style={[
                              styles.endLoserStamp,
                              {
                                opacity: loserBadgeAnim,
                                transform: [
                                  {
                                    scale: loserBadgeAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0.4, 1],
                                    }),
                                  },
                                  { rotate: "-8deg" },
                                ],
                              },
                            ]}
                          >
                            <Text style={styles.endLoserStampText}>🍺</Text>
                          </Animated.View>
                        )}
                      </Animated.View>
                    </View>
                  </View>
                );
              })}
            </View>
            <Animated.View
              style={{
                opacity: ctaAnim,
                transform: [
                  {
                    translateY: ctaAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              }}
              pointerEvents={showLoserReveal ? "auto" : "none"}
            >
              <TouchableOpacity
                style={[styles.btn, { marginTop: 8, alignSelf: "center" }]}
                onPress={() =>
                  navigation.navigate("Torombolo", { loserIndex })
                }
              >
                <Text style={styles.btnText}>Torombolo</Text>
              </TouchableOpacity>
            </Animated.View>
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
            <Text style={styles.tutorialTitle}>📖 Cómo jugar</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.tutorialScroll}
            >
              {tutorialRules.map((rule, i) => (
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
  // TODO(debug): quitar junto con debugForceGameOver
  debugEndBtn: {
    position: "absolute",
    top: 56,
    alignSelf: "center",
    backgroundColor: "#e91e63",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
  debugEndBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
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
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  cardCounter: {
    color: "#fff",
    fontSize: 12,
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
    left: Dimensions.get("window").width / 2 - 120,
    width: 240,
    height: 250,
    overflow: "hidden",
    alignItems: "center",
    bottom: 0,
    zIndex: 1, // ← añade esto
  },
  deckImage: {
    width: 240, // más ancho que las cartas normales
    height: 370, // altura completa de la carta
    borderRadius: 10,
    marginTop: 0, // mover la carta hacia arriba para que solo se vea la mitad
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#fff",
  },
  revealedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
    backgroundColor: "rgba(30,20,14,0.98)",
    borderRadius: 20,
    padding: 32,
    borderWidth: 3,
    borderColor: "#d4a04c",
    maxWidth: 420,
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  endTitle: {
    color: "#d4a04c",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
  endCaption: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 14,
  },
  endTensionTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    marginBottom: 18,
  },
  endTensionFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFD700",
  },
  endPlayersList: {
    width: "100%",
    marginBottom: 28,
    backgroundColor: "rgba(212,160,76,0.08)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212,160,76,0.3)",
  },
  endPlayerRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,160,76,0.2)",
  },
  endPlayerRowLast: {
    borderBottomWidth: 0,
  },
  endPlayerRowInner: {
    position: "relative",
  },
  endCardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 8,
  },
  endCardBackText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 20,
    fontWeight: "900",
  },
  endPlayerRowContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  endPlayerRowLoser: {
    backgroundColor: "rgba(224,87,74,0.14)",
    borderRadius: 10,
  },
  endPlayerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#d4a04c",
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
    color: "#d4a04c",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  endLoserStamp: {
    justifyContent: "center",
    alignItems: "center",
  },
  endLoserStampText: {
    fontSize: 40,
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
    elevation: 10,
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
  btn: {
    backgroundColor: "#d4a04c",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#d4a04c",
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
  coinFlipperOverlay: {
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
  coinContent: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 220,
  },
  coinModeCaption: {
    position: "absolute",
    top: 130,
    alignSelf: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: "rgba(212,160,76,0.25)",
    borderWidth: 1,
    borderColor: "#d4a04c",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinAvatarRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  coinAvatarBox: {
    alignItems: "center",
    pointerEvents: "box-none",
  },
  coinAvatarWrap: {
    position: "relative",
  },
  coinAvatar: {
    width: 70,
    height: 70,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#d4a04c",
    pointerEvents: "none",
  },
  coinAvatarActive: {
    borderColor: "#fff",
    borderWidth: 3,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  coinAvatarName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  coinChoiceBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2a1c14",
  },
  coinChoiceBadgeCara: {
    backgroundColor: "#FFD700",
  },
  coinChoiceBadgeCruz: {
    backgroundColor: "#C0C0C0",
  },
  coinChoiceBadgeIcon: {
    fontSize: 13,
  },
  coinCenter: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  coinChooserArea: {
    alignItems: "center",
    width: "100%",
  },
  coinChooserText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  coinChoiceButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  coinChoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  coinChoiceBtnCara: {
    backgroundColor: "rgba(255,215,0,0.16)",
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
  },
  coinChoiceBtnCruz: {
    backgroundColor: "rgba(192,192,192,0.16)",
    borderColor: "#C0C0C0",
    shadowColor: "#C0C0C0",
  },
  coinChoiceBtnIcon: {
    fontSize: 18,
  },
  coinChoiceBtnText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  coinChoiceBtnTextCara: {
    color: "#FFD700",
  },
  coinChoiceBtnTextCruz: {
    color: "#e6e6e6",
  },
  revealedTarget: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(30,20,14,0.85)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  revealedTargetLabel: {
    color: "#d4a04c",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  revealedTargetAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#d4a04c",
    marginBottom: 8,
  },
  revealedTargetName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  revealedTargetDuel: {
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
  },
  revealedTargetCoinBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderWidth: 2,
    borderColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  revealedTargetCoinIcon: {
    fontSize: 22,
  },
  revealedTargetCoinLabel: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  revealedTargetDuelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  revealedTargetDuelPair: {
    flexDirection: "row",
    alignItems: "center",
  },
  revealedTargetVs: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "900",
    marginHorizontal: 10,
  },
  revealedTargetAvatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  revealedTargetNameSmall: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});
