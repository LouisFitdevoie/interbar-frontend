import React, { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BeforeEventScreen from "./BeforeEventScreen";
import CurrentEventScreen from "./CurrentEventScreen";
import AfterEventScreen from "./AfterEventScreen";

function EventDefaultScreen(props) {
  const { navigation } = props;
  const { event } = props.route.params;

  const today = new Date();
  const eventStartDate = new Date(event.startdate);
  const eventEndDate = new Date(event.enddate);
  const role = event.role;

  const eventToDisplay = {
    name: event.name,
    startDate: eventStartDate,
    endDate: eventEndDate,
    location: event.location,
    description: event.description,
    organizer: event.organizer,
    role: role,
    eventId: event.id,
    createdAt: event.created_at,
  };

  useEffect(() => {
    navigation.setOptions({ title: event.name });
    if (today >= eventStartDate && today < eventEndDate) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetails", {
                organizer: eventToDisplay.organizer,
                startDate: event.startdate,
                endDate: event.enddate,
                location: eventToDisplay.location,
                description: eventToDisplay.description,
                name: eventToDisplay.name,
                eventId: eventToDisplay.eventId,
                createdAt: eventToDisplay.createdAt,
                role: eventToDisplay.role,
              })
            }
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={30}
              color="white"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, []);

  if (today <= eventStartDate) {
    return (
      <BeforeEventScreen
        navigation={navigation}
        organizer={eventToDisplay.organizer}
        startDate={eventToDisplay.startDate}
        endDate={eventToDisplay.endDate}
        location={eventToDisplay.location}
        description={eventToDisplay.description}
        role={eventToDisplay.role}
        eventId={eventToDisplay.eventId}
      />
    );
  } else if (today > eventEndDate) {
    return (
      <AfterEventScreen
        navigation={navigation}
        organizer={eventToDisplay.organizer}
        startDate={eventToDisplay.startDate}
        endDate={eventToDisplay.endDate}
        location={eventToDisplay.location}
        description={eventToDisplay.description}
        role={eventToDisplay.role}
        eventId={eventToDisplay.eventId}
      />
    );
  } else {
    return (
      <CurrentEventScreen
        navigation={navigation}
        organizer={eventToDisplay.organizer}
        startDate={eventToDisplay.startDate}
        endDate={eventToDisplay.endDate}
        location={eventToDisplay.location}
        description={eventToDisplay.description}
        role={eventToDisplay.role}
        eventId={eventToDisplay.eventId}
      />
    );
  }
}

export default EventDefaultScreen;
