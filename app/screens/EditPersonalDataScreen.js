import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import editPersonalData from "../validators/editPersonalData.validator";
import colors from "../config/colors";
import AppText from "../components/AppText";
import { AuthContext } from "../auth/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";
import { BASE_URL } from "../api/config.api";

function EditPersonalDataScreen({ navigation }) {
  const { userAccessToken, user, isLoading, setIsLoading, logout } =
    useContext(AuthContext);
  const [editingError, setEditingError] = useState(null);

  const handleSubmit = ({ firstName, lastName, birthDate }) => {
    setEditingError(null);
    Alert.alert(
      "Voulez-vous vraiment modifier vos données personnelles ?",
      "Vous serez déconnecté si vous acceptez",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Modifier",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            axios({
              method: "put",
              url: `${BASE_URL}/update-user`,
              data: {
                id: user.id,
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase(),
                birthday: birthDate,
              },
              headers: {
                Authorization: `Bearer ${userAccessToken}`,
              },
            })
              .then((res) => {
                if (res.data.success) {
                  setIsLoading(false);
                  logout();
                }
              })
              .catch((err) => {
                setIsLoading(false);
                if (err.response === undefined) {
                  setEditingError("Impossible de communiquer avec le serveur");
                } else if (err.response.status === 404) {
                  setEditingError("Utilisateur non trouvé");
                } else {
                  setEditingError("Une erreur est survenue");
                }
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{
              firstName:
                user.firstName.slice(0, 1).toUpperCase() +
                user.firstName.slice(1),
              lastName:
                user.lastName.slice(0, 1).toUpperCase() +
                user.lastName.slice(1),
              birthDate: new Date(user.birthday).toLocaleString("fr-BE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={editPersonalData}
          >
            <AppFormField
              autoCapitalize="words"
              autoCorrect={true}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="lastName"
              placeholder="Nom"
              textContentType="none"
            />
            <AppFormField
              autoCapitalize="words"
              autoCorrect={true}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="firstName"
              placeholder="Prénom"
              textContentType="none"
            />
            <AppFormField
              birthDate
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="birthDate"
              placeholder="Date de naissance (JJ/MM/AAAA)"
              textContentType="none"
            />
            <SubmitButton title="Enregistrer" />
            <ErrorMessage
              error={editingError}
              visible={editingError != null ? true : false}
            />
          </AppForm>
          <TouchableOpacity
            onPress={() => navigation.navigate("DataUsage")}
            style={styles.dataUsageContainer}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color={colors.buttonPrimary}
            />
            <AppText style={styles.dataUsageText}>
              Comment sont utilisées mes données ?
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
    marginBottom: 100,
    width: "95%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  dataUsageContainer: {
    flexDirection: "row",
  },
  dataUsageText: {
    color: colors.buttonPrimary,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  formContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    marginTop: 10,
    width: "100%",
  },
});

export default EditPersonalDataScreen;
