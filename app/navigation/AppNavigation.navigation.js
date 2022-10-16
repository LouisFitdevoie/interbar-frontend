import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack.navigation.js";
import { AuthContext } from "../auth/AuthContext.js";
import AppStack from "./AppStack.navigation.js";

function AppNavigation(props) {
  const { userAccessToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userAccessToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNavigation;
