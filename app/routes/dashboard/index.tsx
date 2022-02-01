import { LoaderFunction, useCatch, useLoaderData } from "remix";

import groupBy from "lodash.groupby";
import sumBy from "lodash.sumby";

import Card from "~/components/Card";
import { DashboardHeader } from "~/components/dashboard";
import getGateways from "~/services/api/gateways";
import getProjects from "~/services/api/projects";
import requestReport from "~/services/api/report";

import styles from "~/styles/app.css";
import { format } from "date-fns";
import NotFound from "~/components/NotFound";
import { DISPLAY_FORMAT_DATE } from "~/constants";
import { TGateway, TPayload, TProject, TTransaction } from "~/types";
import { filterByProjectId, formatUSD } from "~/utils";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@700, 400&display=swap",
    },
  ];
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const projectId = url.searchParams.get("project");
  const gatewayId = url.searchParams.get("gateway");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let payload: TPayload = {};

  if (projectId && projectId !== "all") {
    payload.projectId = projectId;
  }

  if (gatewayId && gatewayId !== "all") {
    payload.gatewayId = gatewayId;
  }

  if (from) {
    payload.from = from;
  }

  if (to) {
    payload.to = to;
  }

  const { data: projects }: { data: TProject[] } = await getProjects();
  const { data: gateways }: { data: TGateway[] } = await getGateways();
  const { data: transactions }: { data: TTransaction[] } = await requestReport(
    payload
  );

  const generateFilters = () => {
    return {
      projects: {
        data: projects.map((project) => ({
          label: project.name,
          value: project.projectId,
        })),
        defaultValue: projectId,
      },
      gateways: {
        data: gateways.map((gateway: any) => ({
          label: gateway.name,
          value: gateway.gatewayId,
        })),
        defaultValue: gatewayId,
      },
      from,
      to,
    };
  };

  if (!transactions.length) {
    const body = JSON.stringify({ filters: generateFilters() });
    throw new Response(body, {
      headers: {
        "Content-Type": "application/json",
      },
      status: 404,
    });
  }

  const groupedGateways = groupBy(gateways, "gatewayId");

  const modifiedTransactions = transactions
    .map((transaction) => ({
      ...transaction,
      gatewayName: groupedGateways[transaction.gatewayId][0].name,
      displayDate: format(new Date(transaction.created), DISPLAY_FORMAT_DATE),
      displayAmount: formatUSD(transaction.amount),
    }))
    .sort(
      (a, b) => (new Date(a.created) as any) - (new Date(b.created) as any)
    );

  const groupedTransactions = groupBy(modifiedTransactions, "projectId");

  const transformProject = (project: { projectId: string | number }) => ({
    ...project,
    total: sumBy(groupedTransactions[project.projectId], "amount"),
    displayTotal: formatUSD(
      sumBy(groupedTransactions[project.projectId], "amount")
    ),
  });

  const modifiedProjects =
    projectId && projectId !== "all"
      ? projects.filter(filterByProjectId(projectId)).map(transformProject)
      : projects.map(transformProject);

  return {
    filters: generateFilters(),
    projects: modifiedProjects,
    gateways,
    transactions: groupedTransactions,
    totalProjectsAmount: formatUSD(sumBy(modifiedProjects, "total")) ?? 0,
  };
};

export default function Index() {
  const data = useLoaderData();

  const chart = {
    datasets: [
      {
        label: "USD",
        data: data.projects.map((project: TProject) => project.total),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <DashboardHeader filters={data?.filters} />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 2 }} className="card-stack">
          <Card>
            <div className="project-list">
              <h3 className="project-list__title">
                {data?.filters.projects.defaultValue} projects |{" "}
                {data?.filters.gateways.defaultValue} gateways
              </h3>
              {data?.projects.map((project: any) => (
                <div key={project.projectId} className="project-list__item">
                  <details>
                    <summary className="disclosure">
                      {project.name}
                      <p>TOTAL: {project.displayTotal}</p>
                    </summary>
                    <table>
                      <thead>
                        <tr className="table-header">
                          <th className="text-left">Date</th>
                          <th className="text-center">Gateway</th>
                          <th className="text-center">Transaction ID</th>
                          <th className="text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="strip">
                        {data.transactions[project.projectId].map(
                          (transaction: any, index: number) => (
                            <tr key={index}>
                              <td>{transaction.displayDate}</td>
                              <td className="text-center">
                                {transaction.gatewayName}
                              </td>
                              <td className="text-center">
                                {transaction.paymentId}
                              </td>
                              <td className="text-right">
                                {transaction.displayAmount}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </details>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h4>TOTAL: {data.totalProjectsAmount}</h4>
          </Card>
        </div>
        <div style={{ width: 400, marginLeft: 50 }}>
          <Card>
            <ul className="chart-header">
              {data?.projects.map((project: TProject, index: number) => (
                <li key={project.name}>
                  <span
                    style={{
                      backgroundColor: chart.datasets[0].backgroundColor[index],
                    }}
                  />
                  {project.name}
                </li>
              ))}
            </ul>
          </Card>
          <div style={{ marginTop: 20 }}>
            <Doughnut data={chart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <>
        <DashboardHeader filters={caught.data?.filters} />
        <NotFound />
      </>
    );
  }

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
