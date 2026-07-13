import { FiCheck, FiX } from "react-icons/fi";
import "./UpdateTrackerForm.css";

function UpdateTrackerForm({
  handleEditTracker,
  updatedTrackerName,
  setUpdatedTrackerName,
  updatedTrackerDescription,
  setUpdatedTrackerDescription,
  updatedTrackerIsPublic,
  setUpdatedTrackerIsPublic,
  isSubmittingEdit,
  setEditMode,
  handleLocalFieldChange,
  localFields,
}) {
  return (
    <div>
      <form onSubmit={handleEditTracker} className="custom-form">
        <div className="custom-form-group">
          <input
            type="text"
            value={updatedTrackerName}
            onChange={(e) => setUpdatedTrackerName(e.target.value)}
            placeholder="Tracker navn"
          />
        </div>
        <div className="custom-form-group">
          <textarea
            value={updatedTrackerDescription}
            onChange={(e) => setUpdatedTrackerDescription(e.target.value)}
            placeholder="Tracker beskrivelse"
          />
          <div className="custom-form-group" style={{ alignItems: "center" }}>
            <label htmlFor="updatedTrackerIsPublic">Offentlig?</label>
            <input
              id="updatedTrackerIsPublic"
              type="checkbox"
              checked={!!updatedTrackerIsPublic}
              onChange={(e) => setUpdatedTrackerIsPublic(e.target.checked)}
            />
          </div>
        </div>

        <div className="edit-fields-list">
          <h3>Rediger tilhørende felter</h3>
          {localFields.map((field) => (
            <div key={field.id} className="edit-field-row">
              <input
                type="text"
                value={field.label}
                onChange={(e) =>
                  handleLocalFieldChange(field.id, "label", e.target.value)
                }
                placeholder="Feltnavn"
              />
              <textarea
                value={field.description ?? null}
                onChange={(e) =>
                  handleLocalFieldChange(
                    field.id,
                    "description",
                    e.target.value,
                  )
                }
                placeholder="Feltbeskrivelse"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleLocalFieldChange(
                    field.id,
                    "type",
                    Number(e.target.value),
                  )
                }
              >
                <option value={1}>Tal (Number)</option>
                <option value={0}>Tekst (Text)</option>
                <option value={2}>Dato (Date)</option>
                <option value={3}>Ja/Nej (Boolean)</option>
              </select>
            </div>
          ))}
        </div>
        <button type="submit" title="Gem ændringer" disabled={isSubmittingEdit}>
          <FiCheck size={24} color="green" />
        </button>
        <button
          type="button"
          onClick={() => setEditMode(false)}
          title="Annuller"
        >
          <FiX size={24} color="red" />
        </button>
      </form>
    </div>
  );
}

export default UpdateTrackerForm;
