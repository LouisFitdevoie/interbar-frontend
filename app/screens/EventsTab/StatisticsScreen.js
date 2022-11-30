import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import commandAPI from "../../api/command.api";
import eventProductAPI from "../../api/eventProduct.api";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function StatisticsScreen(props) {
  const { navigation } = props;
  const { eventId } = props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading } =
    useContext(AuthContext);

  const [commands, setCommands] = useState([]);
  const [productsAtEvent, setProductsAtEvent] = useState([]);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  //TODO -> add ability to generate a PDF with the data

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
                "Impossible de récupérer les produits de l'évènement, veuillez réessayer"
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
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(error.response.data.error);
          }
        }
      });
  };

  const calculateTotalSales = () => {
    let total = 0;
    commands.forEach((command) => {
      total += command.totalPrice;
    });
    return total;
  };

  const calculateTotalBuyings = () => {
    let total = 0;
    commands.forEach((command) => {
      command.events_products_commands.forEach((eventProductCommand) => {
        total += eventProductCommand.number * eventProductCommand.buyingPrice;
      });
    });
    return total;
  };

  const calculateBuyingAllStock = () => {
    let total = 0;
    productsAtEvent.forEach((product) => {
      total += product.buyingPrice * product.stock;
    });
    return total + calculateTotalBuyings();
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

  const calculatePercentageSold = (numberSold, initialStock) => {
    //Return a percentage of the number of products sold compared to the initial stock with 2 decimals if needed
    return Math.round((numberSold / initialStock) * 10000) / 100;
  };

  const totalSales = calculateTotalSales();
  const totalBuyings = calculateTotalBuyings();
  const buyingAllStock = calculateBuyingAllStock();
  const totalProfit = calculateTotalProfit();
  const profitBuyingAllStock = calculateProfitBuyingAllStock();
  const productsSold = numberProductsSold();

  useEffect(() => {
    getAllCommands();
  }, []);

  return (
    <Screen style={styles.container} version="scroll">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <AppText style={styles.eventName}>Nom de l'évènement</AppText>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>1) Achat des produits</AppText>
          <AppText style={styles.detailText}>
            En prenant en compte le prix d'achat indiqué à la création de
            l'évènement et uniquement le nombre de produits vendus, le coût
            d'achat estimé des produits est de{" "}
            {totalBuyings.toString().replace(".", ",")} €. {"\n"}
            Cependant, si vous souhaitez prendre en compte que vous avez acheté
            l'ensemble du stock initial de chaque produit, le coût d'achat réel
            est de {buyingAllStock.toString().replace(".", ",")} €.{`\n`}
            Attention, nous ne prennons pas en compte les produits qui ont été
            endommagés ou perdus pendant l'évènement.
          </AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>2) Vente des produits</AppText>
          <AppText style={styles.detailText}>
            En prenant en compte le prix de vente indiqué à la création de
            l'évènement et le nombre de produits vendus, la somme que vous avez
            reçue suite à la vente de ceux-ci est de{" "}
            {totalSales.toString().replace(".", ",")} €.
          </AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>3) Chiffre d'affaire</AppText>
          <AppText style={styles.detailText}>
            Grâce aux données que nous avons enregistrées, nous pouvons vous
            indiquer que vous{" "}
            {totalProfit === 0
              ? "n'avez ni perdu, ni gagné d'argent parce que vous avez vendu le même nombre de produits que vous n'en avez acheté"
              : totalProfit > 0
              ? "avez réalisé un bénéfice de " +
                totalProfit.toString().replace(".", ",") +
                " €"
              : "avez réalisé un déficit de " +
                (-totalProfit).toString().replace(".", ",") +
                " €"}
            sur les produits que vous avez vendu. {"\n"}
            Cependant, si vous souhaitez prendre en compte que vous avez acheté
            l'ensemble du stock initial de chaque produit,
            {profitBuyingAllStock === 0
              ? " vous n'avez ni perdu, ni gagné d'argent parce que vous avez vendu le même nombre de produits que vous n'en avez acheté"
              : profitBuyingAllStock > 0
              ? " vous avez réalisé un bénéfice de " +
                profitBuyingAllStock.toString().replace(".", ",") +
                " €"
              : " vous avez réalisé un déficit de " +
                (-profitBuyingAllStock).toString().replace(".", ",") +
                " €"}{" "}
            sur les produits que vous avez vendu.
          </AppText>
        </View>
        <View style={styles.detailContainer}>
          <AppText style={styles.title}>4) Détail des produits vendus</AppText>
          {productsSold.map((product) => {
            return (
              <AppText key={product.id}>
                {product.name} : {product.sold} produits vendus sur{" "}
                {product.initialStock} (
                {calculatePercentageSold(product.sold, product.initialStock)}%).
              </AppText>
            );
          })}
        </View>
      </ScrollView>
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
    textAlign: "justify",
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
