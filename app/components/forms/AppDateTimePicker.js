import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";
import colors from "../../config/colors";

function AppDateTimePicker({
  containerStyle,
  label,
  mode,
  name,
  ...otherProperties
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  return (
    <>
      <View style={[styles.dateTimePickerView, containerStyle]}>
        <AppText style={styles.text}>{label}</AppText>
        <DateTimePicker
          onBlur={() => setFieldTouched(name)}
          value={values[name]}
          mode={mode}
          style={styles.dateTimePicker}
          onChange={(event, selectedDate) => {
            const dateSelected = new Date(selectedDate);
            setFieldValue(name, dateSelected);
          }}
          {...otherProperties}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  dateTimePicker: {
    flex: 1,
  },
  dateTimePickerView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    color: colors.primary,
  },
});

export default AppDateTimePicker;
