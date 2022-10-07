import { ImageBackground, StyleSheet, View, Text } from "react-native";
import AppButton from "./app/components/AppButton";
import * as Yup from "yup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SubmitButton from "./app/components/forms/SubmitButton";
import AppText from "./app/components/AppText";
import AppForm from "./app/components/forms/AppForm";
import AppFormField from "./app/components/forms/AppFormField";
import Screen from "./app/components/Screen";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import colors from "./app/config/colors";

const validationSchema = Yup.object().shape({
  test: Yup.string().required().min(1).label("Test"),
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
});
