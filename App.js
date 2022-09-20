import { ImageBackground, StyleSheet, View } from "react-native";
import AppButton from "./app/components/AppButton";
import * as Yup from "yup";

import SubmitButton from "./app/components/forms/SubmitButton";
import AppText from "./app/components/AppText";
import AppForm from "./app/components/forms/AppForm";
import AppFormField from "./app/components/forms/AppFormField";
import Screen from "./app/components/Screen";

const validationSchema = Yup.object().shape({
  test: Yup.string().required().min(1).label("Test"),
});

export default function App() {
  return (
    <ImageBackground
      source={require("./app/assets/splashscreen/splashscreen-light.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Screen style={styles.container}>
        <AppText>Open up App.js to start working on your app!</AppText>
        <AppButton
          title="Rejoindre l'évènement"
          onPress={() => console.log("Tapped")}
        />
        <AppForm
          initialValues={{ test: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
          <AppFormField name="Test" placeholder="Test" registration />
          <SubmitButton title="Rejoindre l'évènement" />
        </AppForm>
      </Screen>
    </ImageBackground>
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
});
