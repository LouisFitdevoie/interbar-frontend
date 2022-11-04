import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import colors from "../config/colors";
import RadioButtonForm from "../components/forms/RadioButtonForm";
import Screen from "../components/Screen";
import createProductValidator from "../validators/createProduct.validator.js";

function CreateProductScreen(props) {
  const [createProductError, setCreateProductError] = useState(false);

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          name: "",
          category: "food",
          description: "",
        }}
        onSubmit={(values) => console.log(values)}
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
        <RadioButtonForm name="category" value="food" label="Nourriture" />
        <RadioButtonForm
          name="category"
          value="alcohol"
          label="Boisson alcoolisée"
        />
        <RadioButtonForm name="category" value="soft" label="Soft" />
        <AppFormField
          autoCapitalize="sentences"
          autoCorrect={true}
          keyboardAppearance={colors.colorScheme}
          keyboardType="default"
          name="description"
          placeholder="Description (facultatif)"
          textContentType="none"
        />
        <SubmitButton title="Valider" disabled={createProductError} />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});

export default CreateProductScreen;
