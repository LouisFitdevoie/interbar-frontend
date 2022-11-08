import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { AuthContext } from "../../auth/AuthContext";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import Screen from "../../components/Screen";
import SearchBox from "../../components/SearchBox";
import productsAPI from "../../api/products.api";
import LoadingIndicator from "../../components/LoadingIndicator";
import colors from "../../config/colors";
import ListSeparator from "../../components/lists/ListSeparator";

function AddProductTarifScreen(props) {
  const isFocused = useIsFocused();
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);
  const eventId = props.route.params.eventId;
  const { navigation } = props;

  const [existingProducts, setExistingProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [clicked, setClicked] = useState(false);
  const [sortOptionSelected, setSortOptionSelected] =
    useState("Tous les produits");
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getExistingProducts = () => {
    setIsLoading(true);
    productsAPI.getAllProducts(userAccessToken).then((res) => {
      setExistingProducts(res.data);
      setDisplayedProducts(res.data);
      setSortOptionSelected("Tous les produits");
      setIsLoading(false);
    });
  };

  const handleTextChanged = (value) => {
    setSearchValue(value);
    setSortOptionSelected("Tous les produits");
    const sorted = existingProducts.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedProducts(sorted);
  };

  const handleCloseCliked = () => {
    setSearchValue("");
    setDisplayedProducts(existingProducts);
  };

  const handleSortOptionChanged = (option, category) => {
    setIsLoading(true);
    setSearchValue("");
    setSortOptionSelected(option);
    if (option === "Tous les produits") {
      setDisplayedProducts(existingProducts);
    } else {
      const sorted = existingProducts.filter(
        (product) => product.category === category
      );
      setDisplayedProducts(sorted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isFocused && getExistingProducts();
    setSortOptionSelected("Tous les produits");
  }, [isFocused]);

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
        <View style={styles.sortTitle}>
          <AppText style={{ fontSize: 22 }}>
            {sortOptionSelected} ({displayedProducts.length})
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
        {isSortOptionsVisible && (
          <View style={styles.sortOptions}>
            <TouchableOpacity
              onPress={() => handleSortOptionChanged("Tous les produits")}
            >
              <AppText
                style={
                  sortOptionSelected === "Tous les produits"
                    ? styles.optionSelected
                    : styles.option
                }
              >
                Tous les produits
              </AppText>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => handleSortOptionChanged("Nourriture", 0)}
            >
              <AppText
                style={
                  sortOptionSelected === "Nourriture"
                    ? styles.optionSelected
                    : styles.option
                }
              >
                Nourriture
              </AppText>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => handleSortOptionChanged("Boisson alcoolisée", 1)}
            >
              <AppText
                style={
                  sortOptionSelected === "Boisson alcoolisée"
                    ? styles.optionSelected
                    : styles.option
                }
              >
                Boisson alcoolisée
              </AppText>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={() => handleSortOptionChanged("Soft", 2)}
            >
              <AppText
                style={
                  sortOptionSelected === "Soft"
                    ? styles.optionSelected
                    : styles.option
                }
              >
                Soft
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => getExistingProducts()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CreateEventProduct", {
                eventId: eventId,
                productId: item.id,
                productName: item.name,
                productCategory: item.category,
                productDescription: item.description,
              })
            }
          >
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
    alignItems: "flex-end",
  },
  sortOptions: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 20,
    borderTopRightRadius: 0,
    width: 250,
    padding: 5,
  },
});

export default AddProductTarifScreen;
