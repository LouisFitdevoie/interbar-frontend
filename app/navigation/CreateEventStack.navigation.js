import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateEventInformationsScreen from "../screens/CreateEventInformationsScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import colors from "../config/colors";
import { HeaderBackButton } from "@react-navigation/elements";
import { Alert } from "react-native";

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
          },
          headerTransparent: true,
          headerTintColor: colors.primary,
          headerLeft: () => (
            <HeaderBackButton
              tintColor={colors.primary}
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
    </Stack.Navigator>
  );
}
