import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { Agenda } from "react-native-calendars";
import RNCalendarEvents from "react-native-calendar-events";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

const CalendarScreen = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [eventTitle, setEventTitle] = useState("");
  const [showEvent, setShowEvent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={styles.dateText}>{formatDate()}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const status = await RNCalendarEvents.requestPermissions();
      if (status === "authorized") {
        const calendars = await RNCalendarEvents.findCalendars();
        console.log("Here are all your calendars:", calendars);
      }
    })();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventDate) {
      const eventsForDate = items[eventDate] || [];
      setSelectedEvents(eventsForDate);
    }
  }, [eventDate, items]);

  const toggleShowEvent = () => {
    setShowEvent(!showEvent);
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const fetchEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const fetchedEvents = {};
      eventsSnapshot.forEach((doc) => {
        const data = doc.data();
        const strTime = new Date(data.startDate.toDate()).toISOString().split("T")[0];
        if (!fetchedEvents[strTime]) {
          fetchedEvents[strTime] = [];
        }
        fetchedEvents[strTime].push({
          name: data.title,
          height: 50,
        });
      });
      setItems(fetchedEvents);
      const eventsForDate = fetchedEvents[eventDate] || [];
      setSelectedEvents(eventsForDate);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const loadItems = (day) => {
    setTimeout(() => {
      const newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = new Date(time).toISOString().split("T")[0];
        if (!items[strTime]) {
          newItems[strTime] = [];
        } else {
          newItems[strTime] = items[strTime];
        }
      }
      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );

  const createCalendarEvent = async () => {
    try {
      const eventStartDate = new Date(eventDate);
      const eventEndDate = new Date(eventStartDate);
      eventEndDate.setHours(eventStartDate.getHours() + 1);

      const eventId = await RNCalendarEvents.saveEvent(eventTitle, {
        startDate: eventStartDate.toISOString(),
        endDate: eventEndDate.toISOString(),
        location: "Location",
        notes: "Description of the event",
      });

      await addDoc(collection(db, "events"), {
        title: eventTitle,
        description: "Description of the event",
        startDate: eventStartDate,
        endDate: eventEndDate,
        location: "Location",
        eventId: eventId,
      });

      console.log(`Event created with ID: ${eventId}`);
      Alert.alert("Success", `Event created with ID: ${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error("Error creating event: ", error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={renderItem}
        theme={{
          agendaDayTextColor: "#333",
          agendaDayNumColor: "#333",
          agendaTodayColor: "blue",
          agendaKnobColor: "#333",
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          textSectionTitleColor: "#333",
          selectedDayBackgroundColor: "#333",
          selectedDayTextColor: "#fff",
          todayTextColor: "blue",
          dayTextColor: "#333",
          textDisabledColor: "gray",
          dotColor: "blue",
          selectedDotColor: "blue",
          arrowColor: "#333",
          monthTextColor: "#333",
          indicatorColor: "#fff",
        }}
      />

      {showEvent && (
        <View style={styles.eventContainer}>
          <View style={styles.todoTaskContainer}>
            <TouchableOpacity onPress={toggleShowEvent} activeOpacity={0.5}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.todoText}>Set Event</Text>

            <TouchableOpacity onPress={createCalendarEvent} activeOpacity={0.5}>
              <Text style={styles.confBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={selectedEvents}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.footer}>
            <TextInput
              style={styles.textInput}
              autoFocus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="Event Title"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.dateInput}
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="Event Date"
              placeholderTextColor="#888"
            />
          </View>
        </View>
      )}

      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.floatingButton}
          onPress={toggleShowEvent}
        >
          <AntDesign name="form" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
    color: "white",
  },
  floatingButtonsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    backgroundColor: "#333",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  eventContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  todoTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confBtn: {
    color: "#1E90FF",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default CalendarScreen;
