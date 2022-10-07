import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./app/navigation/AuthStack.navigation";

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
