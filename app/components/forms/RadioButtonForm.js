import { useFormikContext } from "formik";
import React from "react";
import { View, StyleSheet } from "react-native";
import RadioButton from "../RadioButton";
import ErrorMessage from "./ErrorMessage";

function RadioButtonForm({ value, name, label }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  return (
    <>
      <RadioButton
        value={value}
        stateValue={values[name]}
        onPress={setFieldValue(name, value)}
        label={label}
        onBlur={() => setFieldTouched(name)}
      />
      <ErrorMessage
        error={errors[name]}
        visible={touched[name]}
        style={{ marginTop: 5 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RadioButtonForm;
