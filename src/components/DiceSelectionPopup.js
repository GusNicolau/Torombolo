import { useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const DiceSelectionPopup = ({
  visible,
  player1,
  player2,
  onSelect,
  playerImage1,
  playerImage2,
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    onSelect(choice);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.playerSection}>
              <Image source={playerImage1} style={styles.playerAvatar} />
              <Text style={styles.playerName}>
                {player1?.nombre || "Jugador 1"}
              </Text>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.playerSection}>
              <Image source={playerImage2} style={styles.playerAvatar} />
              <Text style={styles.playerName}>
                {player2?.nombre || "Jugador 2"}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>¿Pares o Impares?</Text>
          <Text style={styles.subtitle}>
            Elige antes de que se lance el dado
          </Text>

          <View style={styles.choicesContainer}>
            <TouchableOpacity
              style={[
                styles.choiceBtn,
                selectedChoice === "pares" && styles.choiceBtnActive,
              ]}
              onPress={() => handleChoice("pares")}
              disabled={selectedChoice !== null}
            >
              <Text style={styles.choiceEmoji}>2️⃣</Text>
              <Text style={styles.choiceText}>PARES</Text>
              <Text style={styles.choiceSubtext}>2, 4, 6</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceBtn,
                selectedChoice === "impares" && styles.choiceBtnActive,
              ]}
              onPress={() => handleChoice("impares")}
              disabled={selectedChoice !== null}
            >
              <Text style={styles.choiceEmoji}>1️⃣</Text>
              <Text style={styles.choiceText}>IMPARES</Text>
              <Text style={styles.choiceSubtext}>1, 3, 5</Text>
            </TouchableOpacity>
          </View>

          {selectedChoice && (
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                Elegiste:{" "}
                <Text style={styles.selectionValue}>
                  {selectedChoice === "pares" ? "PARES ✓" : "IMPARES ✓"}
                </Text>
              </Text>
              <Text style={styles.waitingText}>Lanzando el dado...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "rgba(20,20,20,0.98)",
    borderRadius: 20,
    padding: 32,
    borderWidth: 3,
    borderColor: "#FF6B35",
    maxWidth: 420,
    width: "100%",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
  },
  playerSection: {
    alignItems: "center",
    flex: 1,
  },
  vsText: {
    color: "#FF6B35",
    fontSize: 24,
    fontWeight: "900",
    marginHorizontal: 8,
    marginTop: 8,
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FF6B35",
    marginBottom: 12,
  },
  playerName: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "500",
  },
  choicesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
    width: "100%",
  },
  choiceBtn: {
    flex: 1,
    backgroundColor: "rgba(255,107,53,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,107,53,0.3)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceBtnActive: {
    backgroundColor: "rgba(255,107,53,0.3)",
    borderColor: "#FF6B35",
    borderWidth: 3,
  },
  choiceEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  choiceText: {
    color: "#FF6B35",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  choiceSubtext: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "500",
  },
  selectionInfo: {
    width: "100%",
    backgroundColor: "rgba(255,107,53,0.15)",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.4)",
    alignItems: "center",
  },
  selectionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectionValue: {
    color: "#FF6B35",
    fontWeight: "900",
  },
  waitingText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
  },
});

export default DiceSelectionPopup;
