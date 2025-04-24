import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Units -
 * name: N/A;
 * approxDiameter: feet;
 * relativeVelocity: miles per hour;
 * missDistance: miles;
 * isPotentiallyHazardous: N/A
 */
export interface Neo {
  name: string;
  approxDiameter: number;
  relativeVelocity: number;
  missDistance: number;
  isPotentiallyHazardous: boolean;
}

interface NeoProp {
  neo: Neo;
}

export default function NeoCard({ neo }: NeoProp) {
  return (
    <View style={styles.card}>
      <Text style={{ ...styles.textName, ...styles.text }}>{neo.name}</Text>
      <Text style={styles.text}>
        Approx. Diameter: {Math.round(neo.approxDiameter)} feet
      </Text>
      <Text style={styles.text}>
        Relative Velocity: {Math.round(neo.relativeVelocity)} miles per hour
      </Text>
      <Text style={styles.text}>
        Miss Distance: {Math.round(neo.missDistance)} miles
      </Text>
      <Text style={styles.text}>
        {neo.isPotentiallyHazardous
          ? 'Categorized as "Potentially Hazardous"'
          : 'Not categorized as "Potentially Hazardous"'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  textName: {
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
