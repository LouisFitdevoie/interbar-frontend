import React from "react";
import { View, StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";
import colors from "../../config/colors";

function AppFormFieldNumber({ label, name, width, ...otherProperties }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <AppText style={styles.labelStyle}>{label}</AppText>
        <AppTextInput
          keyboardType="numeric"
          onBlur={() => setFieldTouched(name)}
          onChangeText={(text) => setFieldValue(name, text)}
          value={values[name]}
          width="50%"
          {...otherProperties}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  labelStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export default AppFormFieldNumber;
