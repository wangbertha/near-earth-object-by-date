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
      <Text>{neo.name}</Text>
      <Text>{neo.approxDiameter}</Text>
      <Text>{neo.relativeVelocity}</Text>
      <Text>{neo.missDistance}</Text>
      <Text>{neo.isPotentiallyHazardous ? "Yes" : "No"}</Text>
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
});
