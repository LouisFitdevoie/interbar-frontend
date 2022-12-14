import React, { useState, useContext, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
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
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function JoinEventDetailsScreen(props) {
  const { navigation } = props;
  const { event } = props.route.params;
  const { isLoading, setIsLoading, userAccessToken, user, updateAccessToken } =
    useContext(AuthContext);

  const screenWidth = Dimensions.get("window").width;

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const eventDetails = {
    name: event.name,
    startDate: new Date(event.startdate).toLocaleString("fr-BE", {
      year: screenWidth > 375 ? "numeric" : "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    endDate: new Date(event.enddate).toLocaleString("fr-BE", {
      year: screenWidth > 375 ? "numeric" : "2-digit",
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
    setJoinEventError(null);
    if (sellerPassword != "" && isSellerVisible) {
      userEventAPI
        .sellerJoinEvent(event.id, user.id, sellerPassword, userAccessToken)
        .then((res) => {
          setIsLoading(false);
          if (res.data.success != null) {
            navigation.goBack();
            navigation.navigate("Home");
            Alert.alert(
              "Succ??s",
              "Vous avez rejoint l'??v??nement en tant que vendeur"
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
              setJoinEventError("Vous participez d??j?? ?? cet ??v??nement");
            } else if (
              err.response.status === 400 &&
              errMessage.includes("ended")
            ) {
              setJoinEventError(
                "L'??v??nement est termin??, vous ne pouvez plus le rejoindre"
              );
            } else if (
              err.response.status === 400 &&
              errMessage.includes("password")
            ) {
              setJoinEventError("Le mot de passe vendeur fourni est incorrect");
            } else if (err.response.status === 403) {
              updateAccessToken();
              setJoinEventError(
                "Erreur lors de la cr??ation de l'??v??nement, veuillez r??essayer"
              );
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
            navigation.navigate("Home");
            Alert.alert("Succ??s", "Vous avez rejoint l'??v??nement");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setJoinEventError("Impossible de communiquer avec le serveur");
          } else {
            const errMessage = err.response.data.error;
            if (err.response.status === 400 && errMessage.includes("already")) {
              setJoinEventError("Vous participez d??j?? ?? cet ??v??nement");
            } else if (err.response.status === 403) {
              updateAccessToken();
              setJoinEventError(
                "Erreur lors de la cr??ation de l'??v??nement, veuillez r??essayer"
              );
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
        Voulez-vous vraiment rejoindre l'??v??nement suivant ?
      </AppText>
      <View style={styles.detailsContainer}>
        <View style={styles.textDetailContainer}>
          <AppText style={styles.title}>Nom de l'??v??nement :</AppText>
          <AppText style={styles.detail} numberOfLines={1} ellipsizeMode="tail">
            {eventDetails.name}
          </AppText>
        </View>
        <View style={styles.textDetailContainer}>
          <AppText style={styles.title}>Organis?? par :</AppText>
          <AppText style={styles.detail} numberOfLines={1} ellipsizeMode="tail">
            {eventDetails.organizer}
          </AppText>
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
        {eventDetails.description !== null && (
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
              title="Rejoindre l'??v??nement"
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
              <SubmitButton title="Rejoindre l'??v??nement" />
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
  detail: { paddingHorizontal: 5, flex: 1 },
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
