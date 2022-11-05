import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "../config/colors";
import JoinEventScreen from "../screens/JoinEventTab/JoinEventScreen";

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
            color: colors.primary,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default JoinEventStack;
