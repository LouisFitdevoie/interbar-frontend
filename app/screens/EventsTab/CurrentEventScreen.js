import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import RadioButton from "../../components/RadioButton";
import AppButton from "../../components/AppButton";
import SortMenu from "../../components/SortMenu";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";

function UserCurrentEventScreen({
  navigation,
  organizer,
  startDate,
  endDate,
  location,
  description,
  role,
  eventId,
}) {
  const { isLoading, setIsLoading } = useContext(AuthContext);

  const [sortOptionSelected, setSortOptionSelected] = useState("newest");
  const [paidOptionSelected, setPaidOptionSelected] = useState("all");

  const [commandItems, setCommandItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(commandItems);

  const sortOptions = [
    { name: "La plus récente d'abord", value: "newest" },
    { name: "La plus ancienne d'abord", value: "oldest" },
    { name: "La plus chère d'abord", value: "highest" },
    { name: "La moins chère d'abord", value: "lowest" },
  ];

  const paidOptions = [
    { name: "Toutes", value: "all" },
    { name: "Payées", value: "paid" },
    { name: "Non payées", value: "unpaid" },
  ];

  const handleSort = () => {
    setIsLoading(true);
    let itemsToDisplay = commandItems;
    if (paidOptionSelected != "all") {
      itemsToDisplay = itemsToDisplay.filter((command) => {
        return command.isPaid;
      });
    }
    itemsToDisplay = itemsToDisplay.sort((a, b) => {
      if (sortOptionSelected === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOptionSelected === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOptionSelected === "highest") {
        //Edit to get the total price of the command <=========================== TODO
        return b.totalPrice - a.totalPrice;
      } else if (sortOptionSelected === "lowest") {
        //Edit to get the total price of the command <=========================== TODO
        return a.totalPrice - b.totalPrice;
      }
    });
    setDisplayedItems(itemsToDisplay);
    setIsLoading(false);
  };

  //TODO
  // - USER
  // --- Get the commands the user has made for this event
  // --- Display them in a flatlist
  // --- Add the ability to sort the items by highest or lowest price (line 60 & 63)
  // --- Verify the ability to sort by newest or oldest (line 56 & 58)
  // --- Add the ability to the user to make a new command by redirecting him to a newCommandScreen (line 101)
  // - SELLER & ORGANIZER
  // --- Get the commands the seller has served for this event
  // --- Display them in a flatlist
  // --- Change the color of the command item if the command is not paid or served
  // --- Verify the ability to filter by paid or unpaid (line 49 to 52)

  return (
    <Screen style={styles.container}>
      <View style={styles.titleContainer}>
        <AppText style={styles.title}>
          {role === 0
            ? "Mes commandes"
            : role === 1
            ? "Commandes traitées"
            : "Toutes les commandes"}
        </AppText>
      </View>
      <SortMenu
        sortOptionSelected={sortOptionSelected}
        setSortOptionSelected={setSortOptionSelected}
        scrollOptionSelected={paidOptionSelected}
        setScrollOptionSelected={setPaidOptionSelected}
        sortOptions={sortOptions}
        role={role}
        scrollOptions={paidOptions}
        displayedItems={displayedItems}
        handleSort={() => handleSort()}
      />
      {displayedItems.length === 0 && (
        <View style={styles.noCommandContainer}>
          <AppText style={{ textAlign: "center" }}>
            Aucune commande ne correspond aux critères sélectionnés
          </AppText>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Nouvelle commande"
          onPress={() => console.log("nouvelle commande")}
        />
      </View>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  noCommandContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 10,
    color: colors.primary,
  },
  titleContainer: {
    alignItems: "center",
  },
});

export default UserCurrentEventScreen;
