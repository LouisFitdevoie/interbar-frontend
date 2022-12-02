import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../../components/Screen";
import eventProductAPI from "../../api/eventProduct.api";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import TarifDisplayItem from "../../components/lists/TarifDisplayItem";
import AppButton from "../../components/AppButton";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function TarifScreen(props) {
  const { isLoading, setIsLoading, updateAccessToken, userAccessToken } =
    useContext(AuthContext);
  const isFocused = useIsFocused();
  const { eventId } = props.route.params;
  const { navigation } = props;

  const [error, setError] = useState(null);
  const [tarifItems, setTarifItems] = useState([]);

  //TODO: add the ability to generate a PDF with the tarif

  const getTarif = () => {
    setIsLoading(true);
    setError(null);
    eventProductAPI
      .getAllProductsAtEvent(eventId, userAccessToken)
      .then((res) => {
        setTarifItems(res.data);
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
  };

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  useEffect(() => {
    getTarif();
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      {tarifItems.length > 0 && (
        <FlatList
          data={tarifItems}
          keyExtractor={(item) => item.events_products_id.toString()}
          renderItem={({ item }) => (
            <TarifDisplayItem
              name={item.name}
              sellingPrice={item.sellingPrice}
              stock={item.stock}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      {tarifItems.length === 0 && (
        <View style={styles.noTarifContainer}>
          <AppText style={styles.noTarifText}>
            Aucun tarif n'a été défini pour cet évènement
          </AppText>
        </View>
      )}
      {error != null && (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorMessage}>{error}</AppText>
          <AppButton title="Réessayer" onPress={getTarif()} />
        </View>
      )}
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  errorContainer: {
    width: "100%",
  },
  errorMessage: {
    fontSize: 18,
    textAlign: "center",
  },
  noTarifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTarifText: {
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: colors.light,
  },
});

export default TarifScreen;
