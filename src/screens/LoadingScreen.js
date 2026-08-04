import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

const GUS = require("../../assets/images/Gus.png");

export default function LoadingScreen({ onFinish }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onFinish?.();
    });
  }, [progress, onFinish]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Image source={GUS} style={styles.image} resizeMode="contain" />
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 36,
  },
  barTrack: {
    width: 220,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(42,28,20,0.15)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#d4a04c",
  },
});
