import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import { AuthContext } from "../auth/AuthContext";
import colors from "../config/colors";
import AppText from "../components/AppText";
import RadioButton from "../components/RadioButton";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
  const [sortDateOptionSelected, setSortDateOptionSelected] = useState(0);
  const [sortRoleOptionsSelected, setSortRoleOptionsSelected] = useState(0);
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);
  const existingItems = [
    { name: "test" },
    { name: "test2" },
    { name: "test3" },
  ];
  const [displayedItems, setDisplayedItems] = useState(existingItems);

  const sortDateOptions = [
    { name: "Tous les évènements", option: 0 },
    { name: "Évènements à venir", option: 1 },
    { name: "Évènements terminés", option: 2 },
    { name: "Évènements en cours", option: 3 },
  ];
  const sortRoleOptions = [
    { name: "Tous les rôles", option: 0 },
    { name: "Organisateur", option: 1 },
    { name: "Vendeur", option: 2 },
    { name: "Participant", option: 3 },
  ];

  const handleSortDateOptionChanged = (option) => {
    setSortDateOptionSelected(option);
    setIsSortOptionsVisible(false);
  };

  const handleSortRoleOptionChanged = (option) => {
    setSortDateOptionSelected(option);
    setIsSortOptionsVisible(false);
  };

  return (
    <Screen style={styles.container}>
      <AppText style={styles.welcome}>Bienvenue {user.firstName} !</AppText>
      <View style={styles.sortView}>
        <View style={styles.sortTitle}>
          <AppText style={{ fontSize: 22 }}>
            {sortDateOptions[sortDateOptionSelected].name} (
            {displayedItems.length})
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
              size={24}
              color={isSortOptionsVisible ? colors.white : colors.buttonPrimary}
            />
          </TouchableOpacity>
        </View>
        {isSortOptionsVisible && (
          <View style={styles.sortOptions}>
            {sortDateOptions.map((sortOption) => (
              <View key={sortOption.option}>
                <TouchableOpacity
                  key={sortOption.option}
                  onPress={() => handleSortDateOptionChanged(sortOption.option)}
                >
                  <AppText
                    style={
                      sortDateOptionSelected === sortOption.option
                        ? styles.optionSelected
                        : styles.option
                    }
                  >
                    {sortOption.name}
                  </AppText>
                </TouchableOpacity>
                {sortOption.option !== sortDateOptions.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        )}
        <ScrollView horizontal>
          {sortRoleOptions.map((sortOption) => (
            <RadioButton
              key={sortOption.option}
              value={sortOption.option}
              onPress={() => handleSortRoleOptionChanged(sortOption.option)}
              label={sortOption.name}
              stateValue={sortRoleOptionsSelected}
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
    padding: 10,
  },
  option: {
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
  },
  optionSelected: {
    marginBottom: 5,
    width: "100%",
    textAlign: "center",
    color: colors.buttonPrimary,
    fontWeight: "bold",
  },
  separator: {
    height: 3,
    width: "75%",
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  sortButton: {
    padding: 5,
    borderRadius: 20,
  },
  sortTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sortView: {
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
    flexDirection: "column",
  },
  sortOptions: {
    marginTop: 10,
    width: "100%",
  },
  welcome: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.buttonPrimary,
  },
});

export default HomeScreen;
