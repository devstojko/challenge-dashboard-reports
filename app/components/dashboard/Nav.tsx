import { Link } from "remix";

import logo1 from "~/images/icon-1.svg";
import logo2 from "~/images/icon-2.svg";
import logo3 from "~/images/icon-3.svg";
import logo4 from "~/images/icon-4.svg";

export default function DashboardNav() {
  return (
    <nav className="nav">
      <div className="nav__item">
        <Link to="/">
          <img src={logo1} />
        </Link>
      </div>
      <div className="nav__item">
        <Link to="/">
          <img src={logo2} />
        </Link>
      </div>
      <div className="nav__item">
        <Link to="/">
          <img src={logo3} />
        </Link>
      </div>
      <div className="nav__item">
        <Link to="/">
          <img src={logo4} />
        </Link>
      </div>
    </nav>
  );
}
