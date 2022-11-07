import React, { useEffect, useContext, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../../components/Screen";
import TarifItem from "../../components/lists/TarifItem";
import ListSeparator from "../../components/lists/ListSeparator";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import AppText from "../../components/AppText";
import LoadingIndicator from "../../components/LoadingIndicator";
import TarifItemDeleteAction from "../../components/lists/TarifItemDeleteAction";

function CreatePriceListScreen(props) {
  const isFocused = useIsFocused();
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);

  const eventId = props.route.params.eventId;
  const [eventProducts, setEventProducts] = useState([]);
  const { navigation } = props;

  const getAllEventProducts = (eventId) => {
    setIsLoading(true);
    eventProductAPI
      .getAllProductsAtEvent(eventId, userAccessToken)
      .then((res) => {
        setEventProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    isFocused && getAllEventProducts(eventId);
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      {eventProducts.length > 0 && (
        <FlatList
          data={eventProducts}
          keyExtractor={(item) => item.events_products_id.toString()}
          ItemSeparatorComponent={() => <ListSeparator />}
          renderItem={({ item }) => (
            <TarifItem
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
                })
              }
              renderRightActions={() => (
                <TarifItemDeleteAction
                  onPress={() => {
                    console.log(item.events_products_id);
                  }}
                />
              )}
            />
          )}
          style={styles.list}
        />
      )}
      {eventProducts.length === 0 && (
        <View style={styles.noEventProducts}>
          <AppText style={{ textAlign: "center" }}>
            Aucun produit n'a encore été ajouté au tarif de l'évènement
          </AppText>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Ajouter un produit"
          onPress={() => navigation.navigate("AddProductTarif", { eventId })}
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
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Events" }],
                    });
                  },
                },
              ]
            )
          }
          style={{ marginTop: 5 }}
        />
      </View>

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
