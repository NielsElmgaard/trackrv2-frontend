import "./ChangePasswordForm.css";
function ChangePasswordForm({
  handleUpdateUserPassword,
  password,
  setPassword,
  isSubmittingPassword,
  passwordError,
  passwordInfo
}) {
  return (
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
            disabled={isSubmittingPassword}
          />
        </div>
        <button type="submit" disabled={isSubmittingPassword}>
          {isSubmittingPassword ? "Vent venligst..." : "Opdatér adgangskode"}
        </button>
        {passwordInfo && <div className="info-message">{passwordInfo}</div>}
        {passwordError && <div className="error-message">{passwordError}</div>}
      </form>
    </div>
  );
}
export default ChangePasswordForm;
