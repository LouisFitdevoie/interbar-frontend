import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

export default {
  black: "#090909",
  blue: "#70B7C3",
  buttonPrimary: colorScheme === "light" ? "#497179" : "#7A3729",
  colorScheme,
  danger: "#BE381F",
  green: "#58C091",
  light: "#F0F0F0",
  textInputRegistrationPlaceholder:
    colorScheme === "light" ? "#FFFFFF90" : "#E4DED2",
  textInputDefaultPlaceholder:
    colorScheme === "light" ? "#21495175" : "#E4DED2",
  primary: colorScheme === "light" ? "#214951" : "#E4DED2",
  white: "#FFFFFF",
};
