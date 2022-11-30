import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import colors from "../../config/colors";
import SortMenu from "../../components/SortMenu";
import { AuthContext } from "../../auth/AuthContext";
import AppButton from "../../components/AppButton";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ErrorMessage } from "../../components/forms";
import eventAPI from "../../api/event.api";

function AfterEventScreen({
  navigation,
  organizer,
  startDate,
  endDate,
  location,
  description,
  role,
  eventId,
}) {
  //TODO
  // - ORGANIZER
  //TODO --- Display a button to redirect to the statistics screen
  // DONE --- Display a button to delete the event -> Alert to confirm and say that data won't be accessible for the user anymore

  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);

  const [sortOptionSelected, setSortOptionSelected] = useState("newest");
  const [paidOptionSelected, setPaidOptionSelected] = useState("all");
  const [error, setError] = useState(null);

  const [commandItems, setCommandItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(commandItems);

  const sortOptions = [
    { name: "La plus récente d'abord", value: "newest" },
    { name: "La plus ancienne d'abord", value: "oldest" },
    { name: "La plus chère d'abord", value: "highest" },
    { name: "La moins chère d'abord", value: "lowest" },
  ];

  const paidOptions = [
    { name: "Toutes", value: "all" },
    { name: "Payées", value: "paid" },
    { name: "Non payées", value: "unpaid" },
  ];

  const handleSort = () => {
    setIsLoading(true);
    setDisplayedItems(
      commandItems
        .sort((a, b) => {
          if (sortOptionSelected === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
          } else if (sortOptionSelected === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
          } else if (sortOptionSelected === "highest") {
            return parseFloat(b.totalPrice) - parseFloat(a.totalPrice);
          } else if (sortOptionSelected === "lowest") {
            return parseFloat(a.totalPrice) - parseFloat(b.totalPrice);
          }
        })
        .filter((command) => {
          if (paidOptionSelected === "paid") {
            return command.isPaid;
          } else if (paidOptionSelected === "unpaid") {
            return !command.isPaid;
          } else {
            return true;
          }
        })
        .filter((command) => {
          if (role === 0) {
            return command.client_id === user.id;
          } else if (role === 1) {
            return command.servedBy_id === user.id;
          } else {
            return true;
          }
        })
    );
    setIsLoading(false);
  };

  const handleDeleteEvent = () => {
    Alert.alert(
      "Supprimer l'évènement",
      "Êtes-vous sûr de vouloir supprimer l'évènement ?\n Vous n'aurez plus accès aux données de l'évènement après sa suppression",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: () => {
            setError(null);
            setIsLoading(true);
            eventAPI
              .deleteEvent(eventId, userAccessToken)
              .then((res) => {
                setIsLoading(false);
                if (res.data.success != null) {
                  Alert.alert("Succés", "L'événement a été supprimé");
                  navigation.navigate("Home");
                } else {
                  setError(res.data.error);
                }
              })
              .catch((err) => {
                setIsLoading(false);
                if (err.response.status === 403) {
                  updateAccessToken();
                  setError("Une erreur est survenue, veuillez réessayer");
                } else {
                  setError("Une erreur est survenue");
                }
              });
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.detailContainer}>
        {role != 2 && (
          <View style={styles.detailView}>
            <AppText style={styles.detailTitle}>Organisé par :</AppText>
            <AppText>{organizer}</AppText>
          </View>
        )}
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Date de début :</AppText>
          <AppText>
            {startDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Date de fin :</AppText>
          <AppText>
            {endDate.toLocaleDateString("fr-BE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Lieu :</AppText>
          <AppText>{location}</AppText>
        </View>
        {description != null && (
          <View style={styles.detailView}>
            <AppText style={styles.detailTitle}>Description :</AppText>
            <AppText>{description}</AppText>
          </View>
        )}
        <View style={styles.detailView}>
          <AppText style={styles.detailTitle}>Rôle :</AppText>
          <AppText>
            {role === 0 ? "Client" : role === 1 ? "Vendeur" : "Organisateur"}
          </AppText>
        </View>
      </View>
      <View style={styles.commandsContainer}>
        <AppText style={styles.commandsTitle}>
          {role === 0
            ? "Mes commandes"
            : role === 1
            ? "Commandes traitées"
            : "Toutes les commandes"}
        </AppText>
        <SortMenu
          sortOptionSelected={sortOptionSelected}
          setSortOptionSelected={setSortOptionSelected}
          scrollOptionSelected={paidOptionSelected}
          setScrollOptionSelected={setPaidOptionSelected}
          sortOptions={sortOptions}
          scrollOptions={paidOptions}
          displayedItems={displayedItems}
          handleSort={() => handleSort()}
        />
      </View>
      {role === 2 && (
        <View
          style={{
            width: "100%",
          }}
        >
          <AppButton
            title="Supprimer l'évènement"
            onPress={() => handleDeleteEvent()}
          />
          <ErrorMessage error={error} visible={error != null} />
        </View>
      )}
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  commandsContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  commandsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: colors.primary,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    width: "100%",
    backgroundColor: colors.white,
  },
  detailContainer: {
    marginTop: 5,
    width: "100%",
  },
  detailView: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailTitle: {
    fontWeight: "bold",
    color: colors.buttonPrimary,
    paddingRight: 5,
    paddingVertical: 5,
  },
});

export default AfterEventScreen;
