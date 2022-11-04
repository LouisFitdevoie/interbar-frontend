import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [clicked, setClicked] = useState(false);

  const getExistingProducts = () => {
    setIsLoading(true);
    productsAPI.getAllProducts(userAccessToken).then((res) => {
      setExistingProducts(res.data);
      setDisplayedProducts(res.data);
      setIsLoading(false);
    });
  };

  const handleTextChanged = (value) => {
    setSearchValue(value);
    const sorted = existingProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedProducts(sorted);
  };

  const handleCloseCliked = () => {
    setSearchValue("");
    setDisplayedProducts(existingProducts);
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
        onChangeText={handleTextChanged}
        onCloseCliked={handleCloseCliked}
      />
      <ListSeparator />
      <View style={styles.sortView}>
        <AppText style={{ fontSize: 22 }}>
          Tous les produits ({displayedProducts.length})
        </AppText>
        <MaterialCommunityIcons
          name="sort"
          size={24}
          color={colors.buttonPrimary}
        />
      </View>
      <KeyboardAwareFlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => console.log(item.name + " clicked")}>
            <View style={styles.productView}>
              <AppText style={styles.product}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </AppText>
              <View style={styles.addButton}>
                <AppText style={{ color: colors.buttonPrimary }}>
                  Ajouter
                </AppText>
                <MaterialCommunityIcons
                  name="plus"
                  size={24}
                  color={colors.buttonPrimary}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <ListSeparator />}
        style={styles.list}
      />
      {displayedProducts.length === 0 && (
        <View style={styles.noProductView}>
          <AppText style={styles.noProductText}>
            Aucun produit ne correspond à votre recherche
          </AppText>
        </View>
      )}
      <AppButton
        title="Ajouter un produit"
        onPress={() => navigation.navigate("CreateProduct", { eventId })}
        style={{ marginBottom: 20 }}
      />
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  noProductText: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  noProductView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  product: {
    fontSize: 16,
  },
  productView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
