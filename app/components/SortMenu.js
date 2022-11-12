import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";
import RadioButton from "./RadioButton";

function SortMenu({
  sortOptionSelected,
  setSortOptionSelected,
  scrollOptionSelected,
  setScrollOptionSelected,
  sortOptions,
  scrollOptions,
  displayedItems,
  handleSort,
}) {
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const handleSortOptionChanged = (option) => {
    setSortOptionSelected(option);
    setIsSortOptionsVisible(false);
  };

  const handleScrollOptionChanged = (option) => {
    setScrollOptionSelected(option);
  };

  useEffect(() => {
    handleSort();
  }, [sortOptionSelected, scrollOptionSelected]);

  return (
    <View style={styles.sortMenuContainer}>
      <View style={styles.sortView}>
        <View style={styles.sortTitle}>
          <AppText style={{ fontSize: 20 }}>
            {
              sortOptions.find((option) => option.value === sortOptionSelected)
                .name
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
              color={isSortOptionsVisible ? colors.white : colors.buttonPrimary}
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
        {scrollOptions.map((scrollOption) => (
          <RadioButton
            key={scrollOption.value}
            value={scrollOption.value}
            onPress={() => handleScrollOptionChanged(scrollOption.value)}
            label={scrollOption.name}
            stateValue={scrollOptionSelected}
            style={{ paddingRight: 20 }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default SortMenu;
