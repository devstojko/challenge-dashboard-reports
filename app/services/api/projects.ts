import { BASE_URL } from "~/constants";

export default async function getProjects() {
  const response = await fetch(`${BASE_URL}/projects`);

  const data  = await response.json()

  return data;
}
