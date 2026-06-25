import { Link } from "react-router-dom";
import Navigation from "../navigation/navigation.jsx";
import "./header.css";

function Header({ onLogout, isLoggedIn }) {
  return (
    <header className="site-header">
      <div className="logo">TrackrV2</div>
      {isLoggedIn && <Navigation onLogout={onLogout} />}
    </header>
  );
}

export default Header;
