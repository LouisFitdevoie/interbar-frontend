import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack.navigation.js";
import { AuthContext } from "../auth/AuthContext.js";
import AppStack from "./AppStack.navigation.js";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AppNavigation(props) {
  const { userAccessToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userAccessToken !== null ? (
        <SafeAreaProvider>
          <AppStack />
        </SafeAreaProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

export default AppNavigation;
