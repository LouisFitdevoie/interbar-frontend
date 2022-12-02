import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  lastName: Yup.string()
    .required("Le nom est requis")
    .min(1, "Le nom est requis"),
  firstName: Yup.string()
    .required("Le prénom est requis")
    .min(1, "Le prénom est requis"),
  birthDate: Yup.string()
    .required("La date de naissance est requise")
    .length(10, "La date de naissance doit être au format JJ/MM/AAAA"),
});

export default validationSchema;
