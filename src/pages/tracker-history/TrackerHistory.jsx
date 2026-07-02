import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFetchTrackerEntries from "../../hooks/useFetchTrackerEntries.js";
import useUpdateTrackerEntry from "../../hooks/useUpdateTrackerEntry.js";
import { BsFillTrash3Fill } from "react-icons/bs";
import "./TrackerHistory.css";
import useDeleteTrackerEntry from "../../hooks/useDeleteTrackerEntry.js";

function TrackerHistory() {
  const location = useLocation();
  const currentTracker = location.state?.currentTracker || null;
  const trackerId = currentTracker?.id;
  const { data: entries = [], isPending } = useFetchTrackerEntries(trackerId);
  const deleteTrackerEntry = useDeleteTrackerEntry(trackerId);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isDeletingTrackerEntry, setIsDeletingTrackerEntry] = useState(false);

  const updateEntry = useUpdateTrackerEntry(trackerId);

  const [localValues, setLocalValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  async function handleDeleteTrackerEntry(trackerEntryId) {
    setError("");
    setInfo("");
    setIsDeletingTrackerEntry(true);

    try {
      await deleteTrackerEntry.mutateAsync(trackerEntryId);
      setInfo("Tracker slettet");
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke slette trackeren.");
    } finally {
      setIsDeletingTrackerEntry(false);
    }
  }

  function mapFieldType(type) {
    switch (type) {
      case 1:
      case "Number":
        return "number";
      case 2:
      case "Date":
        return "date";
      case 3:
      case "Boolean":
        return "checkbox";
      case 0:
      default:
        return "text";
    }
  }

  // Sync data to local state
  useEffect(() => {
    if (entries.length > 0) {
      const stateMap = {};
      entries.forEach((entry) => {
        entry.values.forEach((v) => {
          stateMap[`${entry.id}-${v.id}`] = v.value;
        });
      });
      setLocalValues(stateMap);
    }
  }, [entries]);

  if (!currentTracker) {
    return (
      <div className="history-error">
        Ingen tracker valgt. Gå tilbage og vælg en tracker.
      </div>
    );
  }

  if (isPending)
    return (
      <div className="loading-screen-container">
        <div className="loading"></div>
      </div>
    );

  if (entries.length === 0) {
    return (
      <div className="tracker-history-section">
        <h1>{currentTracker.name}</h1>
        <p>Ingen målinger registreret endnu.</p>
      </div>
    );
  }

  const handleLocalChange = (entryId, valueId, val) => {
    setLocalValues((prev) => ({
      ...prev,
      [`${entryId}-${valueId}`]: val,
    }));
  };

  const handleAutoSave = async (entry, valueId, updatedValue) => {
    const key = `${entry.id}-${valueId}`;

    const originalValue = entry.values.find((v) => v.id === valueId)?.value;
    if (originalValue === updatedValue) return; // Ingen ændringer -> stop kald

    setSavingId(key);

    const updatedFieldValues = entry.values.map((v) => {
      const isTarget = v.id === valueId;
      const rawValue = isTarget
        ? updatedValue
        : (localValues[`${entry.id}-${v.id}`] ?? v.value);

      return {
        id: v.id,
        fieldDefinitionId: v.fieldDefinitionId,
        value:
          rawValue !== undefined && rawValue !== null
            ? rawValue.toString()
            : "",
      };
    });

    try {
      await updateEntry.mutateAsync({
        entryId: entry.id,
        fieldValues: updatedFieldValues,
      });
    } catch (err) {
      console.error("Auto-save fejlede:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="tracker-history-section">
      <h2>Historik ({entries.length})</h2>
      <div className="entries-list">
        {entries.map((entry) => {
          const timestamps = [
            new Date(entry.lastUpdated),
            ...entry.values.map((v) => new Date(v.lastUpdated)),
          ];
          const mostRecentUpdate = new Date(Math.max(...timestamps));

          return (
            <div key={entry.id} className="entry-card">
              <div className="delete-tracker-entry">
                <button onClick={() => handleDeleteTrackerEntry(entry.id)}>
                  <BsFillTrash3Fill />
                </button>
              </div>
              <div className="entry-header">
                <small>
                  <span>
                    {new Date(entry.createdAt).toLocaleString("da-DK")}
                  </span>
                  <span className="header-updated">
                    (Opdateret:{" "}
                    {mostRecentUpdate.toLocaleTimeString("da-DK", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                </small>
              </div>

              <div className="entry-fields-edit">
                {entry.values.map((v) => {
                  const key = `${entry.id}-${v.id}`;
                  const currentValue = localValues[key] ?? v.value;
                  const htmlInputType = mapFieldType(v.fieldType);
                  const isBoolean = htmlInputType === "checkbox";
                  const isValueMissing =
                    currentValue === "" ||
                    currentValue === null ||
                    currentValue === "N/A";

                  return (
                    <div key={v.id} className="inline-edit-group">
                      <label className="input-label-row">
                        <strong>{v.fieldLabel}</strong>
                      </label>

                      {isBoolean ? (
                        <input
                          type="checkbox"
                          checked={
                            currentValue === "true" || currentValue === true
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleLocalChange(entry.id, v.id, checked);
                            handleAutoSave(entry, v.id, checked);
                          }}
                        />
                      ) : (
                        <div className="input-with-status">
                          <input
                            type={htmlInputType}
                            value={currentValue}
                            onChange={(e) =>
                              handleLocalChange(entry.id, v.id, e.target.value)
                            }
                            onBlur={(e) => {
                              if (
                                htmlInputType === "number" &&
                                e.target.validity?.badInput
                              ) {
                                alert("Indtast venligst et gyldigt tal");
                                return;
                              }
                              handleAutoSave(entry, v.id, e.target.value);
                            }}
                            placeholder="Ikke angivet"
                            className={`inline-input ${isValueMissing ? "missing-style" : ""}`}
                          />
                        </div>
                      )}

                      {savingId === key && (
                        <span className="inline-status saving">Gemmer...</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrackerHistory;
