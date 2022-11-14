import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import HomeScreen from "../screens/HomeScreen";
import EventDefaultScreen from "../screens/EventsTab/EventDefaultScreen";
import EventDetailsScreen from "../screens/EventsTab/EventDetailsScreen";
import EditEventEndDateScreen from "../screens/EventsTab/EditEventEndDateScreen";

const Stack = createStackNavigator();

function EventsStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Group>
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
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
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
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "modal",
        }}
      >
        <Stack.Screen
          name="EditEventEndDate"
          component={EditEventEndDateScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerBackTitleVisible: false,
            headerTintColor: colors.white,
            headerTitle: "Changer la date de fin",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default EventsStack;
