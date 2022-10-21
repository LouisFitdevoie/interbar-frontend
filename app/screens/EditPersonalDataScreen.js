import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import editPersonalData from "../validators/editPersonalData.validator";
import colors from "../config/colors";
import AppText from "../components/AppText";

function EditPersonalDataScreen({ navigation }) {
  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%", marginBottom: 100 }}
        behavior="padding"
      >
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{ firstName: "", lastName: "", birthDate: "" }}
            onSubmit={(values) => console.log(values)}
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
    </Screen>
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
    width: "100%",
  },
});

export default EditPersonalDataScreen;
