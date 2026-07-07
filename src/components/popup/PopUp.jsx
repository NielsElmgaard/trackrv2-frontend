function PopUp({ showPopUp, closePopUp, children }) {
  if (!showPopUp) {
    return null;
  }
  return (
    <div className="PopUp">
      <button onClick={closePopUp}></button>
      {children}
    </div>
  );
}
export default PopUp;
