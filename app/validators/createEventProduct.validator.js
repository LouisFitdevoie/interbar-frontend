import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  eventId: Yup.string().required("L'identifiant de l'événement est requis"),
  productId: Yup.string().required("L'identifiant du produit est requis"),
  buyingPrice: Yup.number("Le prix d'achat doit être un nombre")
    .required("Le prix d'achat est requis")
    .min(0, "Le prix d'achat doit être supérieur ou égal à 0"),
  sellingPrice: Yup.number("Le prix de vente doit être un nombre")
    .required("Le prix de vente est requis")
    .min(0, "Le prix de vente doit être supérieur ou égal à 0"),
  stock: Yup.number("Le stock doit être un nombre")
    .required("Le stock est requis")
    .min(0, "Le stock doit être supérieur ou égal à 0"),
});

export default validationSchema;
