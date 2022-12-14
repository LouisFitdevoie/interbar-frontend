import { Platform } from "react-native";

import colors from "./colors";

export default {
  colors,
  text: {
    color: colors.black,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  textInputRegistrationText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textInputRegistrationContainer: {
    backgroundColor: "#70B7C325",
    borderColor: "#FFFFFF90",
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 5,
    overflow: "hidden",
  },
  textInputDefaultText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textInputDefaultContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 10,
    overflow: "hidden",
  },
};
