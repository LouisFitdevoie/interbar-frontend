import React from "react";
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";

function SearchBox({
  clicked,
  setClicked,
  searchValue,
  setSearchValue,
  onChangeText,
  onCloseCliked,
}) {
  return (
    <View style={styles.container}>
      <View
        style={clicked ? styles.searchBoxClicked : styles.searchBoxNotClicked}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={colors.primary}
          style={{ marginLeft: 1 }}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Rechercher"
          value={searchValue}
          onChangeText={onChangeText}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {clicked && (
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={colors.primary}
            onPress={() => {
              onCloseCliked();
            }}
            style={{ padding: 1 }}
          />
        )}
      </View>
      {clicked && (
        <View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
            style={{
              width: "100%",
              marginLeft: 5,
            }}
          >
            <AppText
              style={{
                width: "100%",
                padding: 2,
                textAlign: "center",
                color: colors.primary,
              }}
            >
              Annuler
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  searchBoxClicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: colors.searchBoxClicked,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  searchBoxNotClicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: colors.searchBoxNotClicked,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.searchBoxNotClicked,
    alignItems: "center",
  },
  textInput: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});

export default SearchBox;
