import React, { useContext, useState } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import AppText from "../components/AppText";
import registerValidator from "../validators/register.validator.js";
import { AuthContext } from "../auth/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import userAPI from "../api/user.api.js";

const backgroundImage =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/splashscreen-light.png")
    : require("../assets/splashscreen/splashscreen-dark.png");

function RegisterScreen({ navigation }) {
  const { login, isLoading, setIsLoading } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState(null);

  const headerHeight = Platform.OS === "android" ? useHeaderHeight() / 1.5 : 0;

  const handleSubmit = ({
    lastName,
    firstName,
    email,
    birthDate,
    password,
    passwordConfirmation,
  }) => {
    setRegisterError(null);
    setIsLoading(true);
    userAPI
      .register(
        email,
        firstName,
        lastName,
        password,
        passwordConfirmation,
        birthDate
      )
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          login(email, password);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setRegisterError("Impossible de communiquer avec le serveur");
          console.log(err);
        } else {
          const errMessage = err.response.data.error;
          if (errMessage.includes("already") && errMessage.includes("email")) {
            console.log(err.response.data.error);
            setRegisterError("L'adresse mail est déjà utilisée");
          } else if (
            errMessage.includes("already") &&
            errMessage.includes("name")
          ) {
            console.log(err.response.data.error);
            setRegisterError("Un compte utilisateur existe déjà pour ce nom");
          } else if (
            err.response.status === 400 &&
            errMessage.includes("birthday")
          ) {
            console.log(err.response.data.error);
            setRegisterError("La date de naissance est invalide");
          } else {
            setRegisterError("Une erreur est survenue");
            console.log(err);
          }
        }
      });
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Screen style={styles.container}>
        <KeyboardAwareScrollView
          style={[styles.scrollView, { marginTop: headerHeight }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <AppForm
              initialValues={{
                lastName: "",
                firstName: "",
                email: "",
                birthDate: "",
                password: "",
                passwordConfirmation: "",
              }}
              onSubmit={(values) => handleSubmit(values)}
              validationSchema={registerValidator}
            >
              <AppFormField
                autoCapitalize="words"
                autoCorrect={true}
                keyboardAppearance={colors.colorScheme}
                keyboardType="default"
                name="lastName"
                placeholder="Nom"
                registration
                textContentType="none"
              />
              <AppFormField
                autoCapitalize="words"
                autoCorrect={true}
                keyboardAppearance={colors.colorScheme}
                keyboardType="default"
                name="firstName"
                placeholder="Prénom"
                registration
                textContentType="none"
              />
              <AppFormField
                birthDate
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={colors.colorScheme}
                keyboardType="default"
                name="birthDate"
                placeholder="Date de naissance (JJ/MM/AAAA)"
                registration
                textContentType="none"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={colors.colorScheme}
                keyboardType="email-address"
                name="email"
                placeholder="Adresse email"
                registration
                textContentType="emailAddress"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={colors.colorScheme}
                name="password"
                placeholder="Mot de passe"
                registration
                secureTextEntry
                textContentType="password"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardAppearance={colors.colorScheme}
                name="passwordConfirmation"
                placeholder="Confirmation du mot de passe"
                registration
                secureTextEntry
                textContentType="password"
              />
              <SubmitButton title="Inscription" />
              <ErrorMessage
                error={registerError}
                visible={registerError != null ? true : false}
              />
            </AppForm>
            <TouchableOpacity
              onPress={() => navigation.navigate("DataUsage")}
              style={styles.dataUsageContainer}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={22}
                color={colors.buttonPrimary}
              />
              <AppText style={styles.dataUsageText}>
                Comment sont utilisées mes données ?
              </AppText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {isLoading && <LoadingIndicator />}
      </Screen>
    </ImageBackground>
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
    width: "100%",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
});

export default RegisterScreen;
