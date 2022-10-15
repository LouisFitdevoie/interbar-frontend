import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  lastName: Yup.string()
    .required("Le nom est requis")
    .min(1, "Le nom est requis"),
  firstName: Yup.string()
    .required("Le prénom est requis")
    .min(1, "Le prénom est requis"),
  email: Yup.string()
    .required("L'adresse email est requise")
    .email("L'adresse email est invalide"),
  birthDate: Yup.string()
    .required("La date de naissance est requise")
    .length(10, "La date de naissance doit être au format JJ/MM/AAAA"),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
  passwordConfirmation: Yup.string()
    .required("La confirmation du mot de passe est requise")
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    ),
});

export default validationSchema;
