import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";

import Screen from "../../components/Screen";
import { AppForm, ErrorMessage, SubmitButton } from "../../components/forms";
import AppDateTimePicker from "../../components/forms/AppDateTimePicker";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import eventAPI from "../../api/event.api";

function EditEventEndDateScreen(props) {
  const { startDate, endDate, eventId } = props.route.params;
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);
  const [editEventEndDateError, setEditEventEndDateError] = useState(null);

  const handleSubmit = ({ newEndDate }) => {
    setEditEventEndDateError(null);
    setIsLoading(true);
    eventAPI
      .editEventEndDate(eventId, newEndDate, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          Alert.alert("Succès", "La date de fin de l'événement a été modifiée");
          props.navigation.navigate("Home");
        } else {
          setEditEventEndDateError(res.data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setEditEventEndDateError("Impossible de communiquer avec le serveur");
          console.log(err);
        } else {
          if (err.response.status === 403) {
            updateAccessToken();
            setEditEventEndDateError(
              "Une erreur est survenue, veuillez réessayer"
            );
          } else {
            setEditEventEndDateError("Une erreur est survenue");
            console.log(err.response.data.error);
          }
        }
      });
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{
            newEndDate: new Date(endDate),
          }}
          onSubmit={(values) => handleSubmit(values)}
        >
          <AppDateTimePicker
            containerStyle={{ marginTop: Platform.OS === "ios" ? 10 : 0 }}
            label="Date de fin :"
            mode="datetime"
            name="newEndDate"
            minimumDate={
              new Date() <= new Date(startDate)
                ? new Date(startDate)
                : new Date()
            }
          />
          <SubmitButton title="Modifier la date de fin" />
          <ErrorMessage
            error={editEventEndDateError}
            visible={editEventEndDateError != null}
          />
        </AppForm>
      </View>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  formContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default EditEventEndDateScreen;
