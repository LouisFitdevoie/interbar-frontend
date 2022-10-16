import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import colors from "../config/colors";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: "Inscription",
          headerTitleStyle: {
            fontSize: 22,
          },
          headerBackTitle: "Connexion",
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerTintColor: colors.white,
        }}
      />
    </Stack.Navigator>
  );
}
