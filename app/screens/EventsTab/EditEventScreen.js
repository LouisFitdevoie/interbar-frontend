import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { AuthContext } from "../../auth/AuthContext";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import eventAPI from "../../api/event.api";
import AppText from "../../components/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AppForm,
  AppFormField,
  AppDateTimePicker,
  SubmitButton,
  ErrorMessage,
} from "../../components/forms";
import editEventValidator from "../../validators/editEvent.validator.js";
import LoadingIndicator from "../../components/LoadingIndicator";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function EditEventScreen(props) {
  const { navigation } = props;
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);
  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [hasData, setHasData] = useState(false);

  const { eventId } = props.route.params;

  const getEventData = () => {
    setIsLoading(true);
    eventAPI
      .getEventById(eventId, userAccessToken)
      .then((res) => {
        if (res.data) {
          setIsLoading(false);
          const eventData = res.data;
          if (new Date() >= eventData.startDate) {
            Alert.alert(
              "Erreur",
              "Vous ne pouvez pas modifier un événement qui a déjà commencé, vous allez être redirigé."
            );
            navigation.goBack();
          } else {
            setEventData(eventData);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          Alert.alert("Une erreur est survenue, veuillez réessayer");
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      });
  };

  const handleSubmit = ({
    name,
    startDate,
    endDate,
    location,
    description,
  }) => {
    setError(null);
    setIsLoading(true);
    eventAPI
      .editEvent(
        eventId,
        name,
        startDate,
        endDate,
        location,
        description,
        userAccessToken
      )
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          Alert.alert("Succès", "L'événement a bien été modifié");
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(err.response.data.error);
          }
        }
      });
  };

  useEffect(() => {
    if (eventData === null) {
      setHasData(false);
      getEventData();
    } else {
      setHasData(true);
    }
  }, [eventData]);

  return (
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
        {hasData && (
          <KeyboardAwareScrollView style={styles.scrollView}>
            <AppForm
              initialValues={{
                name: eventData.name,
                startDate: new Date(eventData.startdate),
                endDate: new Date(eventData.enddate),
                location: eventData.location,
                description: eventData.description,
              }}
              onSubmit={(values) => handleSubmit(values)}
              validationSchema={editEventValidator}
            >
              <AppFormField
                autoCapitalize="words"
                autoCorrect={true}
                keyboardAppearance={colors.colorScheme}
                keyboardType="default"
                name="name"
                placeholder="Nom de l'événement"
                textContentType="none"
              />
              <AppDateTimePicker
                containerStyle={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}
                label="Date de début :"
                mode="datetime"
                name="startDate"
                minimumDate={new Date()}
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
              <SubmitButton title="Modifier l'événement" />
              <ErrorMessage error={error} visible={error != null} />
            </AppForm>
          </KeyboardAwareScrollView>
        )}
      </View>
      {(isLoading || !hasData) && <LoadingIndicator />}
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

export default EditEventScreen;
