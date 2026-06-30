import { useState } from "react";
import { axiosInstance } from "../../utils";
import { useQueryClient } from "@tanstack/react-query";
import EntryValues from "../entryValues/EntryValues";
import "./TrackerEntryForm.css";

function TrackerEntryForm({ numberOfEntries, currentTracker }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({}); // map
  const [error, setError] = useState("");
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [info, setInfo] = useState("");

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

  // update one specific field
  const handleValueChange = (fieldId, newValue) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: newValue,
    }));
  };

  async function handleAddEntry(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsSubmittingEntry(true);

    try {
      const fieldValues = Object.keys(values).map((fieldId) => ({
        fieldDefinitionId: fieldId,
        value: values[fieldId]?.toString() ?? "",
      }));
      await axiosInstance.post(`/v1/trackerentries/${currentTracker.id}`, {
        values: fieldValues,
      });
      setInfo("Måling tilføjet succesfuldt!");
      setValues({});

      queryClient.invalidateQueries({
        queryKey: ["trackers", currentTracker.id],
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke gemme målingen.");
    } finally {
      setIsSubmittingEntry(false);
    }
  }
  if (
    !currentTracker.id ||
    !currentTracker.fields ||
    currentTracker.fields.length === 0
  ) {
    return <p>Denne tracker har ingen felter endnu.</p>;
  }

  return (
    <>
      <div className="tracker-entry-form">
        <h3>Måling nr. {numberOfEntries + 1}</h3>
        <form onSubmit={handleAddEntry}>
          {currentTracker.fields.map((field) => (
            <div key={field.id} className="form-field-wrapper">
              <label htmlFor={`field-${field.id}`}>{field.label}</label>

              <EntryValues
                id={`field-${field.id}`}
                label={field.label}
                value={values[field.id] || ""}
                setValue={(newValue) => handleValueChange(field.id, newValue)}
                fieldType={mapFieldType(field.type)}
                isSubmittingEntry={isSubmittingEntry}
              />
            </div>
          ))}

          <button type="submit" disabled={isSubmittingEntry}>
            {isSubmittingEntry ? "Gemmer..." : "Gem måling"}
          </button>
          {info && <div className="info-message">{info}</div>}
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </>
  );
}
export default TrackerEntryForm;
