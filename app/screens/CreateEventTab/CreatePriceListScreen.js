import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import TarifCreationItem from "../../components/lists/TarifCreationItem";
import ListSeparator from "../../components/lists/ListSeparator";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import eventAPI from "../../api/event.api";
import AppText from "../../components/AppText";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/forms/ErrorMessage";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function CreatePriceListScreen(props) {
  const isFocused = useIsFocused();
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);

  const eventId = props.route.params.eventId;
  const isEditing = props.route.params.isEditing != null;
  const qrCodeData = props.route.params.qrCodeData;
  const [eventProducts, setEventProducts] = useState([]);
  const { navigation } = props;
  const [deleteError, setDeleteError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [errorGettingEventProducts, setErrorGettingEventProducts] =
    useState(null);
  const [eventName, setEventName] = useState(null);

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

  const printToFile = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Une erreur est survenue au moment de partager le fichier");
    } else {
      const html = `
      <html style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <head>
          <style>
            body {
              width: auto;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            h1 {
              color: #214951;
              text-align: center;
              font-size: 1.7em;
            }
            p {
              color: black;
              font-size: 1.5rem;
              font-weight: 400;
              margin-top: 5px;
              margin-bottom: 5px;
            }
            .productName {
              font-size: 1.5rem;
              font-weight: 600;
              color: #497179;
              padding-right: 250px;
            }
            .products {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-between;
              width: 100%;
            }
            #table {
              width: fit-content;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              padding: 10px;
            }
            #qrCode {
              width: 125px;
              height: 125px;
              object-fit: contain;
              padding: 10px;
              border: 5px solid #214951;
              border-radius: 20px;
              margin-bottom: 25px;
            }
            #qrCodeContainer {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
              margin-bottom: 20px;
              max-width: 800px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>${eventName} : Tarif</h1>
          <div id="table">
            ${eventProducts
              .map((product) => {
                return `<div class="products">
                  <p class="productName">${product.name}</p>
                  <p>${product.sellingPrice.toString().replace(".", ",")}€</p>
                </div>`;
              })
              .join("")}
          </div>
          <div id="qrCodeContainer">
            <img id="qrCode" src="data:image/jpeg;base64,${qrCodeData}"/>
            <p>Si vous avez l'application interbar, scannez ce QR Code, ou rentrez le code suivant : <i>${eventId}</i>, pour rejoindre l'évènement !</p>
          </div>
        </body>
      </html>
      `;

      const response = await Print.printToFileAsync({
        html,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });

      const eventNameFormatted = eventName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-")
        .replace(/[’'"]/g, "-");

      const pdfName = `${response.uri.slice(
        0,
        response.uri.lastIndexOf("/") + 1
      )}${eventNameFormatted}_TARIF.pdf`;

      await FileSystem.moveAsync({ from: response.uri, to: pdfName });
      await Sharing.shareAsync(pdfName, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: "Partager le tarif",
      });
    }
  };

  const getEventName = () => {
    setIsLoading(true);
    setErrorGettingEventProducts(null);
    eventAPI
      .getEventById(eventId, userAccessToken)
      .then((res) => {
        if (res.data) {
          setIsLoading(false);
          const eventData = res.data;
          setEventName(eventData.name);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          Alert.alert("Une erreur est survenue, veuillez réessayer");
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      });
  };

  useEffect(() => {
    isFocused && getAllEventProducts(eventId);
    getEventName();
  }, [isFocused]);

  useEffect(() => {
    if (isEditing) {
      if (eventName === null && eventProducts.length === 0) {
        navigation.setOptions({
          headerRight: () => (
            <MaterialCommunityIcons
              name="file-download-outline"
              size={30}
              color={colors.light}
              style={{ marginRight: 10 }}
            />
          ),
        });
      } else {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => printToFile()}>
              <MaterialCommunityIcons
                name="file-download-outline"
                size={30}
                color={colors.white}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        });
      }
    }
  }, [eventName, eventProducts]);

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
              onPressDelete={() => deleteEventProduct(item.events_products_id)}
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
