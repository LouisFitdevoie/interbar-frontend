import React from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";

function UserSellerBeforeEventScreen({
  navigation,
  organizer,
  startDate,
  endDate,
  location,
  description,
  role,
  eventId,
}) {
  return (
    <Screen style={styles.container}>
      <View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Organisé par :</AppText>
          <AppText>{organizer}</AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Date de début :</AppText>
          <AppText>
            {startDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Date de fin :</AppText>
          <AppText>
            {endDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Lieu :</AppText>
          <AppText>{location}</AppText>
        </View>
        {description != null && (
          <View style={styles.detailContainer}>
            <AppText style={styles.title}>Description :</AppText>
            <AppText>{description}</AppText>
          </View>
        )}
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Rôle :</AppText>
          <AppText>{role === 0 ? "Client" : "Vendeur"}</AppText>
        </View>
      </View>
      <View style={styles.qrCodeJoinEventContainer}></View>
      <View style={styles.buttonsContainer}>
        <AppButton
          title="Voir le tarif"
          onPress={() => console.log("tarif")}
          style={{ marginVertical: 5 }}
        />
        <AppButton
          title="Quitter l'évènement"
          onPress={() => console.log("quitter")}
          style={{ marginVertical: 5 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aligntems: "center",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    color: colors.buttonPrimary,
    paddingRight: 5,
    paddingVertical: 5,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrCodeJoinEventContainer: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
});

export default UserSellerBeforeEventScreen;
