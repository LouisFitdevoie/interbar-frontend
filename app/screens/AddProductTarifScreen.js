import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AuthContext } from "../auth/AuthContext";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import productsAPI from "../api/products.api";
import LoadingIndicator from "../components/LoadingIndicator";
import colors from "../config/colors";
import ListSeparator from "../components/lists/ListSeparator";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

function AddProductTarifScreen(props) {
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);
  const eventId = props.route.params.eventId;
  const { navigation } = props;

  const [existingProducts, setExistingProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [clicked, setClicked] = useState(false);

  const getExistingProducts = () => {
    setIsLoading(true);
    productsAPI.getAllProducts(userAccessToken).then((res) => {
      setExistingProducts(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getExistingProducts();
  }, []);

  return (
    <Screen style={styles.container}>
      <SearchBox
        clicked={clicked}
        setClicked={setClicked}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <ListSeparator />
      <View style={styles.sortView}>
        <AppText style={{ fontSize: 22 }}>
          Tous les produits ({existingProducts.length})
        </AppText>
        <MaterialCommunityIcons
          name="sort"
          size={24}
          color={colors.buttonPrimary}
        />
      </View>
      <KeyboardAwareFlatList
        data={existingProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productView}>
            <AppText style={styles.product}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </AppText>
          </View>
        )}
        ItemSeparatorComponent={() => <ListSeparator />}
        style={styles.list}
      />
      {isLoading && <LoadingIndicator />}
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
    paddingHorizontal: 10,
    width: "100%",
  },
  product: {
    fontSize: 16,
  },
  productView: {
    marginVertical: 10,
    width: "100%",
  },
  sortView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
});

export default AddProductTarifScreen;
