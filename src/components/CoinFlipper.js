import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function CoinFlipper({
  start = false,
  size = 180,
  onFlipComplete,
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const flipCoin = useCallback(() => {
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setResult(randomResult);
      setRunning(false);
      resultScale.setValue(0);
      Animated.spring(resultScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
      onFlipComplete && onFlipComplete(randomResult);
    });
  }, [flipAnim, resultScale, onFlipComplete]);

  useEffect(() => {
    if (start && !running) {
      flipCoin();
    }
  }, [start, running, flipCoin]);

  // Gira la cara real (no una capa invisible aparte), con perspectiva para
  // que se note el giro en 3D. La cara trasera va siempre 180° detrás de
  // la delantera; backfaceVisibility hace que cada una solo se vea cuando
  // le toca "mirar" a cámara.
  const frontSpin = flipAnim.interpolate({
    inputRange: [0, 1080],
    outputRange: ["0deg", "1080deg"],
  });
  const backSpin = flipAnim.interpolate({
    inputRange: [0, 1080],
    outputRange: ["180deg", "1260deg"],
  });

  // Estrecha la moneda cada 90° para simular que se ve de canto justo
  // cuando backfaceVisibility cambia de cara, en vez de un corte seco.
  const squeezeSteps = Array.from({ length: 13 }, (_, i) => i * 90);
  const squeeze = flipAnim.interpolate({
    inputRange: squeezeSteps,
    outputRange: squeezeSteps.map((_, i) => (i % 2 === 0 ? 1 : 0.05)),
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
              transform: [
                { perspective: 1000 },
                { rotateY: frontSpin },
                { scaleX: squeeze },
              ],
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
              transform: [
                { perspective: 1000 },
                { rotateY: backSpin },
                { scaleX: squeeze },
              ],
            },
          ]}
        >
          <Text style={[styles.coinEmoji, { fontSize: size * 0.35 }]}>✦</Text>
          <Text style={[styles.coinLabel, { fontSize: size * 0.14 }]}>
            CRUZ
          </Text>
        </Animated.View>
      </View>

      {/* Resultado */}
      <View style={styles.resultContainer}>
        {result && (
          <Animated.View
            style={[
              styles.resultBox,
              result === "cara" ? styles.caraResult : styles.cruzResult,
              { transform: [{ scale: resultScale }] },
            ]}
          >
            <Text style={styles.resultEmoji}>
              {result === "cara" ? "👑" : "✦"}
            </Text>
            <Text style={styles.resultText}>
              {result === "cara" ? "¡CARA!" : "¡CRUZ!"}
            </Text>
          </Animated.View>
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
    backfaceVisibility: "hidden",
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
