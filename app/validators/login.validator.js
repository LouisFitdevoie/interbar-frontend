import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("L'adresse email est requise")
    .email("L'adresse email est invalide"),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
});

export default validationSchema;
