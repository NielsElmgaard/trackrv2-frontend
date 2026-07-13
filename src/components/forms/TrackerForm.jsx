import { useState } from "react";
import { axiosInstance } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import useNavigate from "../navigation/useNavigate.jsx";
import "./TrackerForm.css";

function TrackerForm() {
  const [trackerName, setTrackerName] = useState("");
  const [trackerDescription, setTrackerDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleTracker(e) {
    e.preventDefault();
    if (!trackerName.trim()) {
      setError("Trackeren skal have et navn");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axiosInstance.post("/v1/trackers", {
        name: trackerName.trim(),
        description: trackerDescription.trim(),
        isPublic: isPublic,
        fields: [],
      });

      queryClient.invalidateQueries({ queryKey: ["trackers"] });

      navigate("/Trackers");
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke oprette tracker.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="custom-form">
      <form onSubmit={handleTracker}>
        <div className="custom-form-group">
          <label htmlFor="trackerName">Navn på tracker</label>
          <input
            id="trackerName"
            type="text"
            value={trackerName}
            onChange={(e) => setTrackerName(e.target.value)}
            placeholder="F.eks. Push ups, Vægt, Løb"
            disabled={isSubmitting}
          />
        </div>
        <div className="custom-form-group">
          <label htmlFor="trackerDescription">Beskrivelse af tracker</label>
          <textarea
            id="trackerDescription"
            value={trackerDescription ?? null}
            onChange={(e) => setTrackerDescription(e.target.value)}
            placeholder="Indtast beskrivelse"
            disabled={isSubmitting}
          />
        </div>
        <div className="custom-form-group" style={{ alignItems: "center" }}>
          <label htmlFor="isPublic">Offentlig?</label>
          <input
            id="isPublic"
            type="checkbox"
            checked={!!isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Opretter..." : "Gem tracker"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default TrackerForm;
