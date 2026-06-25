import { NavLink } from "react-router-dom";
import "./navigation.css";

function Navigation({ onLogout }) {
  const username = JSON.parse(localStorage.getItem("username"));

  return (
    <>
      <h3>Hello, {username}!</h3>
      <div className="logout-button">
        <button onClick={onLogout}>Log ud</button>
      </div>
      <nav className="main-nav">
        <ul>
          <li>
            <NavLink
              to="/Home"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/Trackers"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Trackers
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navigation;
