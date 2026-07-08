import useGoBack from "../../hooks/useGoBack";
import { RiArrowGoBackFill } from "react-icons/ri";
import "./BackButton.css"

function BackButton({ fallback = "/" }) {
  const goBack = useGoBack();
  return (
    <button onClick={goBack} className="back-button" aria-label="Gå tilbage">
      <RiArrowGoBackFill />
    </button>
  );
}
export default BackButton;
