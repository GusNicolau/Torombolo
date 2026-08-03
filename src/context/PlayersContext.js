import { createContext, useContext, useState } from "react";

const PlayersContext = createContext();

// Roles posibles según la posición
const ROLES = {
  top: { id: "cartas2_4", name: "Cartas 2-4" },
  middle: { id: "cartas5_7", name: "Cartas 5-7" },
  bottom: { id: "figuras", name: "Figuras" },
  left: { id: "cartasOros", name: "Cartas Oros" }, // Puedes cambiar el nombre/rol si lo deseas
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
      let posicion = "top";
      if (prev.length === 1) posicion = "middle";
      else if (prev.length === 2) posicion = "bottom";
      else if (prev.length === 3) posicion = "left";

      const newJugador = {
        ...jugador,
        posicion,
        rol: getDefaultRole(posicion),
      };

      return [...prev, newJugador];
    });
  };

  const removeJugador = (nombre) => {
    setJugadores((prev) => {
      const filtered = prev.filter((j) => j.nombre !== nombre);
      // Reasignar posiciones y roles para hasta 4 jugadores
      const posiciones = ["top", "middle", "bottom", "left"];
      return filtered.map((j, idx) => ({
        ...j,
        posicion: posiciones[idx],
        rol: getDefaultRole(posiciones[idx]),
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
      const posicionMap = { top: 0, middle: 1, bottom: 2, left: 3 };
      const targetIdx = posicionMap[nuevaPosicion];

      if (targetIdx === undefined || targetIdx === jugadorIdx) return prev;

      [newArray[jugadorIdx], newArray[targetIdx]] = [
        newArray[targetIdx],
        newArray[jugadorIdx],
      ];

      // Reasignar posiciones y roles para hasta 4 jugadores
      const posiciones = ["top", "middle", "bottom", "left"];
      return newArray.map((j, idx) => ({
        ...j,
        posicion: posiciones[idx],
        rol: getDefaultRole(posiciones[idx]),
      }));
    });
  };

  // Reordenar jugador arrastrando de una posición del array a otra
  // (a diferencia de moveJugador, que solo intercambia dos posiciones)
  const reorderJugadores = (fromIndex, toIndex) => {
    setJugadores((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length ||
        fromIndex === toIndex
      )
        return prev;

      const newArray = [...prev];
      const [moved] = newArray.splice(fromIndex, 1);
      newArray.splice(toIndex, 0, moved);

      const posiciones = ["top", "middle", "bottom", "left"];
      return newArray.map((j, idx) => ({
        ...j,
        posicion: posiciones[idx],
        rol: getDefaultRole(posiciones[idx]),
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
        reorderJugadores,
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
