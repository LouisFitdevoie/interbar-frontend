import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

export default {
  black: "#090909",
  blue: "#70B7C3",
  buttonPrimary: colorScheme === "light" ? "#497179" : "#7A3729",
  buttonPrimaryDisabled: colorScheme === "light" ? "#49717970" : "#7A372970",
  colorScheme,
  danger: "#BE381F",
  green: "#58C091",
  light: "#F0F0F0",
  searchBoxClicked: "#70B7C325",
  searchBoxNotClicked: "#D9DBDA",
  textInputRegistrationPlaceholder:
    colorScheme === "light" ? "#FFFFFF90" : "#E4DED2",
  textInputDefaultPlaceholder:
    colorScheme === "light" ? "#21495175" : "#E4DED2",
  primary: colorScheme === "light" ? "#214951" : "#E4DED2",
  white: "#FFFFFF",
};
