import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Le mot de passe actuel est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  newPassword: Yup.string()
    .required("Le nouveau mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  newPasswordConfirmation: Yup.string()
    .required("La confirmation du nouveau mot de passe est requise")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .oneOf(
      [Yup.ref("newPassword"), null],
      "Les mots de passe ne correspondent pas"
    ),
});

export default validationSchema;
