import React, { useContext } from "react";
import {
  Image,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import { AuthContext } from "../auth/AuthContext";

const backgroundImage =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/splashscreen-light.png")
    : require("../assets/splashscreen/splashscreen-dark.png");
const logo =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/logo-light.png")
    : require("../assets/splashscreen/logo-dark.png");

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("L'adresse email est requise")
    .email("L'adresse email est invalide"),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
});

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const handleSubmit = (values) => {
    console.log(values);
    login();
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Screen style={styles.container}>
        <View style={styles.logoView}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => handleSubmit(values)}
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
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <AppText style={styles.registerBtn}>Créer un compte</AppText>
            </TouchableOpacity>
          </View>
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
  formContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    marginBottom: 100,
    width: "100%",
  },
  logo: {
    height: "100%",
    width: "100%",
  },
  logoView: {
    alignItems: "center",
    height: "9%",
    justifyContent: "center",
    position: "absolute",
    top: 75,
    width: "85%",
  },
  register: {
    color: colors.white,
    fontSize: 14,
  },
  registerBtn: {
    color: colors.buttonPrimary,
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  registerContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});

export default LoginScreen;
