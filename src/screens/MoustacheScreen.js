import { useState } from "react";
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { usePlayers } from "../context/PlayersContext";

const amigos = [
  { nombre: "Gustavo", imagen: require("../../assets/moustache/gustavo.png") },
  { nombre: "Carlos", imagen: require("../../assets/moustache/carlos.png") },
  { nombre: "Andreu", imagen: require("../../assets/moustache/andreu.png") },
  { nombre: "Mario", imagen: require("../../assets/moustache/mario.png") },
  { nombre: "Dani", imagen: require("../../assets/moustache/dani.png") },
  { nombre: "Ale", imagen: require("../../assets/moustache/ale.png") },
];

export default function MoustacheScreen({ navigation }) {
  const { addJugador, getAllPlayers } = usePlayers();
  const [seleccionados, setSeleccionados] = useState([]);

  const allPlayers = getAllPlayers() || [];
  const disponibles = amigos.filter(
    (a) => !allPlayers.some((j) => j && j.nombre === a.nombre),
  );

  const toggleSeleccion = (nombre) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre],
    );
  };

  const confirmarSeleccion = () => {
    seleccionados.forEach((nombre) => {
      const amigo = amigos.find((a) => a.nombre === nombre);
      addJugador({ nombre, imagen: amigo?.imagen ?? null });
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>◀ Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Selecciona tus jugadores</Text>

      <FlatList
        data={disponibles}
        keyExtractor={(item) => item.nombre}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const isSelected = seleccionados.includes(item.nombre);

          return (
            <TouchableOpacity
              onPress={() => toggleSeleccion(item.nombre)}
              style={[styles.cardContainer, isSelected && styles.cardSelected]}
            >
              <ImageBackground
                source={item.imagen}
                style={styles.image}
                imageStyle={{ borderRadius: 15 }}
              >
                <View style={styles.nameOverlay}>
                  <Text style={styles.name}>{item.nombre}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />

      {seleccionados.length > 0 && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={confirmarSeleccion}
        >
          <Text style={styles.confirmText}>
            CONFIRMAR ({seleccionados.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1b1b1b",
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: { justifyContent: "center" },
  cardContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#555",
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  cardSelected: {
    borderColor: "#FF4C61",
    transform: [{ scale: 1.05 }],
  },
  image: { flex: 1, justifyContent: "flex-end" },
  nameOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: "#8B0000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 20,
  },
});
