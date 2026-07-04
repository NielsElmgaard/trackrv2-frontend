import Link from "../navigation/Link.jsx";
import Navigation from "../navigation/navigation.jsx";
import "./Header.css";

function Header({ onLogout, isLoggedIn }) {
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        TrackrV2
      </Link>
      {isLoggedIn && <Navigation onLogout={onLogout} />}
    </header>
  );
}

export default Header;
