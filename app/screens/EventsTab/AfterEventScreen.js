import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import SortMenu from "../../components/SortMenu";
import { AuthContext } from "../../auth/AuthContext";

function AfterEventScreen({
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
      <View style={styles.detailContainer}>
        {role != 2 && (
          <View style={styles.detailView}>
            <AppText style={styles.detailTitle}>Organisé par :</AppText>
            <AppText>{organizer}</AppText>
          </View>
        )}
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Date de début :</AppText>
          <AppText>
            {startDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Date de fin :</AppText>
          <AppText>
            {endDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Lieu :</AppText>
          <AppText>{location}</AppText>
        </View>
        {description != null && (
          <View style={styles.detailView}>
            <AppText style={styles.detailTitle}>Description :</AppText>
            <AppText>{description}</AppText>
          </View>
        )}
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Rôle :</AppText>
          <AppText>
            {role === 0 ? "Client" : role === 1 ? "Vendeur" : "Organisateur"}
          </AppText>
        </View>
      </View>
      <View style={styles.commandsContainer}>
        <AppText style={styles.commandsTitle}>
          {role === 0
            ? "Mes commandes"
            : role === 1
            ? "Commandes traitées"
            : "Toutes les commandes"}
        </AppText>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  commandsContainer: {
    paddingHorizontal: 10,
  },
  commandsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: colors.primary,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: colors.white,
  },
  detailContainer: {
    marginTop: 5,
    width: "100%",
  },
  detailView: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailTitle: {
    fontWeight: "bold",
    color: colors.buttonPrimary,
    paddingRight: 5,
    paddingVertical: 5,
  },
});

export default AfterEventScreen;
