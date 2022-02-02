import { LoaderFunction } from "remix";
import getGateways from "~/services/api/gateways";

export const loader: LoaderFunction = async () => {
  const response = await getGateways();
  return response;
};
