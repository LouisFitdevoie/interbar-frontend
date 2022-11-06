import React from "react";
import { View, StyleSheet } from "react-native";

import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import colors from "../../config/colors";

function JoinEventDetailsScreen(props) {
  const { navigation } = props;
  const { event } = props.route.params;

  const eventDetails = {
    name: event.name,
    startDate: new Date(event.startdate).toLocaleString("fr-BE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    endDate: new Date(event.enddate).toLocaleString("fr-BE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: event.location,
    description: event.description,
    organizer: event.organizer,
  };

  return (
    <Screen style={styles.container}>
      <AppText style={styles.firstTitle}>
        Voulez-vous vraiment rejoindre l'évènement suivant ?
      </AppText>
      <View style={styles.detailsContainer}>
        <View style={styles.textDetailContainer}>
          <AppText style={styles.title}>Nom de l'évènement :</AppText>
          <AppText style={styles.detail}>{eventDetails.name}</AppText>
        </View>
        <View style={styles.textDetailContainer}>
          <AppText style={styles.title}>Organisé par :</AppText>
          <AppText style={styles.detail}>{eventDetails.organizer}</AppText>
        </View>
        <View style={styles.textDetailContainer}>
          <AppText style={styles.title}>Du</AppText>
          <AppText style={styles.detail}>{eventDetails.startDate}</AppText>
          <AppText style={styles.title}>Au</AppText>
          <AppText style={styles.detail}>{eventDetails.endDate}</AppText>
        </View>
        <View style={styles.detailsMultilineContainer}>
          <AppText style={styles.title}>A l'endroit suivant :</AppText>
          <AppText style={styles.detailsMultiline}>
            {eventDetails.location}
          </AppText>
        </View>
        {eventDetails.description !== "" && (
          <View style={styles.detailsMultilineContainer}>
            <AppText style={styles.title}>Description :</AppText>
            <AppText style={styles.detailsMultiline}>
              {eventDetails.description}
            </AppText>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  detailsMultiline: {
    paddingTop: 5,
    textAlign: "center",
  },
  detailsMultilineContainer: {
    flexDirection: "column",
    marginBottom: 10,
  },
  detail: { paddingHorizontal: 5 },
  detailsContainer: {
    marginVertical: 20,
    width: "100%",
  },
  firstTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  textDetailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    color: colors.primary,
  },
});

export default JoinEventDetailsScreen;
