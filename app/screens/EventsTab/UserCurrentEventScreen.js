import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import RadioButton from "../../components/RadioButton";
import AppButton from "../../components/AppButton";
import SortMenu from "../../components/SortMenu";

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

  return (
    <Screen style={styles.container}>
      <SortMenu
        sortOptionSelected={sortOptionSelected}
        setSortOptionSelected={setSortOptionSelected}
        scrollOptionSelected={paidOptionSelected}
        setScrollOptionSelected={setPaidOptionSelected}
        sortOptions={sortOptions}
        scrollOptions={paidOptions}
        defaultItems={commandItems}
        displayedItems={displayedItems}
        setDisplayedItems={setDisplayedItems}
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
