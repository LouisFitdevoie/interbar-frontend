import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useFormikContext } from "formik";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import format from "date-fns/format";

import ErrorMessage from "./ErrorMessage";
import AppText from "../AppText";
import colors from "../../config/colors";
import AppButton from "../AppButton";

function AppDateTimePicker({
  containerStyle,
  label,
  mode,
  name,
  ...otherProperties
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  if (Platform.OS === "ios") {
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
            minimumDate={
              name === "endDate"
                ? values["startDate"]
                : name === "birthday"
                ? new Date(1900, 0, 1)
                : new Date()
            }
            accentColor={colors.buttonPrimary}
            {...otherProperties}
          />
        </View>
        <ErrorMessage
          error={errors[name]}
          visible={touched[name]}
          style={{ marginTop: 5 }}
        />
      </>
    );
  } else {
    const handleDateChange = (name, date) => {
      const dateSelected = new Date(date);
      setFieldValue(name, dateSelected);
      if (name === "startDate") {
        setFieldValue("endDate", dateSelected);
      }
    };
    const openCalendar = () => {
      DateTimePickerAndroid.open({
        onblur: () => setFieldTouched(name),
        value: values[name],
        mode: "date",
        onChange: (event, selectedDate) => handleDateChange(name, selectedDate),
        minimumDate:
          name === "endDate"
            ? values["startDate"]
            : name === "birthday"
            ? new Date(1900, 0, 1)
            : new Date(),
        positiveButtonLabel: "Valider",
        negativeButtonLabel: "Annuler",
      });
    };
    const openTimePicker = () => {
      DateTimePickerAndroid.open({
        onblur: () => setFieldTouched(name),
        value: values[name],
        mode: "time",
        onChange: (event, selectedDate) => {
          const dateSelected = new Date(selectedDate);
          setFieldValue(name, dateSelected);
        },
        minimumDate:
          name === "endDate"
            ? values["startDate"]
            : name === "birthday"
            ? new Date(1900, 0, 1)
            : new Date(),
        positiveButtonLabel: "Valider",
        negativeButtonLabel: "Annuler",
      });
    };

    return (
      <>
        <View style={[styles.dateTimePickerView, containerStyle]}>
          <AppText style={styles.text}>
            {label} {format(values[name], "dd/MM/yyyy")} ??{" "}
            {format(values[name], "HH:mm")}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <AppButton
              title="Choisir la date"
              onPress={openCalendar}
              style={{ width: "50%" }}
            />
            {name != "birthday" && (
              <AppButton
                title="Choisir l'heure"
                onPress={openTimePicker}
                style={{ marginLeft: 10, width: "50%" }}
              />
            )}
          </View>
        </View>
        <ErrorMessage
          error={errors[name]}
          visible={touched[name]}
          style={{ marginTop: 5 }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  dateTimePicker: {
    flex: 1,
  },
  dateTimePickerView: {
    width: "100%",
    flexDirection: Platform.OS === "ios" ? "row" : "column",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  text: {
    color: colors.primary,
  },
});

export default AppDateTimePicker;
