import { useState } from "react";
import { axiosInstance } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function TrackerForm() {
  const [trackerName, setTrackerName] = useState("");
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
    <form onSubmit={handleTracker} className="new-tracker-form">
      <div className="form-group">
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

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Opretter..." : "Gem tracker"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
}

export default TrackerForm;
