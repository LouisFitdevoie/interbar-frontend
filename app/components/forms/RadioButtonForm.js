import { useFormikContext } from "formik";
import React from "react";

import RadioButton from "../RadioButton";

function RadioButtonForm({ value, name, label }) {
  const { setFieldTouched, setFieldValue, values } = useFormikContext();
  return (
    <RadioButton
      value={value}
      stateValue={values[name]}
      onPress={() => setFieldValue(name, value)}
      label={label}
      onBlur={() => setFieldTouched(name)}
    />
  );
}

export default RadioButtonForm;
