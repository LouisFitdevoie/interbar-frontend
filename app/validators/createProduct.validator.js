import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Le nom de l'événement est requis"),
  category: Yup.string()
    .required("La catégorie est requise")
    .oneOf(["food", "alcohol", "soft"], "La catégorie est invalide"),
  description: Yup.string().notRequired("La description n'est obligatoire"),
});

export default validationSchema;
