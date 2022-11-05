import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  newBuyingPrice: Yup.number("Le prix d'achat doit être un nombre")
    .required("Le prix d'achat est requis")
    .min(0, "Le prix d'achat doit être supérieur ou égal à 0"),
  newSellingPrice: Yup.number("Le prix de vente doit être un nombre")
    .required("Le prix de vente est requis")
    .min(0, "Le prix de vente doit être supérieur ou égal à 0"),
  newStock: Yup.number("Le stock doit être un nombre")
    .required("Le stock est requis")
    .min(0, "Le stock doit être supérieur ou égal à 0"),
});

export default validationSchema;
