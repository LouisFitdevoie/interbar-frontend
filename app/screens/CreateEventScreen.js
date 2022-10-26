import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";

import AppText from "../components/AppText";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import colors from "../config/colors";
import createEventValidator from "../validators/createEvent.validator.js";
import AppDateTimePicker from "../components/forms/AppDateTimePicker";

function CreateEventScreen(props) {
  const [createEventError, setCreateEventError] = useState(null);

  return (
    <Screen style={styles.container}>
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
            onSubmit={(values) => console.log(values)}
            validationSchema={createEventValidator}
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
              placeholder="Mot de passe d'accès vendeur"
              textContentType="password"
              secureTextEntry
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="sellerPasswordConfirmation"
              placeholder="Confirmation du mot de passe d'accès vendeur"
              textContentType="password"
              secureTextEntry
            />
            <SubmitButton title="Créer l'événement" />
            <ErrorMessage
              error={createEventError}
              visible={createEventError != null ? true : false}
            />
          </AppForm>
        </KeyboardAwareScrollView>
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
