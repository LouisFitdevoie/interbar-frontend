import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderBackButton } from "@react-navigation/elements";

import colors from "../config/colors";
import JoinEventScreen from "../screens/JoinEventTab/JoinEventScreen";
import JoinEventDetailsScreen from "../screens/JoinEventTab/JoinEventDetailsScreen";

const Stack = createNativeStackNavigator();

function JoinEventStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JoinEvent"
        component={JoinEventScreen}
        options={{
          headerTitle: "Rejoindre un évènement",
          headerTitleStyle: {
            fontSize: 22,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          unmountOnBlur: true,
        }}
      />
      <Stack.Screen
        name="JoinEventDetails"
        component={JoinEventDetailsScreen}
        options={{
          headerTitle: "Confirmer",
          headerTitleStyle: {
            fontSize: 22,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.buttonPrimary,
          },
          headerTintColor: colors.white,
          headerLeft: () => (
            <HeaderBackButton
              tintColor={colors.white}
              onPress={() => {
                navigation.navigate("JoinEvent");
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default JoinEventStack;
