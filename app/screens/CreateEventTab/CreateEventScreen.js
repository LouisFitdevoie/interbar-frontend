import React, { useContext, useState, useLayoutEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import createEventValidator from "../../validators/createEvent.validator.js";
import AppDateTimePicker from "../../components/forms/AppDateTimePicker";
import LoadingIndicator from "../../components/LoadingIndicator";
import { AuthContext } from "../../auth/AuthContext";
import eventAPI from "../../api/event.api";
import userEventAPI from "../../api/userEvent.api";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function CreateEventScreen({ navigation }) {
  const { isLoading, setIsLoading, userAccessToken, user, updateAccessToken } =
    useContext(AuthContext);
  const [createEventError, setCreateEventError] = useState(null);

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const handleSubmit = ({
    name,
    startDate,
    endDate,
    location,
    description,
    sellerPassword,
    sellerPasswordConfirmation,
  }) => {
    setCreateEventError(null);
    setIsLoading(true);
    eventAPI
      .createEvent(
        name,
        startDate,
        endDate,
        location,
        description,
        sellerPassword,
        userAccessToken
      )
      .then((res) => {
        if (res.data.success != null) {
          const eventCreatedId = res.data.eventId;
          userEventAPI
            .userCreateEvent(eventCreatedId, user.id, userAccessToken)
            .then((res) => {
              setIsLoading(false);
              if (res.data.success != null) {
                navigation.navigate("CreatePriceList", {
                  eventId: eventCreatedId,
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              if (err.response === undefined) {
                setCreateEventError(
                  "Impossible de communiquer avec le serveur"
                );
                console.log(err);
              } else {
                const errMessage = err.response.data.error;
                if (err.response.status === 400) {
                  setCreateEventError("Une erreur est survenue");
                } else if (err.response.status === 403) {
                  updateAccessToken();
                  setCreateEventError(
                    "Erreur lors de la cr??ation de l'??v??nement, veuillez r??essayer"
                  );
                } else {
                  setCreateEventError(errMessage);
                }
              }
            });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setCreateEventError("Impossible de communiquer avec le serveur");
          console.log(err);
        } else {
          const errMessage = err.response.data.error;
          if (err.response.status === 400) {
            setCreateEventError(
              "Un ??v??nement avec ce nom existe d??j?? pour les dates et l'adresse sp??cifi??es !"
            );
            console.log(errMessage);
          } else if (err.response.status === 403) {
            updateAccessToken();
            setCreateEventError(
              "Erreur lors de la cr??ation de l'??v??nement, veuillez r??essayer"
            );
          } else {
            setCreateEventError("Une erreur est survenue");
            console.log(errMessage);
          }
        }
      });
  };

  return (
    <Screen style={styles.container} version="scroll">
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <AppForm
            initialValues={{
              name: "",
              startDate: new Date(),
              endDate: new Date(),
              location: "",
              description: "",
              sellerPassword: "",
              sellerPasswordConfirmation: "",
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={createEventValidator}
          >
            <AppFormField
              autoCapitalize="words"
              autoCorrect={true}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="name"
              placeholder="Nom de l'??v??nement"
              textContentType="none"
            />
            <AppDateTimePicker
              containerStyle={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}
              label="Date de d??but :"
              mode="datetime"
              name="startDate"
            />
            <AppDateTimePicker
              containerStyle={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}
              label="Date de fin :"
              mode="datetime"
              name="endDate"
            />
            <AppFormField
              autoCapitalize="sentences"
              autoCorrect={true}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="location"
              placeholder="Adresse"
              textContentType="none"
            />
            <AppFormField
              autoCapitalize="sentences"
              autoCorrect={true}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="description"
              placeholder="Description (facultatif)"
              textContentType="none"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="sellerPassword"
              placeholder="Mot de passe d'acc??s vendeur"
              textContentType="password"
              secureTextEntry
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="sellerPasswordConfirmation"
              placeholder="Confirmation du mot de passe d'acc??s vendeur"
              textContentType="password"
              secureTextEntry
            />
            <SubmitButton title="Cr??er l'??v??nement" />
            <ErrorMessage
              error={createEventError}
              visible={createEventError != null ? true : false}
            />
          </AppForm>
        </KeyboardAwareScrollView>
        {isLoading && <LoadingIndicator />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    width: "100%",
  },
  dateTimePicker: {
    flex: 1,
  },
  dateTimePickerView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  formContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  text: {
    color: colors.primary,
  },
});

export default CreateEventScreen;
