import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import LogoutTestScreen from "../screens/LogoutTestScreen";

const Tab = createBottomTabNavigator();

function AppStack(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Events"
        component={LogoutTestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home-outline"
              size={30}
              color={color}
              style={{ paddingTop: 5 }}
            />
          ),
          tabBarLabel: "Mes évènements",
          tabBarLabelStyle: {
            fontSize: 10,
            paddingBottom: 5,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      />
      <Tab.Screen
        name="Join"
        component={LogoutTestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="arrow-redo-circle-outline"
              size={35}
              color={color}
              style={{ paddingTop: 5 }}
            />
          ),
          tabBarLabel: "Rejoindre",
          tabBarLabelStyle: {
            fontSize: 10,
            paddingBottom: 5,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      />
      <Tab.Screen
        name="Create"
        component={LogoutTestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="add-circle-outline"
              size={35}
              color={color}
              style={{ paddingTop: 5 }}
            />
          ),
          tabBarLabel: "Créer",
          tabBarLabelStyle: {
            fontSize: 10,
            paddingBottom: 5,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={LogoutTestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="settings-outline"
              size={30}
              color={color}
              style={{ paddingTop: 5 }}
            />
          ),
          tabBarLabel: "Paramètres",
          tabBarLabelStyle: {
            fontSize: 10,
            paddingBottom: 5,
          },
          tabBarStyle: {
            height: 60,
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

export default AppStack;
