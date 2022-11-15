import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ErrorMessage } from "../../components/forms";
import userEventAPI from "../../api/userEvent.api";

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
  const { userAccessToken, user, isLoading, setIsLoading, updateAccessToken } =
    useContext(AuthContext);

  const [error, setError] = useState(null);

  const handleLeaveEvent = () => {
    setError(null);
    setIsLoading(true);
    userEventAPI
      .leaveEvent(eventId, user.id, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          Alert.alert("Succés", "Vous avez quitté l'événement");
          navigation.navigate("Home");
        } else {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError("Une erreur est survenue, veuillez réessayer");
        } else {
          setError("Une erreur est survenue");
        }
      });
  };

  const fromSellerToUser = () => {
    setError(null);
    setIsLoading(true);
    userEventAPI
      .fromSellerToUser(eventId, user.id, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          Alert.alert("Succés", "Vous n'êtes plus vendeur pour cet événement");
          navigation.navigate("Home");
        } else {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError("Une erreur est survenue, veuillez réessayer");
        } else {
          setError("Une erreur est survenue");
        }
      });
  };

  //TODO :
  // - USER
  // --- Redirect to tarif screen (line 91)
  // --- Function to become seller
  // --- Leave event function (line 103) -> DONE
  // - SELLER
  // --- Redirect to tarif screen (line 91)
  // --- Function to become client and don't be seller anymore (line 97)
  // --- Leave event function (line 103) -> DONE
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
              onPress={() =>
                Alert.alert(
                  "Ne plus être vendeur",
                  "Êtes-vous sûr de ne plus vouloir être vendeur ?",
                  [
                    {
                      text: "Annuler",
                      style: "cancel",
                    },
                    {
                      text: "Confirmer",
                      onPress: () => fromSellerToUser(),
                      style: "destructive",
                    },
                  ]
                )
              }
              style={{ marginVertical: 5 }}
            />
          )}
          {role === 0 && (
            <AppButton
              title="Devenir vendeur"
              onPress={() => console.log("devenir vendeur")}
              style={{ marginVertical: 5 }}
            />
          )}
          <AppButton
            title="Quitter l'évènement"
            onPress={() =>
              Alert.alert(
                "Quitter l'évènement",
                "Êtes-vous sûr de vouloir quitter l'évènement ? Vous pourrez toujours le rejoindre après si vous le souhaitez",
                [
                  {
                    text: "Annuler",
                    style: "cancel",
                  },
                  {
                    text: "Quitter",
                    onPress: () => handleLeaveEvent(),
                    style: "destructive",
                  },
                ]
              )
            }
            style={{ marginVertical: 5 }}
          />
          <ErrorMessage error={error} visible={error != null} />
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
          <ErrorMessage error={error} visible={error != null} />
        </View>
      )}
      {isLoading && <LoadingIndicator />}
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
