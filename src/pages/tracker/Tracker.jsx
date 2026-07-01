import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetchTracker from "../../hooks/useFetchTracker.js";
import useUpdateTracker from "../../hooks/useUpdateTracker.js";
import TrackerEntryForm from "../../components/forms/TrackerEntryForm";
import TrackerForm from "../../components/forms/TrackerForm";
import "./Tracker.css";

function Tracker() {
  const location = useLocation();
  const currentTracker = location.state?.currentTracker || null;
  
  const { isPending, data: trackerDetails } = useFetchTracker({ 
    trackerId: currentTracker?.id 
  });
  const updateTrackerMutation = useUpdateTracker();

  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState(1);
  const [showFieldForm, setShowFieldForm] = useState(false);

  useEffect(() => {
    if (trackerDetails?.entries) {
      setNumberOfEntries(trackerDetails.entries.length);
    } else if (currentTracker?.entries) {
      setNumberOfEntries(currentTracker.entries.length);
    }
  }, [trackerDetails, currentTracker]);

  if (!currentTracker) {
    return (
      <div className="tracker-create-container">
        <h1>Opret ny tracker</h1>
        <TrackerForm />
      </div>
    );
  }

  if (isPending) return <div className="tracker-loading">Henter detaljer...</div>;

  const activeTracker = trackerDetails || currentTracker;
  const hasFields = activeTracker.fields && activeTracker.fields.length > 0;

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const updatedFields = [
      ...(activeTracker.fields || []).map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        entryValues: f.entryValues || [],
      })),
      { label: newFieldLabel, type: newFieldType, entryValues: [] },
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

  const renderMainContent = () => {
    if (hasFields) {
      return (
        <TrackerEntryForm
          numberOfEntries={numberOfEntries}
          currentTracker={activeTracker}
        />
      );
    }
    return (
      <p className="empty-fields-msg">
        Denne tracker har ingen felter endnu. Tilføj et felt nedenfor for at komme i gang!
      </p>
    );
  };

  const renderFieldManagement = () => {
    if (!showFieldForm) {
      return (
        <button className="btn-toggle-form" onClick={() => setShowFieldForm(true)}>
          Tilføj nyt felt (f.eks. Antal, Vægt)
        </button>
      );
    }

    return (
      <form onSubmit={handleAddField} className="add-field-form">
        <h3>
          Tilføj nyt felt til <span>{activeTracker.name}</span>
        </h3>
        
        <div className="form-group">
          <label htmlFor="field-label">Navn på felt:</label>
          <input
            id="field-label"
            type="text"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            placeholder="f.eks. Antal gentagelser"
          />
        </div>

        <div className="form-group">
          <label htmlFor="field-type">Type:</label>
          <select
            id="field-type"
            value={newFieldType}
            onChange={(e) => setNewFieldType(Number(e.target.value))}
          >
            <option value={1}>Tal (Number)</option>
            <option value={0}>Tekst (Text)</option>
            <option value={2}>Dato (Date)</option>
            <option value={3}>Ja/Nej (Boolean)</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={updateTrackerMutation.isPending}>
            {updateTrackerMutation.isPending ? "Gemmer felt..." : "Gem felt"}
          </button>
          <button type="button" className="btn-cancel" onClick={() => setShowFieldForm(false)}>
            Annuller
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="tracker-container">
      <header className="tracker-header">
        <h1>{activeTracker.name}</h1>
      </header>

      <section className="tracker-content-section">
        {renderMainContent()}
      </section>

      <hr className="tracker-divider" />

      <section className="manage-fields-section">
        {renderFieldManagement()}
      </section>
    </main>
  );
}

export default Tracker;