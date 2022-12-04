import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Le nom de l'événement est requis"),
  startDate: Yup.date().required("La date de début est requise"),
  endDate: Yup.date()
    .required("La date de fin est requise")
    .test(
      "same-or-after",
      "La date de fin doit être après la date de début",
      function (endDate) {
        return this.parent.startDate.getTime() < endDate.getTime();
      }
    ),
  location: Yup.string().required("La localisation est requise"),
  description: Yup.string()
    .notRequired("La description n'est obligatoire")
    .nullable(),
});

export default validationSchema;
