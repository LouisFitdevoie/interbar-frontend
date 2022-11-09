import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";

function EventItem({
  eventName,
  eventStartDate,
  eventEndDate,
  eventRole,
  eventOrganizer,
  onPress,
}) {
  let startDate;
  let endDate;
  if (eventStartDate != null) {
    startDate = new Date(eventStartDate).toLocaleString("fr-BE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (eventEndDate != null) {
    endDate = new Date(eventEndDate).toLocaleString("fr-BE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.subContainer} onPress={onPress}>
        <AppText style={styles.eventName}>{eventName}</AppText>
        {eventStartDate != null && (
          <AppText style={styles.eventStartDate}>
            L'évènement débute le {startDate.split(" ")[0]} à{" "}
            {startDate.split(" ")[1]}
          </AppText>
        )}
        {eventEndDate != null && (
          <AppText style={styles.eventEndDate}>
            L'évènement s'est terminé le {endDate.split(" ")[0]} à{" "}
            {endDate.split(" ")[1]}
          </AppText>
        )}
        {eventRole != 2 && (
          <AppText style={styles.organizer}>
            Organisé par {eventOrganizer}
          </AppText>
        )}
        <AppText style={styles.role}>
          Vous{" "}
          {eventRole === 2
            ? "êtes l'organisateur de cet évènement"
            : eventRole === 1
            ? "êtes vendeur pour cet évènement"
            : "participez à cet évènement"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    borderWidth: 2,
    borderRadius: 15,
    borderColor: colors.buttonPrimary,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.buttonPrimary,
    paddingVertical: 5,
  },
  eventStartDate: { paddingVertical: 5 },
  organizer: { paddingVertical: 5 },
  role: { paddingVertical: 5 },
  subContainer: {
    padding: 10,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

export default EventItem;
