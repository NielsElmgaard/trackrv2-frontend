import { useEffect, useState } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";

function Login({ setAccessToken }) {
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem("username");
    return saved ? JSON.parse(saved) : "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", JSON.stringify(username));
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Indtast venligst et gyldigt brugernavn og password");
      return;
    }

    try {
      const response = await fetch(
        "https://trackrv2-api.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            selectedRole: 1, // TODO: skal laves så den henter den aktive
          }),
        },
      );

      if (response.ok) {
        const authHeader = response.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          setAccessToken(token);
          setPassword("");
          navigate("/Home");
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "En fejl skete under login.";
        setError(errorMessage);
      }
    } catch (error) {
      setError(
        `${error.message || error} - Kunne ikke oprette forbindelse til serveren.`,
      );
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label htmlFor="username">Brugernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Indtast brugernavn"
            />
          </div>
          <div className="login-group">
            <label htmlFor="password">Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast adgangskode"
            />
          </div>
          <div className="sign-up">
            <Link to="/signup">Ny bruger</Link>
          </div>

          <button type="submit">Log ind</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
