import { useState } from "react";

function EntryValues({ id,label, value, setValue, fieldType, isSubmittingEntry }) {
  const isCheckBox = fieldType === "checkbox"; // i.e. boolean

  return (
    <div className="entry-value-group">
      <input
        id={id}
        type={fieldType}
        value={isCheckBox ? undefined : value}
        checked={isCheckBox ? !!value : undefined}
        onChange={(e) =>
          setValue(isCheckBox ? e.target.checked : e.target.value)
        }
        placeholder={`Indtast ${label}`}
        disabled={isSubmittingEntry}
      />
    </div>
  );
}

export default EntryValues;
