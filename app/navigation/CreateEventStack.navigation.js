import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateEventInformationsScreen from "../screens/CreateEventInformationsScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import colors from "../config/colors";

const Stack = createNativeStackNavigator();

export default function CreateEventStack() {
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
          headerBackTitle: "Retour",
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerTintColor: colors.primary,
        }}
      />
    </Stack.Navigator>
  );
}
