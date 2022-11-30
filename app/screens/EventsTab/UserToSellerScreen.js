import React, { useState, useContext, useLayoutEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";

import Screen from "../../components/Screen";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import userEventAPI from "../../api/userEvent.api";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function UserToSellerScreen(props) {
  const { eventId } = props.route.params;
  const { navigation } = props;
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken, user } =
    useContext(AuthContext);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const handleSubmit = ({ sellerPassword }) => {
    setError(null);
    setIsLoading(true);
    userEventAPI
      .fromUserToSeller(eventId, user.id, sellerPassword, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          Alert.alert(
            "Succés",
            "Vous êtes désormais vendeur pour cet évènement !"
          );
          navigation.navigate("Home");
        } else {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError("Une erreur est survenue, veuillez réessayer");
        } else if (
          err.response.status === 400 &&
          err.response.data.error.includes("incorrect")
        ) {
          setError("Mot de passe vendeur incorrect");
        } else {
          setError("Une erreur est survenue");
        }
      });
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{
            sellerPassword: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
        >
          <AppFormField
            name="sellerPassword"
            placeholder="Mot de passe vendeur"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType="password"
            keyboardType="default"
          />
          <SubmitButton title="Devenir vendeur" />
          <ErrorMessage error={error} visible={error != null} />
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

export default UserToSellerScreen;
