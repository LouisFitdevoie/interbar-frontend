import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Le nom de l'événement est requis"),
  startDate: Yup.string().required("La date de début est requise"),
  endDate: Yup.string().required("La date de fin est requise"),
  location: Yup.string().required("La localisation est requise"),
  description: Yup.string().notRequired("La description n'est obligatoire"),
  sellerPassword: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  sellerPasswordConfirmation: Yup.string()
    .required("La confirmation du mot de passe est requise")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .oneOf(
      [Yup.ref("sellerPassword"), null],
      "Les mots de passe ne correspondent pas"
    ),
});

export default validationSchema;
