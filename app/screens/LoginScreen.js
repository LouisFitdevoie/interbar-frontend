import React from "react";
import { Image, ImageBackground, View, StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("L'adresse email est requise")
    .email("L'adresse email est invalide"),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
});

function LoginScreen(props) {
  return (
    <ImageBackground
      source={require("../assets/splashscreen/splashscreen-light.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Screen style={styles.container}>
        <View style={styles.logoView}>
          <Image
            source={require("../assets/splashscreen/logo-light.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
          <ErrorMessage
            error="Invalid email and/or password."
            visible={false}
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
          <SubmitButton title="Connexion" />
        </AppForm>
        <View style={styles.registerContainer}>
          <AppText style={styles.register}>
            Vous n'avez pas encore de compte ?
          </AppText>
          <AppText style={styles.registerBtn}>Créer un compte</AppText>
        </View>
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
  form: {
    backgroundColor: colors.white,
  },
  logo: {
    height: "100%",
    width: "100%",
  },
  logoView: {
    position: "absolute",
    top: 75,
    alignItems: "center",
    justifyContent: "center",
    height: "9%",
    width: "85%",
  },
  register: {
    fontSize: 14,
    color: colors.white,
  },
  registerBtn: {
    fontSize: 14,
    color: colors.primaryLight,
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default LoginScreen;
