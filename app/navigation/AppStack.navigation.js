import React, { useContext, useEffect } from "react";

import colors from "../config/colors";
import { AuthContext } from "../auth/AuthContext";
import DataUsageScreen from "../screens/DataUsageScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AppTabNavigator from "./AppTabNavigator.navigation";

const Stack = createStackNavigator();

function AppStack(props) {
  const { updateAccessToken } = useContext(AuthContext);

  const timeToUpdateAccessToken = 10 * 60 * 1000; // 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateAccessToken();
    }, timeToUpdateAccessToken);

    return () => clearInterval(interval);
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={AppTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="DataUsage"
          component={DataUsageScreen}
          options={{
            headerTitle: "Utilisation des données",
            headerTitleStyle: {
              fontSize: 22,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerTransparent: false,
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default AppStack;
