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

exports.getAllProductsAtEvent = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/event-products-by-event-id?id=${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.editEventProduct = (
  eventProductId,
  stock,
  buyingPrice,
  sellingPrice,
  accessToken
) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/update-event-product/${eventProductId}`,
    data: {
      buyingPrice,
      sellingPrice,
      stock,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
