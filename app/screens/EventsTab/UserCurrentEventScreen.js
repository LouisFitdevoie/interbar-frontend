import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import RadioButton from "../../components/RadioButton";

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

  const handleSortOptionChanged = (option) => {
    setSortOptionSelected(option);
    setIsSortOptionsVisible(false);
  };

  const handlePaidOptionChanged = (option) => {
    setPaidOptionSelected(option);
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.sortMenuContainer}>
        <View style={styles.sortView}>
          <View style={styles.sortTitle}>
            <AppText style={{ fontSize: 20 }}>
              {
                sortOptions.find(
                  (option) => option.value === sortOptionSelected
                ).name
              }{" "}
              ({displayedItems.length})
            </AppText>
            <TouchableOpacity
              style={[
                styles.sortButton,
                {
                  backgroundColor: isSortOptionsVisible
                    ? colors.buttonPrimary
                    : colors.white,
                },
              ]}
              onPress={() => setIsSortOptionsVisible(!isSortOptionsVisible)}
            >
              <MaterialCommunityIcons
                name="filter-variant"
                size={30}
                color={
                  isSortOptionsVisible ? colors.white : colors.buttonPrimary
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sortOptionsView}>
            {isSortOptionsVisible && (
              <View style={styles.sortOptions}>
                {sortOptions.map((sortOption) => (
                  <View key={sortOption.value}>
                    <TouchableOpacity
                      key={sortOption.value}
                      onPress={() => handleSortOptionChanged(sortOption.value)}
                    >
                      <AppText
                        style={
                          sortOptionSelected === sortOption.value
                            ? styles.optionSelected
                            : styles.option
                        }
                      >
                        {sortOption.name}
                      </AppText>
                    </TouchableOpacity>
                    {sortOption.value !==
                      sortOptions[sortOptions.length - 1].value && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        <ScrollView horizontal>
          {paidOptions.map((paidOption) => (
            <RadioButton
              key={paidOption.value}
              value={paidOption.value}
              onPress={() => handlePaidOptionChanged(paidOption.value)}
              label={paidOption.name}
              stateValue={paidOptionSelected}
              style={{ paddingRight: 20 }}
            />
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  option: {
    padding: 5,
    width: "100%",
    textAlign: "center",
    color: colors.light,
  },
  optionSelected: {
    padding: 5,
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  sortButton: {
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sortMenuContainer: {
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  sortOptionsView: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 20,
    borderTopRightRadius: 0,
    width: 250,
  },
  sortTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sortView: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  sortOptions: {
    padding: 5,
  },
});

export default UserCurrentEventScreen;
