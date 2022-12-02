import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../screens/SettingsTab/SettingsScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerShown: true,
        headerTitle: "Paramètres",
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.buttonPrimary,
        },
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
