import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../../components/AppText";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import sellerPasswordValidator from "../../validators/sellerPassword.validator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { AuthContext } from "../../auth/AuthContext";
import userEventAPI from "../../api/userEvent.api";

function JoinEventDetailsScreen(props) {
  const { navigation } = props;
  const { event } = props.route.params;
  const { isLoading, setIsLoading, userAccessToken, user } =
    useContext(AuthContext);

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

  const [isSellerVisible, setIsSellerVisible] = useState(false);
  const [joinEventError, setJoinEventError] = useState(null);

  const handleJoinEvent = (sellerPassword) => {
    setIsLoading(true);
    if (sellerPassword != "" && isSellerVisible) {
      userEventAPI
        .sellerJoinEvent(event.id, user.id, sellerPassword, userAccessToken)
        .then((res) => {
          setIsLoading(false);
          if (res.data.success != null) {
            navigation.goBack();
            navigation.navigate("Events");
            Alert.alert(
              "Succès",
              "Vous avez rejoint l'évènement en tant que vendeur"
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setJoinEventError("Impossible de communiquer avec le serveur");
          } else {
            const errMessage = err.response.data.error;
            if (err.response.status === 400 && errMessage.includes("already")) {
              setJoinEventError("Vous participez déjà à cet événement");
            } else if (
              err.response.status === 400 &&
              errMessage.includes("password")
            ) {
              setJoinEventError("Le mot de passe vendeur fourni est incorrect");
            } else {
              console.log(err.response.data.error);
              setJoinEventError("Une erreur est survenue");
            }
          }
        });
    } else {
      setIsLoading(true);
      userEventAPI
        .userJoinEvent(event.id, user.id, userAccessToken)
        .then((res) => {
          setIsLoading(false);
          if (res.data.success != null) {
            navigation.goBack();
            navigation.navigate("Events");
            Alert.alert("Succès", "Vous avez rejoint l'évènement");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setJoinEventError("Impossible de communiquer avec le serveur");
          } else {
            const errMessage = err.response.data.error;
            if (err.response.status === 400 && errMessage.includes("already")) {
              setJoinEventError("Vous participez déjà à cet événement");
            } else {
              console.log(err.response.data.error);
              setJoinEventError("Une erreur est survenue");
            }
          }
        });
    }
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
        <View style={styles.sellerButtonContainer}>
          <TouchableOpacity
            style={styles.sellerButton}
            onPress={() => setIsSellerVisible(!isSellerVisible)}
          >
            <AppText style={styles.sellerButtonText}>
              Serez-vous vendeur ?
            </AppText>
            <MaterialCommunityIcons
              name={
                isSellerVisible ? "checkbox-outline" : "checkbox-blank-outline"
              }
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        {!isSellerVisible && (
          <View>
            <AppButton
              title="Rejoindre l'évènement"
              onPress={() => handleJoinEvent("")}
            />
            <ErrorMessage
              error={joinEventError}
              visible={joinEventError != null}
            />
          </View>
        )}
        {isSellerVisible && (
          <View style={styles.sellerFormContainer}>
            <AppForm
              initialValues={{
                sellerPassword: "",
              }}
              onSubmit={(values) => handleJoinEvent(values.sellerPassword)}
              validationSchema={sellerPasswordValidator}
            >
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={colors.colorScheme}
                name="sellerPassword"
                placeholder="Mot de passe vendeur"
                secureTextEntry
              />
              <SubmitButton title="Rejoindre l'évènement" />
              <ErrorMessage
                error={joinEventError}
                visible={joinEventError != null}
              />
            </AppForm>
          </View>
        )}
      </View>
      {isLoading && <LoadingIndicator />}
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
  sellerButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  sellerButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sellerButtonText: {
    color: colors.primary,
    fontWeight: "bold",
    paddingRight: 5,
  },
  textDetailContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  title: {
    color: colors.primary,
  },
});

export default JoinEventDetailsScreen;
