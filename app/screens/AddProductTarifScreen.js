import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";

import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";

function AddProductTarifScreen(props) {
  const [searchValue, setSearchValue] = useState("");
  const [clicked, setClicked] = useState(false);

  return (
    <Screen style={styles.container}>
      <View>
        <SearchBox
          clicked={clicked}
          setClicked={setClicked}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <AppButton
          title="Ajouter un produit"
          onPress={() => console.log(searchValue)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default AddProductTarifScreen;
