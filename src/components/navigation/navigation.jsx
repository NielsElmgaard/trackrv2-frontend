import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navigation.css";

function Navigation({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const username = JSON.parse(localStorage.getItem("username")) || "Bruger";

  return (
    <>
      {/* Enkel hamburger-knap (Tre streger lavet i CSS) */}
      <button className={`nav-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menuen - som bare tilføjer klassen 'open' når der trykkes */}
      <div className={`nav-wrapper ${isOpen ? "open" : ""}`}>
        <h3>Hej, {username}!</h3>
        <NavLink to="/Trackers" end onClick={() => setIsOpen(false)}>Trackere</NavLink>
        <NavLink to="/Settings" end onClick={() => setIsOpen(false)}>Profilindstillinger</NavLink>
        <button className="logout-button" onClick={onLogout}>Log ud</button>
      </div>
    </>
  );
}

export default Navigation;