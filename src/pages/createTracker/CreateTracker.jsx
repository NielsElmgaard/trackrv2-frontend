import { useState, useEffect } from "react";
import CreateTrackerEntryForm from "../../components/forms/CreateTrackerEntryForm";
import useFetchTracker from "../../hooks/useFetchTracker";
function CreateTracker({ currentTracker }) {
  const {
    isPending,
    data: trackerDetails,
    error,
  } = useFetchTracker({ trackerId: currentTracker?.id });
  const [numberOfEntries, setNumberOfEntries] = useState(0);

  useEffect(() => {
    if (trackerDetails && trackerDetails.entries) {
      setNumberOfEntries(trackerDetails.entries.length);
    } else if (currentTracker && currentTracker.entries) {
      setNumberOfEntries(currentTracker.entries.length);
    }
  }, [trackerDetails, currentTracker]);
  if (!currentTracker) return <div>Ingen tracker valgt</div>;
  if (isPending) return <div>Henter detaljer...</div>;
  return (
    <>
      <div className="create-tracker-container">
        <h1>Name: {currentTracker.name}</h1>
        <CreateTrackerEntryForm
          numberOfEntries={numberOfEntries}
          currentTracker={trackerDetails || currentTracker}
        />
      </div>
    </>
  );
}
export default CreateTracker;
