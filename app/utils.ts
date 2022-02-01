export const formatUSD = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export const filterByProjectId =
  (projectId: string) => (project: { projectId: string | null }) =>
    project.projectId === projectId;
