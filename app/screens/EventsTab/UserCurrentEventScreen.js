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
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const [commandItems, setCommandItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(commandItems);

  const sortOptions = [
    { name: "Du plus récent au plus ancien", value: "newest" },
    { name: "Du plus ancien au plus récent", value: "oldest" },
    { name: "Du plus cher au moins cher", value: "highest" },
    { name: "Du moins cher au plus cher", value: "lowest" },
  ];

  const paidOptions = [
    { name: "Toutes", value: "all" },
    { name: "Payées", value: "paid" },
    { name: "Non payées", value: "unpaid" },
  ];

  const handleSort = () => {
    setIsLoading(true);
    let itemsToDisplay = commandItems.filter((command) => {
      if (paidOptionSelected === "all") {
        return true;
      } else {
        return command.isPaid;
      }
    });
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

  return (
    <Screen style={styles.container}>
      <SortMenu
        sortOptionSelected={sortOptionSelected}
        setSortOptionSelected={setSortOptionSelected}
        scrollOptionSelected={paidOptionSelected}
        setScrollOptionSelected={setPaidOptionSelected}
        sortOptions={sortOptions}
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
});

export default UserCurrentEventScreen;
