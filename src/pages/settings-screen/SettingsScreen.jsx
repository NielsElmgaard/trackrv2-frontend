import { useEffect, useState } from "react";
import "./SettingsScreen.css";
import { useNavigate, Link } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser.js";

function SettingsScreen() {
  const { isPending, data: userDetails, fetchError } = useFetchUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileInfo, setProfileInfo] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordInfo, setPasswordInfo] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "");
      setFirstName(userDetails.firstName || "fejl");
      setMiddleName(userDetails.middleName || "");
      setLastName(userDetails.lastName || "");
      setNationality(userDetails.nationality || "");
      setEmail(userDetails.email || "");
      setPhoneNumber(userDetails.phoneNumber || "");
    }
  }, [userDetails]);

  async function handleUpdateUserInfo(e) {
    e.preventDefault();
    setProfileError("");
    setProfileInfo("");
    if (!username || !firstName || !lastName || !email || !phoneNumber) {
      setProfileError(
        "Indtast venligst alle felter (mellemnavn og nationalitet undtaget)",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://trackrv2-api.onrender.com/api/v1/users",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
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
        setProfileInfo("Profil opdateret succesfuldt!");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          "En fejl skete under opdatering af brugeroplysninger.";
        setProfileError(errorMessage);
        setProfileInfo("");
      }
    } catch (error) {
      setProfileError(
        `${error.message || error} - Kunne ikke oprette forbindelse til serveren.`,
      );
      setProfileInfo("");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateUserPassword(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordInfo("");
    if (!password) {
      setPasswordError("Indtast venligst adgangskode");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://trackrv2-api.onrender.com/api/v1/users/password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: password.trim(),
          }),
        },
      );

      if (response.ok) {
        setPasswordInfo("Adgangskode opdateret succesfuldt!");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          "En fejl skete under opdatering af brugers adgangskode.";
        setPasswordError(errorMessage);
        setPasswordInfo("");
      }
    } catch (error) {
      setPasswordError(
        `${error.message || error} - Kunne ikke oprette forbindelse til serveren.`,
      );
      setPasswordInfo("");
    } finally {
      setIsSubmitting(false);
    }
  }
  if (isPending)
    return <div className="loading">Henter dine profiloplysninger...</div>;
  if (fetchError)
    return (
      <div className="error-message">Kunne ikke hente profiloplysninger.</div>
    );
  return (
    <div className="update-userinfo-container">
      <div className="update-userinfo-form">
        <form onSubmit={handleUpdateUserInfo}>
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
          <div className="update-userinfo-group">
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
            {isSubmitting ? "Vent venligst..." : "Opdatér bruger"}
          </button>
          {profileInfo && <div className="info-message">{profileInfo}</div>}
          {profileError && <div className="error-message">{profileError}</div>}
        </form>
      </div>
      <div className="change-password-form">
        <form onSubmit={handleUpdateUserPassword}>
          <div className="change-password-group">
            <label htmlFor="password">Ret Adgangskode </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Indtast ny adgangskode"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Vent venligst..." : "Opdatér adgangskode"}
          </button>
          {passwordInfo && <div className="info-message">{passwordInfo}</div>}
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SettingsScreen;
