import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.createEventProduct = (
  eventId,
  productId,
  stock,
  buyingPrice,
  sellingPrice,
  accessToken
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-event-product`,
    data: {
      event_id: eventId,
      product_id: productId,
      stock,
      buyingPrice,
      sellingPrice,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
