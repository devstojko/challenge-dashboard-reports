import notFoundImage from "~/images/404.svg";

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>No reports</h2>
      <p>
        Currently you have no data for the reports to be generated. Once you
        start generating traffic through the Balance application the reports
        will be shown.
      </p>
      <img src={notFoundImage} alt="Not Found" />
    </div>
  );
}
