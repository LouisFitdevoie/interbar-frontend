import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import HomeScreen from "../screens/HomeScreen";
import EventDefaultScreen from "../screens/EventsTab/EventDefaultScreen";
import EventDetailsScreen from "../screens/EventsTab/EventDetailsScreen";
import EditEventEndDateScreen from "../screens/EventsTab/EditEventEndDateScreen";
import UserToSellerScreen from "../screens/EventsTab/UserToSellerScreen";
import TarifScreen from "../screens/EventsTab/TarifScreen";
import EditEventScreen from "../screens/EventsTab/EditEventScreen";
import CreatePriceListScreen from "../screens/CreateEventTab/CreatePriceListScreen";
import AddProductTarifScreen from "../screens/CreateEventTab/AddProductTarifScreen";
import CreateProductScreen from "../screens/CreateEventTab/CreateProductScreen";
import CreateEventProductScreen from "../screens/CreateEventTab/CreateEventProductScreen";
import EditEventProductScreen from "../screens/CreateEventTab/EditEventProductScreen";
import CommandScreen from "../screens/EventsTab/CommandScreen";

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
        <Stack.Screen
          name="EditPriceList"
          component={CreatePriceListScreen}
          options={{
            headerShown: true,
            headerTitle: "Modifier le tarif",
            headerTitleStyle: {
              fontSize: 22,
              color: colors.white,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="AddProductTarif"
          component={AddProductTarifScreen}
          options={{
            headerShown: true,
            headerTitle: "Nouveau produit",
            headerTitleStyle: {
              fontSize: 22,
              color: colors.white,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CreateProduct"
          component={CreateProductScreen}
          options={{
            headerShown: true,
            headerTitle: "Nouveau produit",
            headerTitleStyle: {
              fontSize: 22,
              color: colors.white,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CreateEventProduct"
          component={CreateEventProductScreen}
          options={{
            headerShown: true,
            headerTitle: "Ajouter le produit",
            headerTitleStyle: {
              fontSize: 22,
              color: colors.white,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="EditEventProduct"
          component={EditEventProductScreen}
          options={{
            headerShown: true,
            headerTitle: "Modifier le produit",
            headerTitleStyle: {
              fontSize: 22,
              color: colors.white,
            },
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerTintColor: colors.white,
            headerBackTitleVisible: false,
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
        <Stack.Screen
          name="UserToSeller"
          component={UserToSellerScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerBackTitleVisible: false,
            headerTintColor: colors.white,
            headerTitle: "Devenir vendeur",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="Tarif"
          component={TarifScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerBackTitleVisible: false,
            headerTintColor: colors.white,
            headerTitle: "Tarif",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="EditEvent"
          component={EditEventScreen}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
            },
            headerBackTitleVisible: false,
            headerTintColor: colors.white,
            headerTitle: "Modifier l'évènement",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="Command"
          component={CommandScreen}
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
    </Stack.Navigator>
  );
}

export default EventsStack;
