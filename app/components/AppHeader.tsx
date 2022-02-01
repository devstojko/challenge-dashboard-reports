import { Link } from "remix";
import logo from "~/images/logo.svg";
import MenuBurger from "./MenuBurger";

type TAppHeaderProps = {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function AppHeader({ user }: TAppHeaderProps) {
  return (
    <div className="app__header">
      <div className="app__header-left">
        <Link to="/dashboard">
          <img alt="Logo" src={logo} />
        </Link>
        <MenuBurger />
      </div>
      <div className="app__header-right">
        <div className="avatar">
          {user?.firstName.substring(0, 1)}
          {user?.lastName.substring(0, 1)}
        </div>
        <p className="username">
          {user.firstName} {user.lastName}
        </p>
      </div>
    </div>
  );
}
