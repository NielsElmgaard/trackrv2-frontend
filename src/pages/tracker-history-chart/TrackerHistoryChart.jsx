import "./TrackerHistoryChart.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useFetchTrackerEntries from "../../hooks/useFetchTrackerEntries.js";

function TrackerHistoryChart() {
  const location = useLocation();
  const currentTracker = location.state?.currentTracker || null;
  const trackerId = currentTracker?.id;

  const [startDate, setStartDate] = useState(() => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 7);
    return newDate.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [fieldLabel, setFieldLabel] = useState("");

  const { isPending, data: entries = [] } = useFetchTrackerEntries(
    currentTracker?.id,
    startDate,
    endDate,
  );

  const fieldLabels = [
    ...new Set(
      entries.flatMap((entry) =>
        (entry.values || [])
          .filter((v) => v.fieldType === 1)
          .map((v) => v.fieldLabel),
      ),
    ),
  ];

  useEffect(() => {
    if (fieldLabels.length > 0 && !fieldLabel) {
      setFieldLabel(fieldLabels[0]);
    }
  }, [fieldLabels, fieldLabel]);

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

  const valuesByDate = entries.reduce((acc, { values, createdAt }) => {
    const value = values?.find((v) => v.fieldLabel === fieldLabel);
    if (!value) return acc;

    const date = new Date(createdAt)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    acc[date] = (acc[date] || 0) + (parseFloat(value.value) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(valuesByDate)
    .map(([formattedDate, numericValue]) => ({ formattedDate, numericValue }))
    .reverse();

  return (
    <div className="chart-container">
      {fieldLabels.length > 0 ? (
        <div>
          <div>
            <select
              id="field-label"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
            >
              {fieldLabels.map((label, index) => {
                return (
                  <option key={index} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="chart-graph">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" stroke="var(--white)" />
                <YAxis dataKey="numericValue" stroke="var(--white)" />
                <Tooltip
                  labelStyle={{
                    color: "var(--black)",
                    fontWeight: "bold",
                  }}
                  itemStyle={{
                    color: "var(--black)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="numericValue"
                  stroke="var(--accent)"
                  name={fieldLabel}
                  dot={true}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="no-appropriate-fields">
          <h3>
            Denne tracker indeholder ikke nogen felter, der kan vises på en
            graf.
          </h3>
        </div>
      )}
    </div>
  );
}
export default TrackerHistoryChart;
