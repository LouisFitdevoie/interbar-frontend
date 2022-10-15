import React from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import AppText from "../components/AppText";

const backgroundImage =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/splashscreen-light.png")
    : require("../assets/splashscreen/splashscreen-dark.png");

const validationSchema = Yup.object().shape({
  lastName: Yup.string()
    .required("Le nom est requis")
    .min(1, "Le nom est requis"),
  firstName: Yup.string()
    .required("Le prénom est requis")
    .min(1, "Le prénom est requis"),
  email: Yup.string()
    .required("L'adresse email est requise")
    .email("L'adresse email est invalide"),
  birthDate: Yup.string()
    .required("La date de naissance est requise")
    .length(10, "La date de naissance doit être au format JJ/MM/AAAA"),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
  passwordConfirmation: Yup.string()
    .required("La confirmation du mot de passe est requise")
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    ),
});

function RegisterScreen(props) {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Screen style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
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
              onSubmit={(values) => console.log(values)}
              validationSchema={validationSchema}
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
            </AppForm>
            <TouchableOpacity
              onPress={() => console.log("To data usage informations")}
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
