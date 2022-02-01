import { Form } from "remix";
import Select from "../Select";

type THeaderProps = {
  filters: any;
};

export default function Header({ filters }: THeaderProps) {
  console.log("HEADER", filters);
  return (
    <div className="dashboard__header">
      <div>
        <h2>Reports</h2>
        <p>Easily generate a report of your transactions</p>
      </div>
      <div className="dashboard__header-actions">
        <Form method="get">
          <Select
            name="project"
            defaultValue={filters.projects.defaultValue}
            defaultOption={{
              label: "All projects",
              value: "all",
            }}
            options={filters.projects.data}
          />
          <Select
            name="gateway"
            defaultValue={filters.gateways.defaultValue}
            defaultOption={{
              label: "All gateways",
              value: "all",
            }}
            options={filters.gateways.data}
          />
          <input
            name="from"
            className="date-input"
            type="date"
            {...(filters?.from && { defaultValue: filters.from })}
            placeholder="From date"
          />
          <input
            name="to"
            className="date-input"
            type="date"
            {...(filters?.to && { defaultValue: filters.to })}
            placeholder="From date"
          />
          <button className="button">Generate report</button>
        </Form>
      </div>
    </div>
  );
}
