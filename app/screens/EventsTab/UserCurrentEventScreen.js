import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Screen from "../../components/Screen";

function UserCurrentEventScreen({
  navigation,
  organizer,
  startDate,
  endDate,
  location,
  description,
  role,
  eventId,
}) {
  const [sortOptionSelected, setSortOptionSelected] = useState("newest");
  const [paidOptionSelected, setPaidOptionSelected] = useState("all");

  const sortOptions = [
    { name: "Du plus récent au plus ancien", value: "newest" },
    { name: "Du plus ancien au plus récent", value: "oldest" },
    { name: "Du plus cher au moins cher", value: "highest" },
    { name: "Du moins cher au plus cher", value: "lowest" },
  ];

  const paidOptions = [
    { name: "Toutes", value: "all" },
    { name: "Payées", value: "paid" },
    { name: "Non payées", value: "unpaid" },
  ];

  return <Screen style={styles.container}></Screen>;
}

const styles = StyleSheet.create({
  container: {},
});

export default UserCurrentEventScreen;
