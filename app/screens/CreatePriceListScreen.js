import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import Screen from "../components/Screen";
import TarifItem from "../components/lists/TarifItem";
import ListSeparator from "../components/lists/ListSeparator";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

function CreatePriceListScreen(props) {
  const eventId = props.route.params.eventId;
  const { navigation } = props;

  const testData = [
    {
      id: 1,
      name: "Boisson alcoolisée",
      category: "1",
      description: "Boisson alcoolisée description",
      buyingPrice: 1.5,
      sellingPrice: 2.5,
      stock: 10,
    },
    {
      id: 2,
      name: "Soft",
      category: "2",
      description: "Soft description",
      buyingPrice: 1.5,
      sellingPrice: 2.5,
      stock: 10,
    },
    {
      id: 3,
      name: "Nourriture",
      category: "0",
      description: "Nourriture description",
      buyingPrice: 1.5,
      sellingPrice: 2.5,
      stock: 10,
    },
  ];

  return (
    <Screen style={styles.container}>
      <FlatList
        data={testData}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ListSeparator />}
        renderItem={({ item }) => (
          <TarifItem
            name={item.name}
            category={item.category}
            description={item.description}
            buyingPrice={item.buyingPrice}
            sellingPrice={item.sellingPrice}
            stock={item.stock}
            onPress={() => console.log("TarifItem pressed with id: " + item.id)}
          />
        )}
        style={styles.list}
      />
      <AppButton
        title="Ajouter un produit"
        onPress={() => navigation.navigate("AddProductTarif", { eventId })}
        style={{ marginBottom: 5 }}
      />
      <AppButton
        title="Valider le tarif"
        onPress={() => console.log("Validate PriceList")}
        style={{ marginTop: 5 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    width: "100%",
  },
  list: {
    width: "100%",
  },
});

export default CreatePriceListScreen;
