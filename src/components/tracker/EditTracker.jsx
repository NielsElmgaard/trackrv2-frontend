import { useState } from "react";
import useUpdateTracker from "../../hooks/useUpdateTracker.js";
import { axiosInstance } from "../../utils";
import UpdateTrackerForm from "../forms/UpdateTrackerForm.jsx";

function EditTracker({ currentTracker, setEditMode, setError, setInfo }) {
  const updateTrackerMutation = useUpdateTracker();
  const [updatedTrackerName, setUpdatedTrackerName] = useState(
    currentTracker?.name,
  );
  const [updatedTrackerDescription, setUpdatedTrackerDescription] = useState(
    currentTracker?.description,
  );
  const [localFields, setLocalFields] = useState(
    (currentTracker.fields || []).map((f) => ({
      id: f.id,
      label: f.label,
      description: f.description,
      type: f.type,
      entryValues: f.entryValues || [],
    })),
  );
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleLocalChange = (id, property, value) => {
    setLocalFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [property]: value } : f)),
    );
  };

  async function handleEditTracker(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsSubmittingEdit(true);

    try {
      await updateTrackerMutation.mutateAsync({
        trackerId: currentTracker.id,
        name: updatedTrackerName || currentTracker.name,
        description: updatedTrackerDescription,
        fields: localFields,
      });
      setInfo("Tracker blev opdateret succesfuldt!");
    } catch (err) {
      setError(err.response?.data?.detail || "Kunne ikke opdatere trackeren.");
    } finally {
      setEditMode(false);
      setIsSubmittingEdit(false);
    }
  }

  return (
    <>
      <UpdateTrackerForm
        handleEditTracker={handleEditTracker}
        updatedTrackerName={updatedTrackerName}
        setUpdatedTrackerName={setUpdatedTrackerName}
        updatedTrackerDescription={updatedTrackerDescription}
        setUpdatedTrackerDescription={setUpdatedTrackerDescription}
        isSubmittingEdit={isSubmittingEdit}
        setEditMode={setEditMode}
        handleLocalFieldChange={handleLocalChange}
        localFields={localFields}
      />
    </>
  );
}
export default EditTracker;
