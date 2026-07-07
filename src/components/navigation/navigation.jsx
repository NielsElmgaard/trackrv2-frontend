import { useState } from "react";
import NavLink from "../navigation/NavLink.jsx";
import "./navigation.css";

function Navigation({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const username = JSON.parse(localStorage.getItem("username")) || "Bruger";

  return (
    <>
      <button className={`nav-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-wrapper ${isOpen ? "open" : ""}`}>
        <h3>Hej, {username}!</h3>
        <NavLink to="/Trackers" end onClick={() => setIsOpen(false)}>Trackere</NavLink>
        <NavLink to="/Profile" end onClick={() => setIsOpen(false)}>Profil</NavLink>
        <button className="logout-button" onClick={onLogout}>Log ud</button>
      </div>
    </>
  );
}

export default Navigation;