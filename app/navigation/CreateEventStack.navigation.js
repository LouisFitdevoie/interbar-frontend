import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderBackButton } from "@react-navigation/elements";
import { Alert } from "react-native";

import CreateEventInformationsScreen from "../screens/CreateEventTab/CreateEventInformationsScreen";
import CreateEventScreen from "../screens/CreateEventTab/CreateEventScreen";
import colors from "../config/colors";
import CreatePriceListScreen from "../screens/CreateEventTab/CreatePriceListScreen";
import AddProductTarifScreen from "../screens/CreateEventTab/AddProductTarifScreen";
import CreateProductScreen from "../screens/CreateEventTab/CreateProductScreen";
import CreateEventProductScreen from "../screens/CreateEventTab/CreateEventProductScreen";
import EditEventProductScreen from "../screens/CreateEventTab/EditEventProductScreen";

const Stack = createNativeStackNavigator();

export default function CreateEventStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateEventInformations"
        component={CreateEventInformationsScreen}
        options={{
          headerTitle: "Informations",
          headerTitleStyle: {
            fontSize: 22,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          headerShown: true,
          headerTitle: "Créer un évènement",
          headerTitleStyle: {
            fontSize: 22,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          headerTransparent: true,
          headerTintColor: colors.white,
          headerLeft: () => (
            <HeaderBackButton
              tintColor={colors.white}
              onPress={() => {
                Alert.alert(
                  "Voulez-vous vraiment annuler la création de l'évènement ?",
                  "Toutes les informations saisies seront perdues.",
                  [
                    {
                      text: "Annuler",
                      style: "cancel",
                    },
                    {
                      text: "Confirmer",
                      style: "destructive",
                      onPress: () => {
                        navigation.navigate("CreateEventInformations");
                      },
                    },
                  ]
                );
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="CreatePriceList"
        component={CreatePriceListScreen}
        options={{
          headerShown: true,
          headerTitle: "Créer le tarif",
          headerTitleStyle: {
            fontSize: 22,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          headerTransparent: true,
          headerTintColor: colors.white,
          headerLeft: () => (
            <HeaderBackButton
              tintColor={colors.white}
              onPress={() => {
                Alert.alert(
                  "Voulez-vous vraiment annuler la création du tarif de l'évènement ?",
                  "Toutes les informations saisies seront perdues et vous devrez le recréer avant le début de l'évènement.",
                  [
                    {
                      text: "Annuler",
                      style: "cancel",
                    },
                    {
                      text: "Confirmer",
                      style: "destructive",
                      onPress: () => {
                        navigation.navigate("CreateEventInformations");
                      },
                    },
                  ]
                );
              }}
            />
          ),
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
          headerTransparent: true,
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
          headerTransparent: true,
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
          headerTransparent: true,
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
          headerTransparent: true,
          headerTintColor: colors.white,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
