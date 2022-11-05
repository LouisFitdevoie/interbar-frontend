import React from "react";
import { View, StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";

function RadioButtonGroupForm({ children, name }) {
  const { errors, touched } = useFormikContext();
  return (
    <View style={styles.container}>
      {children}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RadioButtonGroupForm;
