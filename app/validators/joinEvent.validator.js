import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  eventCode: Yup.string()
    .required("Le code d'évènement est obligatoire")
    .min(36, "Le code d'évènement doit faire 36 caractères")
    .max(36, "Le code d'évènement doit faire 36 caractères"),
});

export default validationSchema;
