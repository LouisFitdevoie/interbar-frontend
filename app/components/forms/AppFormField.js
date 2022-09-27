import React, { useState } from "react";
import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({
  birthDate = false,
  name,
  registration = false,
  width,
  ...otherProperties
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();

  if (!birthDate) {
    return (
      <>
        <AppTextInput
          onBlur={() => setFieldTouched(name)}
          onChangeText={(text) => setFieldValue(name, text)}
          registration={registration}
          value={values[name]}
          width={width}
          {...otherProperties}
        />
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </>
    );
  } else {
    const [errorDate, setErrorDate] = useState(false);
    const handleTextChange = (date) => {
      if (
        parseInt(date.slice(date.length - 1, date.length), 10) ||
        date.slice(date.length - 1, date.length) === "0" ||
        date.slice(date.length - 1, date.length) === "/"
      ) {
        setFieldValue(name, date);
      } else {
        date = date.slice(0, date.length - 1);
        setFieldValue(name, date);
      }
      if (date.length > 10) {
        date = date.slice(0, 10);
        setFieldValue(name, date);
      } else if (date.length === 10) {
        const dateToVerify = new Date(
          date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2)
        );
        if (!isNaN(dateToVerify)) {
          setErrorDate(false);
        } else {
          setErrorDate(true);
        }
      } else {
        setErrorDate(false);
      }
    };
    return (
      <>
        <AppTextInput
          onBlur={() => setFieldTouched(name)}
          onChangeText={(date) => handleTextChange(date)}
          registration={registration}
          value={values[name]}
          width={width}
          {...otherProperties}
        />
        <ErrorMessage error={errors[name]} visible={touched[name]} />
        <ErrorMessage
          error="La date de naissance n'est pas une date correcte"
          visible={errorDate}
        />
      </>
    );
  }
}

export default AppFormField;
