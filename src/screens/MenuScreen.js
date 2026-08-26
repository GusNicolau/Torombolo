import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const FONDO = require("../../assets/images/Inicio5.png");
const TITULO = require("../../assets/images/Titulo.png");

export default function MenuScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const buttonTop = Math.min(200, height * 0.3);

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
            style={[styles.button, { top: buttonTop }]}
            onPress={() => navigation.navigate("Players")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>▶ JUGADORES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { top: buttonTop }]}
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
    width: "85%",
    maxWidth: 400,
    aspectRatio: 400 / 140,
    resizeMode: "contain",
    marginTop: -130,
  },
  button: {
    width: 260,
    paddingVertical: 16,
    backgroundColor: "#2a1c14",
    borderRadius: 12,
    marginVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4a04c",
    shadowColor: "#d4a04c",
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
