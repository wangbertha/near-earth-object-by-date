import { Platform, Text, View } from "react-native";
import { useState } from "react";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

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

  const onSelection = (event: DateTimePickerEvent, date: Date | undefined) => {
    setDate(date);

    // Build query in the format: API_URL?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=API_KEY
    const queryString = `${
      process.env.EXPO_PUBLIC_API_URL
    }?start_date=${dateToString(date || today)}&end_date=${dateToString(
      date || today
    )}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`;
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
      <Text></Text>
    </View>
  );
}
