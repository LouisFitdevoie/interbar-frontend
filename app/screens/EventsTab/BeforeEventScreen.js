import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

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
  //TODO :
  // - USER
  // --- Redirect to tarif screen (line 91)
  // --- Leave event function (line 103)
  // - SELLER
  // --- Redirect to tarif screen (line 91)
  // --- Function to become client and don't be seller anymore (line 97)
  // --- Leave event function (line 103)
  // - ORGANIZER
  // --- Redirect to edit event screen (line 112)
  // --- Redirect to edit tarif screen (line 117)
  // --- Cancel event function (line 122)

  return (
    <Screen style={styles.container}>
      {role != 2 && (
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Organisé par :</AppText>
          <AppText>{organizer}</AppText>
        </View>
      )}
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
        <AppText>
          {role === 0 ? "Client" : role === 1 ? "Vendeur" : "Organisateur"}
        </AppText>
      </View>
      <View style={styles.qrCodeJoinEventContainer}>
        <View style={styles.qrCode}>
          <QRCode value={eventId.toString()} size={150} />
        </View>
      </View>
      {role != 2 && (
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Voir le tarif"
            onPress={() => console.log("tarif")}
            style={{ marginVertical: 5 }}
          />
          {role === 1 && (
            <AppButton
              title="Ne plus être vendeur"
              onPress={() => console.log("ne plus être vendeur")}
              style={{ marginVertical: 5 }}
            />
          )}
          <AppButton
            title="Quitter l'évènement"
            onPress={() => console.log("quitter")}
            style={{ marginVertical: 5 }}
          />
        </View>
      )}
      {role === 2 && (
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Modifier l'évènement"
            onPress={() => console.log("modifier")}
            style={{ marginVertical: 5 }}
          />
          <AppButton
            title="Modifier le tarif"
            onPress={() => console.log("modifier le tarif")}
            style={{ marginVertical: 5 }}
          />
          <AppButton
            title="Annuler l'évènement"
            onPress={() => console.log("annuler")}
            style={{ marginVertical: 5 }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aligntems: "center",
    paddingHorizontal: 5,
    backgroundColor: colors.white,
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
    width: 175,
    height: 175,
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
});

export default UserSellerBeforeEventScreen;
