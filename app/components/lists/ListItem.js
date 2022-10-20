import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";

function ListItem({ title, subtitle, IconComponent, onPress }) {
  return (
    <View>
      <TouchableHighlight onPress={onPress} underlayColor={colors.black}>
        <View style={styles.container}>
          {IconComponent}
          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={25}
            color={colors.buttonPrimary}
          />
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "500",
  },
  subtitle: {
    color: colors.primary,
  },
});

export default ListItem;
