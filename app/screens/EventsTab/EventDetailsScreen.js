import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import eventAPI from "../../api/event.api";
import ErrorMessage from "../../components/forms/ErrorMessage";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function EventDetailsScreen(props) {
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading } =
    useContext(AuthContext);
  const [error, setError] = useState(null);
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  useLayoutEffect(() => {
    tabBarDisplayManager.displayTabBar(navigation, insets);
  }, []);
  const {
    organizer,
    startDate,
    endDate,
    location,
    description,
    role,
    eventId,
    name,
    createdAt,
  } = props.route.params;

  const eventStartDate = new Date(startDate);
  const eventEndDate = new Date(endDate);
  const today = new Date();

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="information"
            size={30}
            color="white"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  //TODO:
  // - ORGANIZER
  //TODO --- Redirect to stats screen (line 110)

  const endEvent = () => {
    setError(null);
    setIsLoading(true);
    eventAPI
      .endEvent(eventId, userAccessToken)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          Alert.alert("L'évènement a bien été terminé");
          navigation.navigate("Home");
        } else {
          setError("Une erreur est survenue, veuillez réeessayer");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
          console.log(error);
        } else {
          if (error.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réeessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(error.response.data.error);
          }
        }
      });
  };

  return (
    <Screen style={styles.container}>
      {(role === 0 || role === 1) && (
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>Organisé par :</AppText>
          <AppText>{organizer}</AppText>
        </View>
      )}
      <View style={styles.detailContainer}>
        <AppText style={styles.title}>Date de début :</AppText>
        <AppText>
          {eventStartDate.toLocaleDateString("fr-BE", {
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
          {eventEndDate.toLocaleDateString("fr-BE", {
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
      <View style={styles.qrCodeContainer}>
        <QRCode value={eventId} size={150} />
      </View>
      {role === 2 && (
        <View style={styles.buttonsContainer}>
          <AppButton
            title="Statistiques"
            onPress={() => console.log("Stats")}
            style={{ marginVertical: 5 }}
          />
          <AppButton
            title="Changer l'heure de fin"
            onPress={() =>
              navigation.navigate("EditEventEndDate", props.route.params)
            }
            style={{ marginVertical: 5 }}
          />
          <AppButton
            title={
              today < eventStartDate
                ? "Annuler l'évènement"
                : eventEndDate <= today
                ? "Supprimer l'évènement"
                : "Terminer l'évènement"
            }
            onPress={() => {
              if (today < eventStartDate) {
                console.log("Cancel");
              } else if (eventEndDate <= today) {
                console.log("Delete");
              } else {
                endEvent();
              }
            }}
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
  qrCodeContainer: {
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

export default EventDetailsScreen;
