import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import AppForm from "../../components/forms/AppForm";
import SubmitButton from "../../components/forms/SubmitButton";
import ErrorMessage from "../../components/forms/ErrorMessage";
import LoadingIndicator from "../../components/LoadingIndicator";
import colors from "../../config/colors";
import createEventProductValidator from "../../validators/createEventProduct.validator.js";
import { AuthContext } from "../../auth/AuthContext";
import AppText from "../../components/AppText";
import AppFormFieldNumber from "../../components/forms/AppFormFieldNumber";
import eventProductAPI from "../../api/eventProduct.api";

function CreateEventProductScreen(props) {
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);
  const { navigation } = props;

  const [addProductToEventError, setAddProductToEventError] = useState(null);
  const eventId = props.route.params.eventId;
  const productId = props.route.params.productId;
  const isEditing = props.route.params.isEditing;

  const handleSubmit = ({
    eventId,
    productId,
    buyingPrice,
    sellingPrice,
    stock,
  }) => {
    setIsLoading(true);
    setAddProductToEventError(null);
    eventProductAPI
      .createEventProduct(
        eventId,
        productId,
        stock,
        parseFloat(buyingPrice.replace(",", ".")),
        parseFloat(sellingPrice.replace(",", ".")),
        userAccessToken
      )
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          if (!isEditing) {
            navigation.navigate("CreatePriceList", { eventId });
          } else {
            navigation.navigate("EditPriceList", { eventId, isEditing });
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setAddProductToEventError(
            "Impossible de communiquer avec le serveur"
          );
          console.log(err);
        } else {
          const errMessage = err.response.data.error;
          if (err.response.status === 409) {
            setAddProductToEventError(
              "Le produit a déjà été ajouté au tarif de l'évènement"
            );
            console.log(errMessage);
          } else if (err.response.status === 403) {
            updateAccessToken();
            setAddProductToEventError(
              "Erreur lors de l'ajout du produit à l'évènement, veuillez réessayer"
            );
          } else {
            setAddProductToEventError("Une erreur inconnue est survenue");
            console.log(errMessage);
          }
        }
      });
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          eventId: eventId,
          productId: productId,
          buyingPrice: "",
          sellingPrice: "",
          stock: "",
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={createEventProductValidator}
      >
        <View style={styles.productInfosContainer}>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Nom du produit :</AppText>
            <AppText style={styles.productData}>
              {props.route.params.productName}
            </AppText>
          </View>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Catégorie :</AppText>
            <AppText style={styles.productData}>
              {props.route.params.productCategory === 0
                ? "Nourriture"
                : props.route.params.productCategory === 1
                ? "Boisson alcoolisée"
                : props.route.params.productCategory === 2
                ? "Soft"
                : "Erreur"}
            </AppText>
          </View>
          <View style={styles.infoTitle}>
            <AppText style={styles.productText}>Description :</AppText>
            <AppText style={styles.productData}>
              {props.route.params.productDescription != null
                ? props.route.params.productDescription
                : "Aucune description"}
            </AppText>
          </View>
        </View>
        <AppFormFieldNumber
          label="Prix d'achat (€) :"
          name="buyingPrice"
          placeholder="Prix d'achat"
        />
        <AppFormFieldNumber
          label="Prix de vente (€) :"
          name="sellingPrice"
          placeholder="Prix de vente"
        />
        <AppFormFieldNumber label="Stock :" name="stock" placeholder="Stock" />
        <SubmitButton title="Ajouter à l'évènement" />
        <ErrorMessage
          error={addProductToEventError}
          visible={addProductToEventError != null}
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

export default CreateEventProductScreen;
