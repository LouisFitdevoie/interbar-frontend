import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import commandAPI from "../../api/command.api";
import { AuthContext } from "../../auth/AuthContext";

function StatisticsScreen(props) {
  const { navigation } = props;
  const { eventId } = props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading } =
    useContext(AuthContext);

  const [commands, setCommands] = useState([]);
  const [error, setError] = useState(null);

  //TODO -> add ability to generate a PDF with the data

  const getAllCommands = () => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .getCommandsByEventId(eventId, userAccessToken)
      .then((response) => {
        setIsLoading(false);
        setCommands(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 404) {
            setError(null);
          } else if (err.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(err.response.data.error);
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

  const calculateTotalProfit = () => {
    return calculateTotalSales() - calculateTotalBuyings();
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
    return products;
  };

  useEffect(() => {
    getAllCommands();
    console.log(numberProductsSold());
  }, []);

  return (
    <Screen style={styles.container}>
      <View>
        <AppText>{eventId}</AppText>
      </View>
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
    backgroundColor: colors.white,
  },
});

export default StatisticsScreen;
