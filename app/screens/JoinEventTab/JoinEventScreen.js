import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import AppButton from "../../components/AppButton";

import AppText from "../../components/AppText";
import { AppForm, AppFormField, SubmitButton } from "../../components/forms";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import joinEventValidator from "../../validators/joinEvent.validator";

function JoinEventScreen(props) {
  const [isCameraViewVisible, setIsCameraViewVisible] = useState(false);

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{ eventCode: "" }}
        onSubmit={(values) => console.log(values)}
        validationSchema={joinEventValidator}
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance={colors.colorScheme}
          keyboardType="default"
          name="eventCode"
          placeholder="Code de l'évènement"
          textContentType="none"
        />
        {!isCameraViewVisible && (
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <AppText style={styles.separatorText}>ou</AppText>
            <View style={styles.separator} />
          </View>
        )}
        {isCameraViewVisible && (
          <View style={styles.cameraView}>
            <AppText>Camera view</AppText>
          </View>
        )}
        {!isCameraViewVisible && (
          <AppButton
            title="Scanner un QR Code"
            onPress={() => setIsCameraViewVisible(!isCameraViewVisible)}
          />
        )}
        <SubmitButton title="Suivant" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraView: {
    backgroundColor: colors.light,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    height: Math.round(Dimensions.get("window").width * 0.95),
    width: Math.round(Dimensions.get("window").width * 0.95),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  separator: {
    width: "45%",
    height: 2,
    backgroundColor: colors.primary,
  },
  separatorContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "95%",
  },
  separatorText: {
    color: colors.primary,
  },
});

export default JoinEventScreen;
