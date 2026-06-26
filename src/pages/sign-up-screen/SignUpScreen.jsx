import { useEffect, useState } from "react";
import "./SignUpScreen.css";
import { useNavigate, Link } from "react-router-dom";

function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber
    ) {
      setError(
        "Indtast venligst alle felter (mellemnavn og nationalitet undtaget)",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://trackrv2-api.onrender.com/api/v1/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            firstName: firstName.trim(),
            middleName: middleName.trim(),
            lastName: lastName.trim(),
            nationality: nationality.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber,
          }),
        },
      );

      if (response.ok) {
        setUsername("");
        setPassword("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setNationality("");
        setEmail("");
        setPhoneNumber("");
        navigate("/Home");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail || "En fejl skete under oprettelse af bruger.";
        setError(errorMessage);
      }
    } catch (error) {
      setError(
        `${error.message || error} - Kunne ikke oprette forbindelse til serveren.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="login-link">
          <p>Allerede bruger?</p>
          <Link to="/">
            <span>Login</span>
          </Link>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="signup-group">
            <label htmlFor="username">Brugernavn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Indtast brugernavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="password">Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast adgangskode"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="firstName">Fornavn</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Indtast fornavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="middleName">Mellemnavn</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Indtast mellemnavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="lastName">Efternavn</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Indtast efternavn"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="nationality">Nationalitet</label>
            <input
              id="nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Indtast nationalitet"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Indtast e-mail"
              disabled={isSubmitting}
            />
          </div>
          <div className="signup-group">
            <label htmlFor="phoneNumber">Telefonnummer (+45)</label>
            <input
              id="phoneNumber"
              type="number"
              value={phoneNumber}
              onChange={(e) => {
                const eightDigits = e.target.value.slice(0, 8);
                setPhoneNumber(eightDigits);
              }}
              placeholder="Indtast telefonnummer"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Vent venligst..." : "Opret bruger"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignUpScreen;
