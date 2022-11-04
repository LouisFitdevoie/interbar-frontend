import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.getAllProducts = (accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/products`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.createProduct = (accessToken, name, category, description) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-product`,
    data: {
      name,
      category,
      description,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
