import React, { useContext, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";

import { AuthContext } from "../../auth/AuthContext";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from "../../components/forms";
import colors from "../../config/colors";
import editPasswordValidator from "../../validators/editPassword.validator";
import Screen from "../../components/Screen";
import LoadingIndicator from "../../components/LoadingIndicator";
import userAPI from "../../api/user.api";

function EditPasswordScreen(props) {
  const { userAccessToken, user, isLoading, setIsLoading, logout } =
    useContext(AuthContext);
  const [passwordEditingError, setPasswordEditingError] = useState(null);

  const handleSubmit = ({
    oldPassword,
    newPassword,
    newPasswordConfirmation,
  }) => {
    setPasswordEditingError(null);
    Alert.alert(
      "Voulez-vous vraiment modifier votre mot de passe ?",
      "Vous serez déconnecté si vous acceptez",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Modifier",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            userAPI
              .editPassword(
                user.id,
                oldPassword,
                newPassword,
                newPasswordConfirmation,
                userAccessToken
              )
              .then((res) => {
                if (res.data.success) {
                  setIsLoading(false);
                  logout();
                } else {
                  setIsLoading(false);
                  setPasswordEditingError(res.data.message);
                }
              })
              .catch((err) => {
                setIsLoading(false);
                if (err.response === undefined) {
                  setPasswordEditingError(
                    "Impossible de communiquer avec le serveur"
                  );
                } else if (err.response.status === 404) {
                  setPasswordEditingError("Utilisateur non trouvé");
                } else {
                  setPasswordEditingError("Une erreur est survenue");
                }
              });
          },
        },
      ]
    );
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{
              oldPassword: "",
              newPassword: "",
              newPasswordConfirmation: "",
            }}
            onSubmit={(values) => handleSubmit(values)}
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
  avoidingView: {
    flex: 1,
    marginBottom: 100,
    width: "95%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
