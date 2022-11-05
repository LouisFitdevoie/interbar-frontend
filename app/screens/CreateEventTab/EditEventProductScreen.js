import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import AppForm from "../../components/forms/AppForm";
import SubmitButton from "../../components/forms/SubmitButton";
import ErrorMessage from "../../components/forms/ErrorMessage";
import LoadingIndicator from "../../components/LoadingIndicator";
import colors from "../../config/colors";
import editEventProductValidator from "../../validators/editEventProduct.validator.js";
import { AuthContext } from "../../auth/AuthContext";
import AppText from "../../components/AppText";
import AppFormFieldNumber from "../../components/forms/AppFormFieldNumber";
import eventProductAPI from "../../api/eventProduct.api";

function EditEventProductScreen(props) {
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);
  const { navigation } = props;

  const [editEventProductError, setEditEventProductError] = useState(null);
  const {
    eventId,
    eventProductId,
    name,
    category,
    description,
    buyingPrice,
    sellingPrice,
    stock,
  } = props.route.params;

  const handleSubmit = ({ newBuyingPrice, newSellingPrice, newStock }) => {
    setIsLoading(true);
    setEditEventProductError(null);
    eventProductAPI
      .editEventProduct(
        eventProductId,
        newStock,
        parseFloat(newBuyingPrice) != buyingPrice
          ? parseFloat(newBuyingPrice.replace(",", "."))
          : buyingPrice,
        parseFloat(newSellingPrice) != sellingPrice
          ? parseFloat(newSellingPrice.replace(",", "."))
          : sellingPrice,
        userAccessToken
      )
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          navigation.navigate("CreatePriceList", { eventId });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setEditEventProductError("Impossible de communiquer avec le serveur");
          console.log(err);
        } else {
          const errMessage = err.response.data.error;
          if (err.response.status === 400) {
            setEditEventProductError(
              "Aucune modification n'a été détectée pour ce produit"
            );
          } else if (err.response.status === 404) {
            setEditEventProductError(
              "Le produit n'a pas encore été ajouté à l'évènement"
            );
          } else if (err.response.status === 403) {
            setEditEventProductError(
              "Vous ne pouvez pas modifier ce produit car l'évènement est en cours ou est terminé"
            );
          } else {
            setEditEventProductError(errMessage);
          }
        }
      });
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          newBuyingPrice: buyingPrice.toString(),
          newSellingPrice: sellingPrice.toString(),
          newStock: stock.toString(),
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={editEventProductValidator}
      >
        <View style={styles.productInfosContainer}>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Nom du produit :</AppText>
            <AppText style={styles.productData}>{name}</AppText>
          </View>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Catégorie :</AppText>
            <AppText style={styles.productData}>
              {category === 0
                ? "Nourriture"
                : category === 1
                ? "Boisson alcoolisée"
                : category === 2
                ? "Soft"
                : "Erreur"}
            </AppText>
          </View>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Description :</AppText>
            <AppText style={styles.productData}>
              {description != null ? description : "Aucune description"}
            </AppText>
          </View>
        </View>
        <AppFormFieldNumber
          label="Prix d'achat (€) :"
          name="newBuyingPrice"
          placeholder="Prix d'achat"
        />
        <AppFormFieldNumber
          label="Prix de vente (€) :"
          name="newSellingPrice"
          placeholder="Prix de vente"
        />
        <AppFormFieldNumber
          label="Stock :"
          name="newStock"
          placeholder="Stock"
        />
        <SubmitButton title="Modifier le produit" />
        <ErrorMessage
          error={editEventProductError}
          visible={editEventProductError != null}
        />
      </AppForm>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  formFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  infoTitle: {
    flexDirection: "row",
  },
  productData: {
    marginLeft: 10,
    fontSize: 18,
  },
  productInfosContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  productText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default EditEventProductScreen;
