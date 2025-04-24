import {
  Animated,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

import axios from "axios";
import NeoCard, { type Neo } from "@/components/NeoCard";

// Background Image
const OuterSpace = {
  uri: "https://images.pexels.com/photos/29129951/pexels-photo-29129951/free-photo-of-night-sky-with-comet-and-stars.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

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
  const scrollRef = useRef<FlatList<Neo>>(null);
  const fadeCheckmark = useRef(new Animated.Value(0)).current;
  const today = new Date();
  const [date, setDate] = useState<Date | undefined>(today);
  const [neos, setNeos] = useState<Array<Neo>>([]);

  /**
   * Fetches a list of NEOs on a given day and stores in neos state
   * @param date Single date to be queried
   */
  const fetchNeos = (date: Date) => {
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

        // Reformats complex NEO shape from API into simplified shape of only 5 properties
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

        // Stores converted object into neos state
        setNeos(neosFormatted);

        // Scrolls user back to top of the list, if applicable
        scrollRef.current?.scrollToOffset({ offset: 0, animated: true });

        // Display a checkmark next to the Datepicker that then fades out
        Animated.sequence([
          Animated.timing(fadeCheckmark, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          }),
          Animated.timing(fadeCheckmark, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]).start();
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchNeos(today);
  }, []);

  const onSelection = (
    event: DateTimePickerEvent | React.ChangeEvent<HTMLInputElement>,
    date: Date | undefined
  ) => {
    setDate(date);
    fetchNeos(date || today);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.header}>Welcome to the NEO Rolodex!</Text>
        <Text style={styles.description}>
          Here, you can pull the list of the Near-Earth Objects (Asteroids)
          detected on a given date. Enter the date in question below, and the
          page will automatically update with the list.
        </Text>
        <View style={styles.datepickerRow}>
          {/* Depending on current OS, use native date-picking components */}
          {Platform.OS === "web" ? (
            <label>
              Date:
              <input
                style={styles.datepicker}
                type="date"
                value={date ? dateToString(date) : dateToString(today)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  onSelection(e, new Date(+year, +month - 1, +day));
                }}
              />
            </label>
          ) : (
            <DateTimePicker
              style={styles.datepicker}
              testID="dateTimePicker"
              value={date || today}
              mode="date"
              onChange={onSelection}
            />
          )}
          <Animated.View
            style={{ ...styles.checkmark, opacity: fadeCheckmark }}
          >
            <Ionicons name="checkmark" size={24} color="green" />
          </Animated.View>
        </View>
      </View>

      {/* Display list of NEOs against an outerspace background image */}
      <ImageBackground
        source={OuterSpace}
        resizeMode="cover"
        style={styles.image}
      >
        <FlatList
          ref={scrollRef}
          style={styles.neolist}
          data={neos}
          renderItem={({ item }) => <NeoCard neo={item} />}
          scrollsToTop={true}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  topSection: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    marginTop: 12,
  },
  description: {
    margin: 16,
    textAlign: "center",
  },
  datepickerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  datepicker: {
    margin: 10,
  },
  checkmark: {
    position: "absolute",
    right: -16,
  },
  image: {
    flex: 1,
    alignSelf: "stretch",
  },
  neolist: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#",
    marginTop: 40,
    marginBottom: 40,
  },
});
