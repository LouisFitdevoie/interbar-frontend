import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  sellerPassword: Yup.string()
    .required("Le mot de passe vendeur est requis")
    .min(8, "Le mot de passe doit être de 8 caractères minimum"),
});

export default validationSchema;
