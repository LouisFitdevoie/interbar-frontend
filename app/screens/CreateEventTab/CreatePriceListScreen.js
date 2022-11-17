import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../../components/Screen";
import TarifCreationItem from "../../components/lists/TarifCreationItem";
import ListSeparator from "../../components/lists/ListSeparator";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import AppText from "../../components/AppText";
import LoadingIndicator from "../../components/LoadingIndicator";
import TarifItemDeleteAction from "../../components/lists/TarifItemDeleteAction";
import ErrorMessage from "../../components/forms/ErrorMessage";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function CreatePriceListScreen(props) {
  const isFocused = useIsFocused();
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);

  const eventId = props.route.params.eventId;
  const isEditing = props.route.params.isEditing != null;
  const [eventProducts, setEventProducts] = useState([]);
  const { navigation } = props;
  const [deleteError, setDeleteError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [errorGettingEventProducts, setErrorGettingEventProducts] =
    useState(null);

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const getAllEventProducts = (eventId) => {
    setIsLoading(true);
    setErrorGettingEventProducts(null);
    eventProductAPI
      .getAllProductsAtEvent(eventId, userAccessToken)
      .then((res) => {
        setEventProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setErrorGettingEventProducts(
            "Impossible de récupérer les produits ajoutés à l'évènement, veuillez réessayer"
          );
        }
      });
  };

  const deleteEventProduct = (eventProductId) => {
    setDeleteError(null);
    setIsLoading(true);
    eventProductAPI
      .deleteEventProduct(eventProductId, userAccessToken)
      .then((res) => {
        getAllEventProducts(eventId);
      })
      .catch((err) => {
        setDeleteError(
          "Une erreur est survenue lors de la suppression du produit du tarif de cet évènement. Veuillez réessayer."
        );
        if (err.response.status === 403) {
          updateAccessToken();
        }
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    isFocused && getAllEventProducts(eventId);
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      {eventProducts.length > 0 && errorGettingEventProducts === null && (
        <FlatList
          data={eventProducts}
          keyExtractor={(item) => item.events_products_id.toString()}
          ItemSeparatorComponent={() => <ListSeparator />}
          refreshing={refreshing}
          onRefresh={() => getAllEventProducts(eventId)}
          renderItem={({ item }) => (
            <TarifCreationItem
              name={item.name}
              category={item.category}
              description={item.description}
              buyingPrice={item.buyingPrice}
              sellingPrice={item.sellingPrice}
              stock={item.stock}
              onPress={() =>
                navigation.navigate("EditEventProduct", {
                  eventId,
                  eventProductId: item.events_products_id,
                  name: item.name,
                  category: item.category,
                  buyingPrice: item.buyingPrice,
                  sellingPrice: item.sellingPrice,
                  stock: item.stock,
                  isEditing,
                })
              }
              renderRightActions={() => (
                <TarifItemDeleteAction
                  onPress={() => {
                    Alert.alert(
                      "Suppression",
                      "Voulez-vous vraiment supprimer ce produit du tarif de cet évènement ?",
                      [
                        {
                          text: "Annuler",
                          style: "cancel",
                        },
                        {
                          text: "Supprimer",
                          onPress: () =>
                            deleteEventProduct(item.events_products_id),
                          style: "destructive",
                        },
                      ]
                    );
                  }}
                />
              )}
            />
          )}
          style={styles.list}
        />
      )}
      {eventProducts.length === 0 && errorGettingEventProducts === null && (
        <View style={styles.noEventProducts}>
          <AppText style={{ textAlign: "center" }}>
            Aucun produit n'a encore été ajouté au tarif de l'évènement
          </AppText>
        </View>
      )}
      {errorGettingEventProducts === null && (
        <View style={styles.buttonContainer}>
          <AppButton
            title="Ajouter un produit"
            onPress={() =>
              navigation.navigate("AddProductTarif", { eventId, isEditing })
            }
            style={{ marginBottom: 5 }}
          />
          <AppButton
            title="Valider le tarif"
            onPress={() =>
              Alert.alert(
                "Voulez-vous vraiment valider le tarif ?",
                "Vous pourrez toujours le modifier avant le début de l'évènement",
                [
                  {
                    text: "Annuler",
                    style: "cancel",
                  },
                  {
                    text: "Valider",
                    onPress: () => {
                      if (!isEditing) {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "EventsNavigator" }],
                        });
                      } else {
                        navigation.goBack();
                      }
                    },
                  },
                ]
              )
            }
            style={{ marginTop: 5 }}
          />
          <ErrorMessage
            error={deleteError}
            visible={deleteError != null}
            style={{ paddingHorizontal: 10, marginBottom: 20 }}
          />
        </View>
      )}
      {errorGettingEventProducts !== null && (
        <View style={styles.errorGettingEventProducts}>
          <AppText>{errorGettingEventProducts}</AppText>
          <AppButton
            title="Réessayer"
            onPress={() => getAllEventProducts(eventId)}
          />
        </View>
      )}
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 10,
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  errorGettingEventProducts: {
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  list: {
    width: "100%",
  },
  noEventProducts: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
});

export default CreatePriceListScreen;
