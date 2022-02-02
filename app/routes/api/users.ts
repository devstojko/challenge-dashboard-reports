import { LoaderFunction } from "remix";
import getUsers from "~/services/api/users";

export const loader: LoaderFunction = async () => {
  const response = await getUsers();
  return response;
};
