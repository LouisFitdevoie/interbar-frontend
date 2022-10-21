import React, { useContext, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import axios from "axios";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import editPasswordValidator from "../validators/editPassword.validator";
import colors from "../config/colors";
import AppText from "../components/AppText";
import { AuthContext } from "../auth/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import { BASE_URL } from "../api/config.api";

function EditPasswordScreen(props) {
  const { userAccessToken, user, isLoading, setIsLoading, logout } =
    useContext(AuthContext);
  const [passwordEditingError, setPasswordEditingError] = useState(null);

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%", marginBottom: 100 }}
        behavior="padding"
      >
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{
              oldPassword: "",
              newPassword: "",
              newPasswordConfirmation: "",
            }}
            onSubmit={(values) => console.log(values)}
            validationSchema={editPasswordValidator}
          >
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardApperance={colors.colorScheme}
              name="oldPassword"
              secureTextEntry
              textContentType="password"
              placeholder="Ancien mot de passe"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardApperance={colors.colorScheme}
              name="newPassword"
              secureTextEntry
              textContentType="password"
              placeholder="Nouveau mot de passe"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardApperance={colors.colorScheme}
              name="newPasswordConfirmation"
              secureTextEntry
              textContentType="password"
              placeholder="Confirmation du nouveau mot de passe"
            />
            <SubmitButton title="Modifier le mot de passe" />
            <ErrorMessage
              error={passwordEditingError}
              visible={passwordEditingError != null ? true : false}
            />
          </AppForm>
        </View>
      </KeyboardAvoidingView>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  dataUsageContainer: {
    flexDirection: "row",
  },
  dataUsageText: {
    color: colors.buttonPrimary,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  formContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    marginTop: 10,
    width: "100%",
  },
});

export default EditPasswordScreen;
