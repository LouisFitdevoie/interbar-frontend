import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import commandAPI from "../../api/command.api";
import eventProductAPI from "../../api/eventProduct.api";
import eventAPI from "../../api/event.api";
import userEventAPI from "../../api/userEvent.api";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function StatisticsScreen(props) {
  const { navigation } = props;
  const { eventId } = props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading, user } =
    useContext(AuthContext);

  const [commands, setCommands] = useState([]);
  const [productsAtEvent, setProductsAtEvent] = useState([]);
  const [eventInfos, setEventInfos] = useState(null);
  const [usersAtEvent, setUsersAtEvent] = useState([]);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const getAllCommands = () => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .getCommandsByEventId(eventId, userAccessToken)
      .then((response) => {
        setCommands(response.data);
        eventProductAPI
          .getAllProductsAtEvent(eventId, userAccessToken)
          .then((res) => {
            setProductsAtEvent(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de r??cup??rer les produits de l'??v??nement, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (error.response.status === 404) {
            setError(null);
          } else if (error.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez r??essayer");
          } else {
            setError("Une erreur est survenue");
            console.log(error.response.data.error);
          }
        }
      });
  };

  const getEventInfos = () => {
    eventAPI
      .getEventById(eventId, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        setEventInfos(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError("Une erreur est survenue, veuillez r??essayer");
        }
      });
  };

  const getNumberOfParticipants = () => {
    userEventAPI
      .getAllUsersFromEvent(eventId, userAccessToken)
      .then((res) => {
        res.data.forEach(
          (user) => (user.clientName = user.firstname + " " + user.lastname)
        );
        let users = res.data;
        commandAPI
          .getClientNamesForEvent(eventId, userAccessToken)
          .then((res) => {
            res.data.forEach((client) => {
              if (!users.find((user) => user.clientName === client.client_name))
                users.push({
                  clientName: client.client_name,
                  id: null,
                  role: 0,
                });
            });
            setUsersAtEvent(users);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de r??cup??rer les utilisateurs participant ?? l'??v??nement, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          });
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError(
            "Impossible de r??cup??rer les utilisateurs participant ?? l'??v??nement, veuillez r??essayer"
          );
        } else {
          console.log(err.response.data);
          setError("Une erreur est survenue");
        }
      });
  };

  const getNumberOfCommands = () => {
    let numberOfCommands = commands.length;
    let numberOfPaidCommands = 0;
    let numberOfNotPaidCommands = 0;
    let numberOfServedCommands = 0;
    let numberOfNotServedCommands = 0;

    commands.forEach((command) => {
      if (command.isPaid) numberOfPaidCommands++;
      else numberOfNotPaidCommands++;
      if (command.isServed) numberOfServedCommands++;
      else numberOfNotServedCommands++;
    });

    return {
      numberOfCommands,
      numberOfPaidCommands,
      numberOfNotPaidCommands,
      numberOfServedCommands,
      numberOfNotServedCommands,
    };
  };

  const getMeanCommand = () => {
    let meanCommandPrice = 0;
    let meanQuantityOfProductsPerCommand = 0;
    let meanQuantityOfProductsPerCommandByProduct = [];

    commands.forEach((command) => {
      meanCommandPrice += command.totalPrice;
      command.events_products_commands.forEach((product) => {
        meanQuantityOfProductsPerCommand += product.number;
      });
      command.events_products_commands.forEach((product) => {
        let productIndex = meanQuantityOfProductsPerCommandByProduct.findIndex(
          (prod) => prod.id === product.event_product_id
        );
        if (productIndex === -1) {
          meanQuantityOfProductsPerCommandByProduct.push({
            id: product.event_product_id,
            quantity: product.number,
          });
        } else {
          meanQuantityOfProductsPerCommandByProduct[productIndex].quantity +=
            product.number;
        }
      });
    });

    meanCommandPrice = Math.round(meanCommandPrice / commands.length);
    meanQuantityOfProductsPerCommand = Math.round(
      meanQuantityOfProductsPerCommand / commands.length
    );
    meanQuantityOfProductsPerCommandByProduct.forEach((product) => {
      product.quantity = Math.round(product.quantity / commands.length);
    });

    return {
      meanCommandPrice,
      meanQuantityOfProductsPerCommand,
      meanQuantityOfProductsPerCommandByProduct,
    };
  };

  const calculateTotalSales = () => {
    let total = 0;
    commands.forEach((command) => {
      total += command.totalPrice;
    });
    return Math.round(total);
  };

  const calculateTotalBuyings = () => {
    let total = 0;
    commands.forEach((command) => {
      command.events_products_commands.forEach((eventProductCommand) => {
        total += eventProductCommand.number * eventProductCommand.buyingPrice;
      });
    });
    return Math.round(total);
  };

  const calculateBuyingAllStock = () => {
    let total = 0;
    productsAtEvent.forEach((product) => {
      total += product.buyingPrice * product.stock;
    });
    return Math.round(total) + calculateTotalBuyings();
  };

  const calculateTotalProfit = () => {
    return calculateTotalSales() - calculateTotalBuyings();
  };

  const calculateProfitBuyingAllStock = () => {
    return calculateTotalSales() - calculateBuyingAllStock();
  };

  const numberProductsSold = () => {
    let products = {};
    commands.forEach((command) => {
      command.events_products_commands.forEach((eventProductCommand) => {
        if (products[eventProductCommand.event_product_id] === undefined) {
          products[eventProductCommand.event_product_id] =
            eventProductCommand.number;
        } else {
          products[eventProductCommand.event_product_id] +=
            eventProductCommand.number;
        }
      });
    });
    let productsArray = [];
    for (const [key, value] of Object.entries(products)) {
      productsArray.push({ id: key, number: value });
    }
    let productsToReturn = [];
    productsArray.forEach((product) => {
      productsAtEvent.forEach((eventProduct) => {
        if (product.id === eventProduct.events_products_id) {
          productsToReturn.push({
            buyingPrice: eventProduct.buyingPrice,
            category: eventProduct.category,
            description: eventProduct.description,
            eventProductId: eventProduct.events_products_id,
            initialStock: eventProduct.stock + product.number,
            name: eventProduct.name,
            productId: eventProduct.product_id,
            sellingPrice: eventProduct.sellingPrice,
            sold: product.number,
            stockLeft: eventProduct.stock,
          });
        }
      });
    });
    return productsToReturn;
  };

  const calculatePercentage = (number, initial) => {
    return Math.round((number / initial) * 10000) / 100;
  };

  const calculateDebts = () => {
    let debt = {};
    commands.forEach((command) => {
      if (!command.isPaid && command.isServed) {
        if (debt[command.client_name] === undefined) {
          debt[command.client_name] = command.totalPrice;
        } else {
          debt[command.client_name] += command.totalPrice;
        }
      }
    });
    let debtArray = [];
    for (const [key, value] of Object.entries(debt)) {
      debtArray.push({ name: key, totalDue: value });
    }
    return debtArray;
  };

  const totalSales = calculateTotalSales();
  const totalBuyings = calculateTotalBuyings();
  const buyingAllStock = calculateBuyingAllStock();
  const totalProfit = calculateTotalProfit();
  const profitBuyingAllStock = calculateProfitBuyingAllStock();
  const productsSold = numberProductsSold();
  const numberOfCommands = getNumberOfCommands();
  const meanCommand = getMeanCommand();
  const debts = calculateDebts();

  useEffect(() => {
    getAllCommands();
    getEventInfos();
    getNumberOfParticipants();
  }, []);

  useEffect(() => {
    if (
      eventInfos != null &&
      commands != null &&
      productsAtEvent != null &&
      usersAtEvent != null
    ) {
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
    } else {
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
    }
  }, [eventInfos, commands, productsAtEvent, usersAtEvent]);

  const printToFile = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(`Une erreur est survenue au moment de partager le fichier`);
    } else {
      const html = `
        <html style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <head>
          <style>
            body {
              width: auto;
            }
            h1 {
              color: #214951;
              text-align: center;
            }
            h2 {
              font-size: 1.5rem;
              margin-bottom: 0px;
            }
            ol {
              color: #497179;
              font-size: 1.4rem;
              font-weight: 500;
            }
            p {
              color: black;
              font-size: 1rem;
              font-weight: 400;
              margin-top: 5px;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <h1>${eventInfos.name} : Statistiques</h1>
          <ol>
            <li>
              <h2>Informations sur l'??v??nement</h2>
              <p>L'??v??nement a lieu du ${new Date(
                eventInfos.startdate
              ).toLocaleDateString("fr-BE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} jusqu'au ${new Date(eventInfos.enddate).toLocaleDateString(
        "fr-BE",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )} ?? l'endroit suivant : ${eventInfos.location}.</p>
              ${
                eventInfos.description
                  ? "<p>La description que vous avez fournie est la suivante : " +
                    eventInfos.description +
                    ".</p>"
                  : ""
              }
              <p>Il y a eu ${
                usersAtEvent.length
              } participant(s) lors de cet ??v??nement, avec ${
        usersAtEvent.filter((user) => user.role === 0).length
      } clients et ${
        usersAtEvent.filter((user) => user.role !== 0).length
      } vendeurs. ${
        usersAtEvent.filter((user) => user.id != null).length
      } d'entre eux (${calculatePercentage(
        usersAtEvent.filter((user) => user.id != null).length,
        usersAtEvent.length
      )}%) sont inscrits sur l'application.</p>
            </li>
            <li>
              <h2>Commandes</h2>
              <p>Vous avez re??u ${
                numberOfCommands.numberOfCommands
              } commandes. ${
        numberOfCommands.numberOfNotPaidCommands === 0 &&
        numberOfCommands.numberOfNotServedCommands === 0
          ? "Toutes les commandes ont ??t?? pay??es et servies.\n"
          : ""
      }
                ${
                  numberOfCommands.numberOfNotPaidCommands > 0 &&
                  numberOfCommands.numberOfNotServedCommands === 0
                    ? "Toutes les commandes ont ??t?? servies, mais " +
                      numberOfCommands.numberOfNotPaidCommands +
                      (numberOfCommands.numberOfNotPaidCommands > 1
                        ? " n'ont"
                        : " n'a") +
                      " pas ??t?? pay??e" +
                      (numberOfCommands.numberOfNotPaidCommands > 1
                        ? "s ("
                        : " (") +
                      calculatePercentage(
                        numberOfCommands.numberOfNotPaidCommands,
                        numberOfCommands.numberOfCommands
                      ) +
                      "%).\n"
                    : ""
                }
                ${
                  numberOfCommands.numberOfNotPaidCommands === 0 &&
                  numberOfCommands.numberOfNotServedCommands > 0
                    ? "Toutes les commandes ont ??t?? pay??es, mais " +
                      numberOfCommands.numberOfNotServedCommands +
                      (numberOfCommands.numberOfNotServedCommands > 1
                        ? " n'ont"
                        : " n'a") +
                      " pas ??t?? servie" +
                      (numberOfCommands.numberOfNotServedCommands > 1
                        ? "s ("
                        : " (") +
                      calculatePercentage(
                        numberOfCommands.numberOfNotServedCommands,
                        numberOfCommands.numberOfCommands
                      ) +
                      "%).\n"
                    : ""
                }
                ${
                  numberOfCommands.numberOfNotPaidCommands > 0 &&
                  numberOfCommands.numberOfNotServedCommands > 0
                    ? "Parmi toutes ces commandes, " +
                      numberOfCommands.numberOfNotPaidCommands +
                      (numberOfCommands.numberOfNotPaidCommands > 1
                        ? " n'ont"
                        : " n'a") +
                      " pas ??t?? pay??e" +
                      (numberOfCommands.numberOfNotPaidCommands > 1
                        ? "s ("
                        : " (") +
                      calculatePercentage(
                        numberOfCommands.numberOfNotPaidCommands,
                        numberOfCommands.numberOfCommands
                      ) +
                      "%) et " +
                      numberOfCommands.numberOfNotServedCommands +
                      (numberOfCommands.numberOfNotServedCommands > 1
                        ? " n'ont"
                        : " n'a") +
                      " pas ??t?? servie" +
                      (numberOfCommands.numberOfNotServedCommands > 1
                        ? "s ("
                        : " (") +
                      calculatePercentage(
                        numberOfCommands.numberOfNotServedCommands,
                        numberOfCommands.numberOfCommands
                      ) +
                      "%).\n"
                    : ""
                }</p>
              <p>Le prix moyen d'une commande ??tait de ${meanCommand.meanCommandPrice
                .toString()
                .replace(
                  ".",
                  ","
                )}??? et contenait ${meanCommand.meanQuantityOfProductsPerCommand
        .toString()
        .replace(".", ",")} produits.</p>
              <p>La commande moyenne, lors de cet ??v??nement, contenait ${meanCommand.meanQuantityOfProductsPerCommandByProduct
                .map((product) => {
                  return (
                    product.quantity.toString().replace(".", ",") +
                    " " +
                    (productsAtEvent.length > 0
                      ? productsAtEvent.find(
                          (productAtEvent) =>
                            productAtEvent.events_products_id === product.id
                        ).name
                      : "") +
                    (product ===
                    meanCommand.meanQuantityOfProductsPerCommandByProduct[
                      meanCommand.meanQuantityOfProductsPerCommandByProduct
                        .length - 1
                    ]
                      ? "."
                      : product ===
                        meanCommand.meanQuantityOfProductsPerCommandByProduct[
                          meanCommand.meanQuantityOfProductsPerCommandByProduct
                            .length - 2
                        ]
                      ? " et "
                      : ", ")
                  );
                })
                .join("")}</p>
            </li>
            <li>
              <h2>Achat des produits</h2>
              <p>
                En prenant en compte le prix d'achat indiqu?? ?? la cr??ation de l'??v??nement et uniquement le nombre de produits vendus, le co??t d'achat estim?? des produits est de ${totalBuyings
                  .toString()
                  .replace(".", ",")}???.
              </p>
              <p> 
                Cependant, si vous souhaitez prendre en compte que vous avez achet?? l'ensemble du stock initial de chaque produit, le co??t d'achat r??el est de ${buyingAllStock
                  .toString()
                  .replace(".", ",")}???.
              </p>
              <p>
                Attention, nous ne prennons pas en compte les produits qui ont ??t?? endommag??s ou perdus pendant l'??v??nement.
              </p>
            </li>
            <li>
              <h2>Vente des produits</h2>
              <p>
                En prenant en compte le prix de vente indiqu?? ?? la cr??ation de l'??v??nement et le nombre de produits vendus, la somme que vous avez re??ue suite ?? la vente de ceux-ci est de ${totalSales
                  .toString()
                  .replace(".", ",")}???.
              </p>
            </li>
            <li>
              <h2>Chiffre d'affaires</h2>
              <p>
                Gr??ce aux donn??es que nous avons enregistr??es, nous pouvons vous indiquer que vous ${
                  totalProfit === 0
                    ? "n'avez ni perdu, ni gagn?? d'argent parce que vous avez vendu le m??me nombre de produits que vous n'en avez achet??"
                    : totalProfit > 0
                    ? "avez r??alis?? un b??n??fice de " +
                      totalProfit.toString().replace(".", ",") +
                      "??? "
                    : "avez r??alis?? un d??ficit de " +
                      (-totalProfit).toString().replace(".", ",") +
                      "??? "
                } sur les produits que vous avez vendus.
              </p>
              <p>
                Cependant, si vous souhaitez prendre en compte que vous avez achet?? l'ensemble du stock initial de chaque produit, ${
                  profitBuyingAllStock === 0
                    ? " vous n'avez ni perdu, ni gagn?? d'argent parce que vous avez vendu le m??me nombre de produits que vous n'en avez achet??"
                    : profitBuyingAllStock > 0
                    ? " vous avez r??alis?? un b??n??fice de " +
                      profitBuyingAllStock.toString().replace(".", ",") +
                      "???"
                    : " vous avez r??alis?? un d??ficit de " +
                      (-profitBuyingAllStock).toString().replace(".", ",") +
                      "???"
                } sur les produits que vous avez vendu. 
              </p>
              <p>
                Attention, nous ne prennons pas en compte les produits qui ont ??t?? endommag??s ou perdus pendant l'??v??nement.
              </p>
            </li>
            <li>
              <h2>D??tail des produits vendus</h2>
              <ul style="list-style-type: circle;">
                ${productsSold
                  .map((product) => {
                    return `
                    <li>
                      <div>
                        <p>
                          ${product.name} :
                        </p>
                        <p>
                          ${product.sold} produits vendus sur ${
                      product.initialStock
                    } (${calculatePercentage(product.sold, product.initialStock)
                      .toString()
                      .replace(".", ",")}%)
                        </p>
                      </div>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
            </li>
            ${
              debts.length > 0
                ? `<li>
              <h2>Dettes des clients</h2>
              <p></p>
            </li>`
                : ""
            }
            ${debts.length > 0 ? `<ul style="list-style-type: circle;">` : ""}
            ${
              debts.length > 0
                ? debts
                    .map((debt) => {
                      return `
                    <p>
                      - ${debt.name} : ${debt.totalDue}???
                    </p>
                  `;
                    })
                    .join("")
                : ""
            }
            ${debts.length > 0 ? `</ul>` : ""}
          </ol>
        </body>
        <footer>
          <p>Ce document a ??t?? g??n??r?? le ${new Date().toLocaleDateString(
            "fr-BE",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }
          )} ?? ${new Date().toLocaleTimeString("fr-BE", {
        hour: "2-digit",
        minute: "2-digit",
      })} par ${user.firstName} ${user.lastName}</p>
        </footer>
      </html>
      `;
      const response = await Print.printToFileAsync({
        html,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });

      const eventNameFormatted = eventInfos.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-");

      const pdfName = `${response.uri.slice(
        0,
        response.uri.lastIndexOf("/") + 1
      )}${eventNameFormatted}_STATISTICS.pdf`;

      await FileSystem.moveAsync({
        from: response.uri,
        to: pdfName,
      });

      await Sharing.shareAsync(pdfName, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: "Partager les statistiques",
      });
    }
  };

  return (
    <Screen style={styles.container} version="scroll">
      {!isLoading &&
        eventInfos != null &&
        commands != null &&
        productsAtEvent != null &&
        usersAtEvent != null && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <AppText style={styles.eventName}>{eventInfos.name}</AppText>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>
                1) Informations sur l'??v??nement
              </AppText>
              <AppText style={styles.detailText}>
                L'??v??nement a eu lieu du{" "}
                {new Date(eventInfos.startdate).toLocaleDateString("fr-BE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                jusqu'au{" "}
                {new Date(eventInfos.enddate).toLocaleDateString("fr-BE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ?? l'endroit suivant : {eventInfos.location}.{"\n"}
                {eventInfos.description
                  ? "La description que vous avez fournie est la suivante : " +
                    eventInfos.description +
                    ".\n"
                  : ""}
                Il y a eu {usersAtEvent.length} participant(s) lors de cet
                ??v??nement, avec{" "}
                {usersAtEvent.filter((user) => user.role === 0).length} clients
                et {usersAtEvent.filter((user) => user.role !== 0).length}{" "}
                vendeurs.{" "}
                {usersAtEvent.filter((user) => user.id != null).length}{" "}
                d'entre-eux (
                {calculatePercentage(
                  usersAtEvent.filter((user) => user.id != null).length,
                  usersAtEvent.length
                )}
                %) sont inscrits sur l'application.
              </AppText>
            </View>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>2) Commandes</AppText>
              <AppText style={styles.detailText}>
                Vous avez re??u {numberOfCommands.numberOfCommands} commandes.
                {"\n"}
                {numberOfCommands.numberOfNotPaidCommands === 0 &&
                numberOfCommands.numberOfNotServedCommands === 0
                  ? "Toutes les commandes ont ??t?? pay??es et servies.\n"
                  : ""}
                {numberOfCommands.numberOfNotPaidCommands > 0 &&
                numberOfCommands.numberOfNotServedCommands === 0
                  ? "Toutes les commandes ont ??t?? servies, mais " +
                    numberOfCommands.numberOfNotPaidCommands +
                    (numberOfCommands.numberOfNotPaidCommands > 1
                      ? " n'ont"
                      : " n'a") +
                    " pas ??t?? pay??e" +
                    (numberOfCommands.numberOfNotPaidCommands > 1
                      ? "s ("
                      : " (") +
                    calculatePercentage(
                      numberOfCommands.numberOfNotPaidCommands,
                      numberOfCommands.numberOfCommands
                    ) +
                    "%).\n"
                  : ""}
                {numberOfCommands.numberOfNotPaidCommands === 0 &&
                numberOfCommands.numberOfNotServedCommands > 0
                  ? "Toutes les commandes ont ??t?? pay??es, mais " +
                    numberOfCommands.numberOfNotServedCommands +
                    (numberOfCommands.numberOfNotServedCommands > 1
                      ? " n'ont"
                      : " n'a") +
                    " pas ??t?? servie" +
                    (numberOfCommands.numberOfNotServedCommands > 1
                      ? "s ("
                      : " (") +
                    calculatePercentage(
                      numberOfCommands.numberOfNotServedCommands,
                      numberOfCommands.numberOfCommands
                    ) +
                    "%).\n"
                  : ""}
                {numberOfCommands.numberOfNotPaidCommands > 0 &&
                numberOfCommands.numberOfNotServedCommands > 0
                  ? "Parmi toutes ces commandes, " +
                    numberOfCommands.numberOfNotPaidCommands +
                    (numberOfCommands.numberOfNotPaidCommands > 1
                      ? " n'ont"
                      : " n'a") +
                    " pas ??t?? pay??e" +
                    (numberOfCommands.numberOfNotPaidCommands > 1
                      ? "s ("
                      : " (") +
                    calculatePercentage(
                      numberOfCommands.numberOfNotPaidCommands,
                      numberOfCommands.numberOfCommands
                    ) +
                    "%) et " +
                    numberOfCommands.numberOfNotServedCommands +
                    (numberOfCommands.numberOfNotServedCommands > 1
                      ? " n'ont"
                      : " n'a") +
                    " pas ??t?? servie" +
                    (numberOfCommands.numberOfNotServedCommands > 1
                      ? "s ("
                      : " (") +
                    calculatePercentage(
                      numberOfCommands.numberOfNotServedCommands,
                      numberOfCommands.numberOfCommands
                    ) +
                    "%).\n"
                  : ""}
                Le prix moyen d'une commande ??tait de{" "}
                {meanCommand.meanCommandPrice.toString().replace(".", ",")}??? et
                contenait{" "}
                {meanCommand.meanQuantityOfProductsPerCommand
                  .toString()
                  .replace(".", ",")}{" "}
                produits.
                {"\n"}
                La commande moyenne, lors de cet ??v??nement, contenait{" "}
                {meanCommand.meanQuantityOfProductsPerCommandByProduct.map(
                  (product) => {
                    return (
                      product.quantity.toString().replace(".", ",") +
                      " " +
                      (productsAtEvent.length > 0
                        ? productsAtEvent.find(
                            (productAtEvent) =>
                              productAtEvent.events_products_id === product.id
                          ).name
                        : "") +
                      (product ===
                      meanCommand.meanQuantityOfProductsPerCommandByProduct[
                        meanCommand.meanQuantityOfProductsPerCommandByProduct
                          .length - 1
                      ]
                        ? "."
                        : product ===
                          meanCommand.meanQuantityOfProductsPerCommandByProduct[
                            meanCommand
                              .meanQuantityOfProductsPerCommandByProduct
                              .length - 2
                          ]
                        ? " et "
                        : ", ")
                    );
                  }
                )}
              </AppText>
            </View>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>3) Achat des produits</AppText>
              <AppText style={styles.detailText}>
                En prenant en compte le prix d'achat indiqu?? ?? la cr??ation de
                l'??v??nement et uniquement le nombre de produits vendus, le co??t
                d'achat estim?? des produits est de{" "}
                {totalBuyings.toString().replace(".", ",")}???. {"\n"}
                Cependant, si vous souhaitez prendre en compte que vous avez
                achet?? l'ensemble du stock initial de chaque produit, le co??t
                d'achat r??el est de{" "}
                {buyingAllStock.toString().replace(".", ",")}
                ???.
              </AppText>
            </View>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>4) Vente des produits</AppText>
              <AppText style={styles.detailText}>
                En prenant en compte le prix de vente indiqu?? ?? la cr??ation de
                l'??v??nement et le nombre de produits vendus, la somme que vous
                avez re??ue suite ?? la vente de ceux-ci est de{" "}
                {totalSales.toString().replace(".", ",")}???.
              </AppText>
            </View>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>5) Chiffre d'affaires</AppText>
              <AppText style={styles.detailText}>
                Gr??ce aux donn??es que nous avons enregistr??es, nous pouvons vous
                indiquer que vous{" "}
                {totalProfit === 0
                  ? "n'avez ni perdu, ni gagn?? d'argent parce que vous avez vendu le m??me nombre de produits que vous n'en avez achet??"
                  : totalProfit > 0
                  ? "avez r??alis?? un b??n??fice de " +
                    totalProfit.toString().replace(".", ",") +
                    "??? "
                  : "avez r??alis?? un d??ficit de " +
                    (-totalProfit).toString().replace(".", ",") +
                    "??? "}
                sur les produits que vous avez vendu. {"\n"}
                Cependant, si vous souhaitez prendre en compte que vous avez
                achet?? l'ensemble du stock initial de chaque produit,
                {profitBuyingAllStock === 0
                  ? " vous n'avez ni perdu, ni gagn?? d'argent parce que vous avez vendu le m??me nombre de produits que vous n'en avez achet??"
                  : profitBuyingAllStock > 0
                  ? " vous avez r??alis?? un b??n??fice de " +
                    profitBuyingAllStock.toString().replace(".", ",") +
                    "???"
                  : " vous avez r??alis?? un d??ficit de " +
                    (-profitBuyingAllStock).toString().replace(".", ",") +
                    "???"}{" "}
                sur les produits que vous avez vendu.{`\n`}
                Attention, nous ne prennons pas en compte les produits qui ont
                ??t?? endommag??s ou perdus pendant l'??v??nement.
              </AppText>
            </View>
            <View style={styles.detailContainer}>
              <AppText style={styles.title}>
                6) D??tail des produits vendus
              </AppText>
              {productsSold.map((product) => {
                return (
                  <View key={product.productId}>
                    <AppText style={{ paddingHorizontal: 10 }}>
                      - {product.name} :
                    </AppText>
                    <AppText
                      style={{
                        paddingLeft: 22,
                        marginBottom: 5,
                      }}
                    >
                      {product.sold} produits vendus sur {product.initialStock}{" "}
                      ({calculatePercentage(product.sold, product.initialStock)}
                      %)
                    </AppText>
                  </View>
                );
              })}
            </View>
            {debts.length > 0 && (
              <View style={styles.detailContainer}>
                <AppText style={styles.title}>7) Dettes des clients</AppText>
                {debts.map((debt) => {
                  return (
                    <AppText key={debt.name} style={{ paddingHorizontal: 10 }}>
                      - {debt.name} : {debt.totalDue}???
                    </AppText>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.white,
  },
  detailContainer: {
    marginTop: 10,
    width: "100%",
  },
  detailText: {
    fontSize: 18,
    color: colors.black,
    paddingHorizontal: 10,
  },
  eventName: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    width: "100%",
  },
  scroll: {
    width: "100%",
    flex: 1,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: 20,
  },
  title: {
    color: colors.buttonPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    width: "100%",
  },
});

export default StatisticsScreen;
