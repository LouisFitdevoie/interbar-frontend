import React from "react";
import { View, TextInput } from "react-native";

import defaultStyle from "../config/styles";

function AppTextInput({ width = "100%", ...otherProperties }) {
  return (
    <View style={[defaultStyle.textInputRegistrationContainer, { width }]}>
      <TextInput
        style={defaultStyle.textInputRegistrationText}
        placeholderTextColor={
          defaultStyle.colors.textInputRegistrationPlaceholder
        }
        {...otherProperties}
      />
    </View>
  );
}

export default AppTextInput;
