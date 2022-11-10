import React from "react";
import { Alert } from "react-native";

import UserSellerBeforeEventScreen from "./UserSellerBeforeEventScreen";

function EventDefaultScreen(props) {
  const { navigation } = props;
  const { event } = props.route.params;
  navigation.setOptions({ headerTitle: event.name });

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

  if (today < eventStartDate) {
    if (role === 0) {
      return (
        <UserSellerBeforeEventScreen
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
    } else if (role === 1) {
      return (
        <UserSellerBeforeEventScreen
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
    } else if (role === 2) {
      //Organisateur avant l'événement
    } else {
      Alert.alert(
        "Une erreur est survenue, vous allez être redirigé vers la page d'accueil"
      );
      navigation.navigate("Home");
    }
  } else if (today > eventEndDate) {
    if (role === 0) {
      //Client après l'évènement
    } else if (role === 1) {
      //Vendeur après l'évènement
    } else if (role === 2) {
      //Organisateur après l'événement
    } else {
      Alert.alert(
        "Une erreur est survenue, vous allez être redirigé vers la page d'accueil"
      );
      navigation.navigate("Home");
    }
  } else {
    if (role === 0) {
      //Client pendant l'évènement
    } else if (role === 1) {
      //Vendeur pendant l'évènement
    } else if (role === 2) {
      //Organisateur pendant l'événement
    } else {
      Alert.alert(
        "Une erreur est survenue, vous allez être redirigé vers la page d'accueil"
      );
      navigation.navigate("Home");
    }
  }
}

export default EventDefaultScreen;
