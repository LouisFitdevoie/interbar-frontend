import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../../components/Screen";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  ErrorMessage,
} from "../../components/forms";
import editPersonalDataValidator from "../../validators/editPersonalData.validator";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import userAPI from "../../api/user.api";

function EditPersonalDataScreen({ navigation }) {
  const {
    userAccessToken,
    user,
    isLoading,
    setIsLoading,
    logout,
    updateAccessToken,
  } = useContext(AuthContext);
  const [editingError, setEditingError] = useState(null);
  const [birthday, setBirthday] = useState(
    new Date(user.birthday.split(" ")[0]).toLocaleDateString("fr-BE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );

  useEffect(() => {
    setBirthday(user.birthday.split(" ")[0].split("-").reverse().join("/"));
  }, [birthday]);

  const editPersonalData = (firstName, lastName, birthDate) => {
    setIsLoading(true);
    userAPI
      .editPersonalData(
        user.id,
        firstName,
        lastName,
        birthDate,
        userAccessToken
      )
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
        } else if (err.response.status === 403) {
          updateAccessToken();
          setEditingError(
            "Erreur lors de la modification de vos données personnelles, veuillez réessayer"
          );
        } else {
          setEditingError("Une erreur est survenue");
        }
      });
  };

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
            editPersonalData(firstName, lastName, birthDate);
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
              birthDate:
                Platform.OS === "ios"
                  ? new Date(user.birthday).toLocaleDateString("fr-BE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : birthday,
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={editPersonalDataValidator}
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
