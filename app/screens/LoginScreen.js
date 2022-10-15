import React, { useContext } from "react";
import {
  Image,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import LoadingIndicator from "../components/LoadingIndicator";
import AppText from "../components/AppText";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import { AuthContext } from "../auth/AuthContext";
import loginValidator from "../validators/login.validator";

const backgroundImage =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/splashscreen-light.png")
    : require("../assets/splashscreen/splashscreen-dark.png");
const logo =
  colors.colorScheme === "light"
    ? require("../assets/splashscreen/logo-light.png")
    : require("../assets/splashscreen/logo-dark.png");

function LoginScreen({ navigation }) {
  const { login, isLoading, error } = useContext(AuthContext);

  const handleSubmit = ({ email, password }) => {
    login(email, password);
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
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%", marginBottom: 100 }}
          behavior="padding"
        >
          <View style={styles.formContainer}>
            <AppForm
              initialValues={{ email: "", password: "" }}
              onSubmit={(values) => handleSubmit(values)}
              validationSchema={loginValidator}
            >
              <ErrorMessage
                error="Email ou mot de passe incorrect"
                visible={error}
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
        </KeyboardAvoidingView>
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
  formContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
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
