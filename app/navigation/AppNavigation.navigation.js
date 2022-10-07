import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import LottieView from "lottie-react-native";

import AuthStack from "./AuthStack.navigation.js";
import { AuthContext } from "../auth/AuthContext.js";
import AppStack from "./AppStack.navigation.js";
import LoadingIndicator from "../components/LoadingIndicator.js";

function AppNavigation(props) {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <NavigationContainer>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNavigation;
