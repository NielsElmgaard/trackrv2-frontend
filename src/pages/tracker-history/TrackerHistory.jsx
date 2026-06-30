import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetchTrackerEntries from "../../hooks/useFetchTrackerEntries.js";

function TrackerHistory() {
  const location = useLocation();
  const currentTracker = location.state?.currentTracker || null;
  const trackerId = currentTracker?.id;
  const { data: entries = [], isPending } = useFetchTrackerEntries(trackerId);

  if (!currentTracker) {
    return <div>Ingen tracker valgt. Gå tilbage og vælg en tracker.</div>;
  }

  if (isPending) return <div>Henter historik...</div>;

  if (entries.length === 0) {
    return (
      <div className="tracker-history-section">
        <h1>{currentTracker.name}</h1>
        <p>Ingen målinger registreret endnu.</p>
      </div>
    );
  }

  return (
    <div className="tracker-history-section">
      <h2>Historik ({entries.length})</h2>
      <div className="entries-list">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card">
            <small>{new Date(entry.createdAt).toLocaleString("da-DK")}</small>

            <ul>
              {entry.values.map((v) => (
                <li key={v.id}>
                  <strong>{v.fieldLabel}:</strong>
                  {v.value === "true"
                    ? "Ja"
                    : v.value === "false"
                      ? "Nej"
                      : v.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackerHistory;
