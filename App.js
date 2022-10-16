import { StyleSheet, View, Text } from "react-native";

import { AuthProvider } from "./app/auth/AuthContext";
import AppNavigation from "./app/navigation/AppNavigation.navigation";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
