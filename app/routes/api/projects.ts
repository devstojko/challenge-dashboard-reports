import { LoaderFunction } from "remix";
import getProjects from "~/services/api/projects";

export const loader: LoaderFunction = async () => {
  const response = await getProjects();
  return response;
};
