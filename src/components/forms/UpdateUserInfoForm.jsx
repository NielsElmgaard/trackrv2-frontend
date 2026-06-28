import "./UpdateUserInfoForm.css";
function UpdateUserInfoForm({
  handleUpdateUserInfo,
  username,
  setUsername,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  nationality,
  setNationality,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  isSubmittingProfile,
  profileError,
  profileInfo,
}) {
  return (
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
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
            disabled={isSubmittingProfile}
          />
        </div>

        <button type="submit" disabled={isSubmittingProfile}>
          {isSubmittingProfile ? "Vent venligst..." : "Opdatér bruger"}
        </button>
        {profileInfo && <div className="info-message">{profileInfo}</div>}
        {profileError && <div className="error-message">{profileError}</div>}
      </form>
    </div>
  );
}
export default UpdateUserInfoForm;
