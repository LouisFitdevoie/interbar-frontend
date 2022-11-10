import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import HomeScreen from "../screens/HomeScreen";
import EventDefaultScreen from "../screens/EventsTab/EventDefaultScreen";

const Stack = createStackNavigator();

function EventsStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EventDefault"
        component={EventDefaultScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default EventsStack;
