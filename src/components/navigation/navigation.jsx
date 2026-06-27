import { NavLink } from "react-router-dom";
import "./navigation.css";

function Navigation({ onLogout }) {
  const username = JSON.parse(localStorage.getItem("username"));

  return (
    <>
      <div className="nav-wrapper">
        <nav className="main-nav">
          <ul>
            <li>
              {/*<NavLink
                to="/Home"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Hjem
              </NavLink>*/}
              <NavLink
                to="/Trackers"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Trackere
              </NavLink>
              <NavLink
                to="/Settings"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                ProfilIndstillinger
              </NavLink>
            </li>
          </ul>
        </nav>
        <h3>Hej, {username}!</h3>

        <button className="logout-button" onClick={onLogout}>
          Log ud
        </button>
      </div>
    </>
  );
}

export default Navigation;
