# Torombolo

App móvil (React Native / Expo) del juego de cartas y bebida Torombolo.

La partida tiene dos fases:

1. **Reparto de cartas**: entre 3 y 4 jugadores, cada uno recibe cartas según
   su posición (números, figuras o palo, según el número de jugadores) hasta
   que alguien se queda sin cartas en relación a los demás. Ese jugador
   pierde.
2. **Torombolo**: el perdedor se enfrenta a una ronda de 4 pruebas con la
   baraja (par/impar, arriba/abajo/igual, dentro/fuera/igual y palo). Cada
   fallo es un trago.

## Requisitos

- Node.js
- Expo Go (para probar en el móvil) o un emulador/simulador

## Empezar

```bash
npm install
npm start
```

Esto abre el Metro bundler; desde ahí puedes abrir la app en Expo Go, un
emulador Android o un simulador iOS.

## Generar un APK

El proyecto usa EAS Build. Con sesión iniciada en la cuenta de Expo
correspondiente:

```bash
npx eas-cli build -p android --profile preview
```

El perfil `preview` genera un APK instalable directamente (no un AAB), listo
para repartir sin pasar por la Play Store.

## Licencia

© 2026 Gustavo Nicolau. Todos los derechos reservados. Ver [LICENSE](./LICENSE).
