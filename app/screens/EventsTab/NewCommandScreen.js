import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ErrorMessage } from "../../components/forms";

function NewCommandScreen(props) {
  const { navigation } = props;
  const { eventId, role } = props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading } =
    useContext(AuthContext);
  const [error, setError] = useState(null);

  const [productsSold, setProductsSold] = useState([]);
  const [productsDisplayed, setProductsDisplayed] = useState(productsSold);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    eventProductAPI
      .getAllProductsAtEvent(eventId, userAccessToken)
      .then((res) => {
        setProductsSold(res.data);
        setProductsDisplayed(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError(
            "Impossible de récupérer le tarif de l'évènement, veuillez réessayer"
          );
        } else {
          console.log(err.response.data);
          setError("Une erreur est survenue");
        }
      });
  }, []);

  if (role === 0) {
    // Client -> pas besoin de choisir le nom du client
    return (
      <Screen style={styles.container}>
        <AppText>Client</AppText>
        <ErrorMessage error={error} visible={error != null} />
        {isLoading && <LoadingIndicator />}
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <AppText>{eventId}</AppText>
      <ErrorMessage error={error} visible={error != null} />
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
    padding: 10,
  },
});

export default NewCommandScreen;
