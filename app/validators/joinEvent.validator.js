import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  eventCode: Yup.string()
    .required("Le code d'évènement est obligatoire")
    .length(36, "Le code d'évènement doit contenir 36 caractères"),
});

export default validationSchema;
