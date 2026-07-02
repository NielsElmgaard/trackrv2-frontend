import { FiCheck, FiX } from "react-icons/fi";
import "./UpdateTrackerForm.css";

function UpdateTrackerForm({
  handleEditTracker,
  updatedTrackerName,
  setUpdatedTrackerName,
  isSubmittingEdit,
  setEditMode,
  handleLocalFieldChange,
  localFields,
}) {
  return (
    <form onSubmit={handleEditTracker} className="custom-form">
      <div
        className="custom-form-group"
      >
        <input
          type="text"
          value={updatedTrackerName}
          onChange={(e) => setUpdatedTrackerName(e.target.value)}
          placeholder="Tracker navn"
        />
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
      </div>

      <div className="edit-fields-list">
        <h3>Rediger tilhørende felter</h3>
        {localFields.map((field) => (
          <div
            key={field.id}
            className="edit-field-row"
          >
            <input
              type="text"
              value={field.label}
              onChange={(e) =>
                handleLocalFieldChange(field.id, "label", e.target.value)
              }
              placeholder="Felt navn"
            />
            <select
              value={field.type}
              onChange={(e) =>
                handleLocalFieldChange(field.id, "type", Number(e.target.value))
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
    </form>
  );
}

export default UpdateTrackerForm;
