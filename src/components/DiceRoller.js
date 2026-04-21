import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

const DiceRoller = ({
  onRollComplete,
  selectedChoice = null,
  player1,
  player2,
  image1,
  image2,
}) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(true);
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const rotateZ = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Determinar ganador
  const determineWinner = () => {
    const isEven = diceValue % 2 === 0;
    if (selectedChoice === "pares") {
      return isEven ? "player1" : "player2";
    } else if (selectedChoice === "impares") {
      return !isEven ? "player1" : "player2";
    }
    return null;
  };

  useEffect(() => {
    let interval;
    let rollTimeout;

    // Animar la rotación 3D
    const rotationAnim = Animated.loop(
      Animated.parallel([
        Animated.timing(rotateX, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(rotateY, {
          toValue: 360,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(rotateZ, {
          toValue: 360,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    );
    rotationAnim.start();

    // Simular que el dado está rodando
    let rollCount = 0;
    interval = setInterval(() => {
      rollCount++;
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);

      // Detener después de 3 segundos
      if (rollCount >= 60) {
        clearInterval(interval);
        rotationAnim.stop();
        setIsRolling(false);

        // Generar el valor final (más seguro)
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);

        // Animación final
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rotateX, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.timing(rotateY, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.timing(rotateZ, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();

        // Callback cuando termina de rodar
        rollTimeout = setTimeout(() => {
          onRollComplete(finalValue, selectedChoice);
        }, 800);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      clearTimeout(rollTimeout);
      rotationAnim.stop();
    };
  }, [onRollComplete, selectedChoice, rotateX, rotateY, rotateZ, scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.playersBar}>
        <View style={[styles.playerDisplay, styles.playerActive]}>
          <Text style={styles.choserLabel}>⭐ ELIGE</Text>
          <Image source={image1} style={styles.playerBadgeImage} />
          <Text style={styles.playerBadgeName}>{player1?.nombre || "J1"}</Text>
        </View>
        <Text style={styles.vsSmall}>VS</Text>
        <View style={styles.playerDisplay}>
          <Text style={styles.opponentLabel}>Espera</Text>
          <Image source={image2} style={styles.playerBadgeImage} />
          <Text style={styles.playerBadgeName}>{player2?.nombre || "J2"}</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.dice,
          {
            transform: [
              {
                rotateX: rotateX.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              {
                rotateY: rotateY.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              {
                rotateZ: rotateZ.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              { scale: scaleAnim },
            ],
            perspective: 1000,
          },
        ]}
      >
        <Text style={styles.diceNumber}>{diceValue}</Text>
      </Animated.View>

      {!isRolling && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Resultado: {diceValue} {diceValue % 2 === 0 ? "(PAR)" : "(IMPAR)"}
          </Text>
          <View style={styles.winnerSection}>
            {determineWinner() === "player1" && (
              <>
                <Text style={styles.winnerText}>
                  🎉 ¡{player1?.nombre} gana el 1! 🎉
                </Text>
                <View style={styles.winnerBadge}>
                  <Image source={image1} style={styles.winnerImage} />
                </View>
              </>
            )}
            {determineWinner() === "player2" && (
              <>
                <Text style={styles.winnerText}>
                  🎉 ¡{player2?.nombre} gana el 1! 🎉
                </Text>
                <View style={styles.winnerBadge}>
                  <Image source={image2} style={styles.winnerImage} />
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
  playersBar: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  playerDisplay: {
    alignItems: "center",
    gap: 6,
  },
  playerBadgeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  playerBadgeName: {
    color: "#FF6B35",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  vsSmall: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "900",
    marginHorizontal: 4,
  },
  dice: {
    width: 140,
    height: 140,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 20,
  },
  diceNumber: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "900",
    textAlign: "center",
  },
  resultContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
    backgroundColor: "rgba(255,107,53,0.15)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "rgba(255,107,53,0.4)",
    maxWidth: 300,
  },
  resultText: {
    color: "#FF6B35",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  winnerSection: {
    alignItems: "center",
    marginTop: 8,
  },
  winnerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  winnerBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFD700",
    overflow: "hidden",
    backgroundColor: "rgba(255,215,0,0.1)",
  },
  winnerImage: {
    width: "100%",
    height: "100%",
  },
});

export default DiceRoller;
