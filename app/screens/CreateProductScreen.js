import React from "react";
import { View, StyleSheet } from "react-native";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import RadioButtonForm from "../components/forms/RadioButtonForm";
import Screen from "../components/Screen";

function CreateProductScreen(props) {
  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          name: "",
          category: "",
          buyingPrice: "",
          sellingPrice: "",
          stock: "",
          description: "",
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={null}
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
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance={colors.colorScheme}
          keyboardType="decimal-pad"
          name="buyingPrice"
          placeholder="Prix d'achat"
          textContentType="none"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance={colors.colorScheme}
          keyboardType="decimal-pad"
          name="sellingPrice"
          placeholder="Prix de vente"
          textContentType="none"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance={colors.colorScheme}
          keyboardType="number-pad"
          name="stock"
          placeholder="Stock"
          textContentType="none"
        />
        <SubmitButton title="Valider" />
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
