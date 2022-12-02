import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DataUsageScreen from "../screens/DataUsageScreen";
import colors from "../config/colors";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
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
      </Stack.Group>
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
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
