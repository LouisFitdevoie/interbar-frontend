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
    const handleTextChange = (date) => {
      console.log(date);
      // TODO : ajouter usestate pour date
      // TODO : vérifier caractère entré -> si valide, ajouter au state sinon rien
      // TODO : après 2 premiers caractères, ajouter "/" et ajouter au state
      // TODO : après 5 premiers caractères, ajouter "/" et ajouter au state
      // TODO : vérifier que date est correcte
      // TODO : si date correcte, ajouter au state
      // TODO : setFieldValue(name, date)
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
      </>
    );
  }
}

export default AppFormField;
