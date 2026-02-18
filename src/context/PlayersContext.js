import { createContext, useContext, useState } from "react";

const PlayersContext = createContext();

// Roles posibles según la posición
const ROLES = {
  top: { id: "cartas2_4", name: "Cartas 2-4" },
  middle: { id: "cartas5_7", name: "Cartas 5-7" },
  bottom: { id: "figuras", name: "Figuras" },
};

export const PlayersProvider = ({ children }) => {
  const [jugadores, setJugadores] = useState([]);

  // Asignar rol automáticamente según posición
  const getDefaultRole = (posicion) => {
    return ROLES[posicion] || ROLES.top;
  };

  const addJugador = (jugador) => {
    // Evitar duplicados
    setJugadores((prev) => {
      if (prev.some((j) => j.nombre === jugador.nombre)) return prev;

      // Asignar posición y rol automáticamente
      const newJugador = {
        ...jugador,
        posicion:
          prev.length === 0 ? "top" : prev.length === 1 ? "middle" : "bottom",
        rol: getDefaultRole(
          prev.length === 0 ? "top" : prev.length === 1 ? "middle" : "bottom",
        ),
      };

      return [...prev, newJugador];
    });
  };

  const removeJugador = (nombre) => {
    setJugadores((prev) => {
      const filtered = prev.filter((j) => j.nombre !== nombre);
      // Reasignar posiciones y roles
      return filtered.map((j, idx) => ({
        ...j,
        posicion: idx === 0 ? "top" : idx === 1 ? "middle" : "bottom",
        rol: getDefaultRole(
          idx === 0 ? "top" : idx === 1 ? "middle" : "bottom",
        ),
      }));
    });
  };

  // Mover jugador a una posición específica
  const moveJugador = (nombre, nuevaPosicion) => {
    setJugadores((prev) => {
      const newArray = [...prev];
      const jugadorIdx = newArray.findIndex((j) => j.nombre === nombre);

      if (jugadorIdx === -1) return prev;

      // Intercambiar posiciones si es necesario
      const posicionMap = { top: 0, middle: 1, bottom: 2 };
      const targetIdx = posicionMap[nuevaPosicion];

      if (targetIdx === undefined || targetIdx === jugadorIdx) return prev;

      [newArray[jugadorIdx], newArray[targetIdx]] = [
        newArray[targetIdx],
        newArray[jugadorIdx],
      ];

      // Reasignar posiciones y roles
      return newArray.map((j, idx) => ({
        ...j,
        posicion: idx === 0 ? "top" : idx === 1 ? "middle" : "bottom",
        rol: getDefaultRole(
          idx === 0 ? "top" : idx === 1 ? "middle" : "bottom",
        ),
      }));
    });
  };

  const getAllPlayers = () => jugadores;

  return (
    <PlayersContext.Provider
      value={{
        jugadores,
        addJugador,
        removeJugador,
        moveJugador,
        getAllPlayers,
        ROLES,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

// Hook para usar el contexto más fácil
export const usePlayers = () => useContext(PlayersContext);
