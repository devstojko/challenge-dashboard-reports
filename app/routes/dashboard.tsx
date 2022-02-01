import {
  json,
  LoaderFunction,
  Outlet,
  useLoaderData,
  useTransition,
} from "remix";
import AppHeader from "~/components/AppHeader";
import DashboardNav from "~/components/DashboardNav";
import getUsers from "~/services/api/users";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUsers();

  return json(user.data[0]);
};

export default function Dashboard() {
  const data = useLoaderData();
  const transition = useTransition();
  return (
    <div className="app">
      <AppHeader user={data} />
      <div className="app__container">
        <DashboardNav />
        <div className="app__content">
          <Outlet />
          <footer className="app__footer">
            Terms&Conditions | Privacy policy
          </footer>
        </div>
      </div>
      {(transition.state === "loading" ||
        transition.state === "submitting") && <div className="spinner" />}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: any }) {
  return (
    <div>
      <h1>Ups something went wrong.</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
