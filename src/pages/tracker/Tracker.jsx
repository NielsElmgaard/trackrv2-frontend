import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetchTracker from "../../hooks/useFetchTracker.js";
import useUpdateTracker from "../../hooks/useUpdateTracker.js";

import TrackerEntryForm from "../../components/forms/TrackerEntryForm";
import TrackerForm from "../../components/forms/TrackerForm";
function Tracker() {
  const location = useLocation();
  const currentTracker = location.state?.currentTracker || null;
  const {
    isPending,
    data: trackerDetails,
    error,
  } = useFetchTracker({ trackerId: currentTracker?.id });

  const updateTrackerMutation = useUpdateTracker();

  const [numberOfEntries, setNumberOfEntries] = useState(0);

  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState(1);
  const [showFieldForm, setShowFieldForm] = useState(false);

  useEffect(() => {
    if (trackerDetails && trackerDetails.entries) {
      setNumberOfEntries(trackerDetails.entries.length);
    } else if (currentTracker && currentTracker.entries) {
      setNumberOfEntries(currentTracker.entries.length);
    }
  }, [trackerDetails, currentTracker]);
  if (!currentTracker)
    return (
      <div className="tracker-container">
        <h1>Opret ny tracker</h1>
        <TrackerForm />
      </div>
    );
  if (isPending) return <div>Henter detaljer...</div>;

  const activeTracker = trackerDetails || currentTracker;
  const hasFields = activeTracker.fields && activeTracker.fields.length > 0;

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    // Add the new fields to the existing list
    const updatedFields = [
      ...(activeTracker.fields || []).map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        entryValues: f.entryValues || [],
      })),
      {
        label: newFieldLabel,
        type: newFieldType,
        entryValues: [],
      },
    ];

    try {
      await updateTrackerMutation.mutateAsync({
        trackerId: activeTracker.id,
        name: activeTracker.name,
        fields: updatedFields,
      });

      setNewFieldLabel("");
      setShowFieldForm(false);
    } catch (err) {
      console.error("Kunne ikke opdatere tracker:", err);
    }
  };

  return (
    <>
      <div className="tracker-container">
        <h1>{activeTracker.name}</h1>
        {hasFields ? (
          <TrackerEntryForm
            numberOfEntries={numberOfEntries}
            currentTracker={activeTracker}
          />
        ) : (
          <p>
            Denne tracker har ingen felter endnu. Tilføj et felt nedenfor for at
            komme i gang!
          </p>
        )}

        <hr style={{ margin: "2rem 0", borderColor: "#333" }} />

        <div className="manage-fields-section">
          {!showFieldForm ? (
            <button onClick={() => setShowFieldForm(true)}>
              + Tilføj nyt konfigurationsfelt (f.eks. Antal, Vægt)
            </button>
          ) : (
            <form onSubmit={handleAddField} className="add-field-inline-form">
              <h3>Tilføj nyt felt til {activeTracker.name}</h3>
              <div>
                <label>Navn på felt (f.eks. 'Reps' eller 'Kg'):</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="f.eks. Antal gentagelser"
                />
              </div>
              <div>
                <label>Type:</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(Number(e.target.value))}
                >
                  <option value={1}>Tal (Number)</option>
                  <option value={0}>Tekst (Text)</option>
                  <option value={2}>Dato (Date)</option>
                  <option value={3}>Ja/Nej (Boolean)</option>
                </select>
              </div>
              <button type="submit" disabled={updateTrackerMutation.isPending}>
                {updateTrackerMutation.isPending
                  ? "Gemmer felt..."
                  : "Gem felt"}
              </button>
              <button type="button" onClick={() => setShowFieldForm(false)}>
                Annuller
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Tracker;
