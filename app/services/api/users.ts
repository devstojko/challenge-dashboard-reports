import { BASE_URL } from "~/constants";

export default async function getUsers() {
  const response = await fetch(`${BASE_URL}/users`);

  const data = await response.json();

  return data;
}
