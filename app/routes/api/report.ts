import { ActionFunction } from "remix";
import requestReport from "~/services/api/report";

export const loader: ActionFunction = async ({ request }) => {
  const body = await request.json();
  const response = await requestReport(body);
  return response;
};
