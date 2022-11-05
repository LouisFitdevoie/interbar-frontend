import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";

import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import colors from "../../config/colors";
import RadioButtonForm from "../../components/forms/RadioButtonForm";
import Screen from "../../components/Screen";
import createProductValidator from "../../validators/createProduct.validator.js";
import RadioButtonGroupForm from "../../components/forms/RadioButtonGroupForm";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import productsAPI from "../../api/products.api";

function CreateProductScreen(props) {
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);
  const [createProductError, setCreateProductError] = useState(null);
  const { navigation } = props;
  const eventId =
    props.route.params.eventId != null ? props.route.params.eventId : null;

  const handleSubmit = ({ name, category, description }) => {
    setIsLoading(true);
    setCreateProductError(null);
    productsAPI
      .createProduct(userAccessToken, name, category, description)
      .then((res) => {
        setIsLoading(false);
        if (res.data.success != null) {
          navigation.navigate("AddProductTarif", { eventId });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setCreateProductError("Impossible de communiquer avec le serveur");
          console.log(err);
        } else {
          const errMessage = err.response.data.error;
          console.log(err.response.status + " " + errMessage);
          if (err.response.status === 400) {
            setCreateProductError(
              "Un produit portant le même nom existe déjà dans la base de données"
            );
            console.log(errMessage);
          } else {
            setCreateProductError("Une erreur est survenue");
            console.log(errMessage);
          }
        }
      });
    setIsLoading(false);
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          name: "",
          category: "",
          description: "",
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={createProductValidator}
      >
        <AppFormField
          autoCapitalize="words"
          autoCorrect={true}
          keyboardAppearance={colors.colorScheme}
          keyboardType="default"
          name="name"
          placeholder="Nom du produit"
          textContentType="none"
        />
        <RadioButtonGroupForm name="category">
          <RadioButtonForm name="category" value="0" label="Nourriture" />
          <RadioButtonForm
            name="category"
            value="1"
            label="Boisson alcoolisée"
          />
          <RadioButtonForm name="category" value="2" label="Soft" />
        </RadioButtonGroupForm>
        <AppFormField
          autoCapitalize="sentences"
          autoCorrect={true}
          keyboardAppearance={colors.colorScheme}
          keyboardType="default"
          name="description"
          placeholder="Description (facultatif)"
          textContentType="none"
        />
        <SubmitButton title="Valider" />
        <ErrorMessage
          error={createProductError}
          visible={createProductError != null}
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
});

export default CreateProductScreen;
