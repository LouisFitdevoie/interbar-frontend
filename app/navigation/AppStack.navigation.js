import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import DataUsageScreen from "../screens/DataUsageScreen";
import AppTabNavigator from "./AppTabNavigator.navigation";
import EditPersonalDataScreen from "../screens/SettingsTab/EditPersonalDataScreen";
import EditPasswordScreen from "../screens/SettingsTab/EditPasswordScreen";

const Stack = createStackNavigator();

function AppStack(props) {
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
        <Stack.Screen
          name="EditPersonalData"
          component={EditPersonalDataScreen}
          options={{
            headerTitle: "Modifier mes données personnelles",
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
        <Stack.Screen
          name="EditPassword"
          component={EditPasswordScreen}
          options={{
            headerTitle: "Modifier mon mot de passe",
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
