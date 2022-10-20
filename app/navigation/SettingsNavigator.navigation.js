import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

const SettingsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerShown: true,
        headerTitle: "Paramètres",
      }}
    />
  </Stack.Navigator>
);

export default SettingsNavigator;
