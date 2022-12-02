import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
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
import eventProductAPI from "../../api/eventProduct.api";
import eventAPI from "../../api/event.api";
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
  const { eventId, qrCodeData } = props.route.params;
  const { navigation } = props;

  const [error, setError] = useState(null);
  const [tarifItems, setTarifItems] = useState([]);
  const [eventName, setEventName] = useState(null);

  //TODO: add the ability to generate a PDF with the tarif and add a qrcode to join the event and another one to connect to the wifi network of the raspi

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

  const getEventName = () => {
    setIsLoading(true);
    setError(null);
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
            ${tarifItems
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
            <p>Si vous avez l'application interbar, scannez ce QR code pour rejoindre l'évènement !</p>
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

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  useEffect(() => {
    getTarif();
    getEventName();
  }, [isFocused]);

  useEffect(() => {
    if (eventName === null && tarifItems.length === 0) {
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
  }, [eventName, tarifItems]);

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
