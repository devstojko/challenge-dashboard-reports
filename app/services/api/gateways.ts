import { BASE_URL } from "~/constants";

export default async function getGateways() {
  const response = await fetch(`${BASE_URL}/gateways`);

  const data = await response.json();

  return data;
}
