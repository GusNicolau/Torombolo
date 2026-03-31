import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FONDO = require("../../assets/images/Inicio.png");
const TITULO = require("../../assets/images/Titulo.png");

export default function MenuScreen({ navigation }) {
  return (
    <ImageBackground
      source={FONDO}
      style={styles.bg}
      imageStyle={{ height: "100%" }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={TITULO} style={styles.titleImage} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Players")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>▶ JUGADORES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>⚙ AJUSTES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  titleImage: {
    width: 480,
    height: 220,
    resizeMode: "contain",
    marginTop: 0,
  },
  button: {
    width: 260,
    paddingVertical: 16,
    backgroundColor: "#222",
    borderRadius: 12,
    marginVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c0392b",
    shadowColor: "#c0392b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
