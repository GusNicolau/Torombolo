import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Torombolo</Text>

      {/*<TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Game")}
      >
        <Text style={styles.buttonText}>Jugar</Text>
      </TouchableOpacity>*/}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Players")}
      >
        <Text style={styles.buttonText}>Jugadores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.buttonText}>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 60,
  },
  button: {
    width: 220,
    paddingVertical: 15,
    backgroundColor: "#c0392b",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
