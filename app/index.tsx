import { FlatList, Platform, Text, View } from "react-native";
import { useState } from "react";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import axios from "axios";
import NeoCard, { type Neo } from "@/components/NeoCard";

/**
 * Converts a date into string format YYYY-MM-DD
 * @param date Date to convert
 * @returns String conversion of the date in the format YYYY-MM-DD
 */
const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${String(date?.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function Index() {
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);
  const [neos, setNeos] = useState<Array<Neo>>([]);

  const onSelection = (event: DateTimePickerEvent, date: Date | undefined) => {
    setDate(date);

    // Build query in the format: API_URL?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=API_KEY
    const queryString = `${
      process.env.EXPO_PUBLIC_API_URL
    }?start_date=${dateToString(date || today)}&end_date=${dateToString(
      date || today
    )}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`;

    axios
      .get(queryString)
      .then((response) => {
        const neosObjects =
          response.data.near_earth_objects[dateToString(date || today)];
        const neosFormatted: Array<Neo> = neosObjects.map(
          (object: {
            name: string;
            estimated_diameter: {
              feet: {
                estimated_diameter_min: number;
                estimated_diameter_max: number;
              };
            };
            close_approach_data: [
              {
                relative_velocity: { miles_per_hour: string | number };
                miss_distance: { miles: string | number };
              }
            ];
            is_potentially_hazardous_asteroid: any;
          }) => ({
            name: object.name,
            approxDiameter:
              (object.estimated_diameter.feet.estimated_diameter_min +
                object.estimated_diameter.feet.estimated_diameter_max) /
              2,
            relativeVelocity:
              +object.close_approach_data[0].relative_velocity.miles_per_hour,
            missDistance: +object.close_approach_data[0].miss_distance.miles,
            isPotentiallyHazardous: object.is_potentially_hazardous_asteroid,
          })
        );
        setNeos(neosFormatted);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Platform.OS === "web" ? (
        <Text></Text>
      ) : (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || today}
          mode="date"
          onChange={onSelection}
        />
      )}
      <FlatList data={neos} renderItem={({ item }) => <NeoCard neo={item} />} />
    </View>
  );
}
