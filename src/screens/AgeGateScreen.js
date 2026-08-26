import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AgeGateScreen({ onConfirm }) {
  const [declined, setDeclined] = useState(false);

  const handleDecline = () => {
    if (Platform.OS === "android") {
      const { BackHandler } = require("react-native");
      BackHandler.exitApp();
      return;
    }
    // iOS no permite cerrar la app mediante código (política de Apple).
    setDeclined(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.icon}>🍺</Text>
        <Text style={styles.title}>Antes de empezar</Text>
        <Text style={styles.text}>
          Torombolo incluye un juego para beber. Para continuar debes ser
          mayor de edad legal para el consumo de alcohol en tu país.
        </Text>
        <Text style={styles.textSecondary}>
          Bebe siempre con responsabilidad.
        </Text>

        {declined ? (
          <Text style={styles.declinedText}>
            Debes cerrar la aplicación para continuar.
          </Text>
        ) : (
          <>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Soy mayor de edad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineBtn} onPress={handleDecline}>
              <Text style={styles.declineBtnText}>No soy mayor de edad</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 2000,
  },
  panel: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#2a1c14",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#d4a04c",
    padding: 28,
    alignItems: "center",
    shadowColor: "#d4a04c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    color: "#d4a04c",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
  },
  text: {
    color: "#f3e6d3",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 10,
  },
  textSecondary: {
    color: "#ccc",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 22,
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: "#d4a04c",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmBtnText: {
    color: "#2a1c14",
    fontSize: 16,
    fontWeight: "900",
  },
  declineBtn: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  declineBtnText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  declinedText: {
    color: "#e57368",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "700",
  },
});
