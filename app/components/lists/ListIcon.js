import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListIcon({
  name,
  size = 40,
  backgroundColor = "#000",
  iconColor = "#fff",
}) {
  return (
    <View
      style={{
        paddingLeft: 1,
        paddingTop: 1,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name={name} size={size / 2} color={iconColor} />
    </View>
  );
}

export default ListIcon;
