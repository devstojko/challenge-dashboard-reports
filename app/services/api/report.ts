import { BASE_URL } from "~/constants";
import { TPayload } from "~/types";

export default async function requestReport(payload: TPayload) {
  const response = await fetch(`${BASE_URL}/report`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
}
