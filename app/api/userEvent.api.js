import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.userCreateEvent = (eventId, userId, userAccessToken) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/user-join-event`,
    data: {
      eventId,
      userId,
      role: 2,
    },
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  });
};
