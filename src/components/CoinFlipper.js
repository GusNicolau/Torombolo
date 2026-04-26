import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function CoinFlipper({
  start = false,
  size = 180,
  onFlipComplete,
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (start && !running) {
      flipCoin();
    }
  }, [start, running]);

  const flipCoin = () => {
    setRunning(true);
    const randomResult = Math.random() > 0.5 ? "cara" : "cruz";
    setResult(null);

    // Si es cara terminamos en 1080 (múltiplo de 360 = cara)
    // Si es cruz terminamos en 900 (múltiplo impar de 180 = cruz)
    const finalDeg = randomResult === "cara" ? 1080 : 900;

    flipAnim.setValue(0);
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: finalDeg,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.delay(400),
    ]).start(() => {
      setResult(randomResult);
      setRunning(false);
      onFlipComplete && onFlipComplete(randomResult);
    });
  };

  const spin = flipAnim.interpolate({
    inputRange: [0, 900, 1080],
    outputRange: ["0deg", "900deg", "1080deg"],
  });

  // Cara frontal: visible cuando rotación par de 180 (0, 360, 720, 1080...)
  const frontOpacity = flipAnim.interpolate({
    inputRange: [
      0, 89, 90, 269, 270, 449, 450, 629, 630, 809, 810, 900, 901, 1080,
    ],
    outputRange: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
  });

  // Cara trasera: visible cuando rotación impar de 180 (180, 540, 900...)
  const backOpacity = flipAnim.interpolate({
    inputRange: [
      0, 89, 90, 269, 270, 449, 450, 629, 630, 809, 810, 900, 901, 1080,
    ],
    outputRange: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.coinWrapper, { width: size, height: size }]}>
        {/* CARA */}
        <Animated.View
          style={[
            styles.coinFace,
            styles.caraFace,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: frontOpacity,
            },
          ]}
        >
          <Text style={[styles.coinEmoji, { fontSize: size * 0.35 }]}>👑</Text>
          <Text style={[styles.coinLabel, { fontSize: size * 0.14 }]}>
            CARA
          </Text>
        </Animated.View>

        {/* CRUZ */}
        <Animated.View
          style={[
            styles.coinFace,
            styles.cruzFace,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: backOpacity,
            },
          ]}
        >
          <Text style={[styles.coinEmoji, { fontSize: size * 0.35 }]}>✦</Text>
          <Text style={[styles.coinLabel, { fontSize: size * 0.14 }]}>
            CRUZ
          </Text>
        </Animated.View>

        {/* Capa de animación de giro (invisible, solo para el efecto) */}
        <Animated.View
          style={[
            styles.coinSpin,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ rotateY: spin }],
            },
          ]}
        />
      </View>

      {/* Resultado */}
      <View style={styles.resultContainer}>
        {result && (
          <View
            style={[
              styles.resultBox,
              result === "cara" ? styles.caraResult : styles.cruzResult,
            ]}
          >
            <Text style={styles.resultEmoji}>
              {result === "cara" ? "👑" : "✦"}
            </Text>
            <Text style={styles.resultText}>
              {result === "cara" ? "¡CARA!" : "¡CRUZ!"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  coinWrapper: {
    position: "relative",
    marginBottom: 30,
  },
  coinFace: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  caraFace: {
    backgroundColor: "#FFD700",
    borderColor: "#DAA520",
  },
  cruzFace: {
    backgroundColor: "#C0C0C0",
    borderColor: "#A0A0A0",
  },
  coinSpin: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  coinEmoji: {
    marginBottom: 4,
  },
  coinLabel: {
    fontWeight: "900",
    letterSpacing: 2,
    color: "rgba(0,0,0,0.4)",
  },
  resultContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  resultBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 3,
  },
  caraResult: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFD700",
  },
  cruzResult: {
    backgroundColor: "#F0F0F0",
    borderColor: "#A0A0A0",
  },
  resultEmoji: {
    fontSize: 28,
  },
  resultText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#333",
  },
});
