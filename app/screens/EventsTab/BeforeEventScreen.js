import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ErrorMessage } from "../../components/forms";
import userEventAPI from "../../api/userEvent.api";
import eventAPI from "../../api/event.api";

function BeforeEventScreen({
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
  const [qrcodeRef, setQrcodeRef] = useState(null);
  const [qrcodeURL, setQrcodeURL] = useState(null);
  const getDataURL = () => {
    if (qrcodeRef) {
      qrcodeRef.toDataURL((dataURL) => {
        setQrcodeURL(dataURL);
      });
    }
  };

  useEffect(() => {
    getDataURL();
  }, [qrcodeRef, qrcodeURL]);

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

  const handleCancelEvent = () => {
    Alert.alert(
      "Annuler l'évènement",
      "Êtes-vous sûr de vouloir annuler l'évènement ?\n Si vous changez d'avis, vous devrez recréer un nouvel évènement",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: () => {
            setError(null);
            setIsLoading(true);
            eventAPI
              .deleteEvent(eventId, userAccessToken)
              .then((res) => {
                setIsLoading(false);
                if (res.data.success != null) {
                  Alert.alert("Succés", "L'événement a été annulé");
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
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Screen style={styles.container} version="scroll">
      <ScrollView style={styles.scroll}>
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
            <AppText numberOfLines={1} style={styles.description}>
              {description}
            </AppText>
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
            <QRCode
              value={eventId.toString()}
              size={150}
              getRef={(ref) => setQrcodeRef(ref)}
            />
          </View>
        </View>
        {role != 2 && (
          <View style={styles.buttonsContainer}>
            <AppButton
              title="Voir le tarif"
              onPress={() =>
                navigation.navigate("Tarif", {
                  eventId,
                  qrCodeData: qrcodeURL,
                })
              }
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
                onPress={() => navigation.navigate("UserToSeller", { eventId })}
                style={{ marginVertical: 5 }}
              />
            )}
            <AppButton
              title="Quitter l'évènement"
              onPress={() =>
                Alert.alert(
                  "Quitter l'évènement",
                  "Êtes-vous sûr de vouloir quitter l'évènement ?\nVous pourrez toujours le rejoindre après si vous le souhaitez",
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
              onPress={() => navigation.navigate("EditEvent", { eventId })}
              style={{ marginVertical: 5 }}
            />
            <AppButton
              title="Modifier le tarif"
              onPress={() =>
                navigation.navigate("EditPriceList", {
                  eventId,
                  isEditing: true,
                  qrCodeData: qrcodeURL,
                })
              }
              style={{ marginVertical: 5 }}
            />
            <AppButton
              title="Annuler l'évènement"
              onPress={() => handleCancelEvent()}
              style={{ marginVertical: 5 }}
            />
            <ErrorMessage error={error} visible={error != null} />
          </View>
        )}
        {isLoading && <LoadingIndicator />}
      </ScrollView>
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
  description: {
    flex: 1,
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
  scroll: {
    flex: 1,
    paddingHorizontal: 5,
  },
});

export default BeforeEventScreen;
