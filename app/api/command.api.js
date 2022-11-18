import axios from "axios";

import { BASE_URL } from "./config.api";

exports.getCommandsByEventId = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/commands-with-event-id/${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
