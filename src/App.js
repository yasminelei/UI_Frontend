import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    study_hours: "",
    sleep_hours: "",
    attendance: "",
    participation: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_hours_per_week: parseFloat(formData.study_hours),
          sleep_hours_per_night: parseFloat(formData.sleep_hours),
          attendance: parseFloat(formData.attendance),
          participation_score: parseFloat(formData.participation)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult({
        result: data.label.toLowerCase(),
        confidence: `${data.confidence}%`,
        percentage: `${data.confidence}%`,
        interpretation: data.label === "Pass"
          ? "You are likely to pass based on your habits."
          : "Improvement is needed to pass.",
        warnings: [] // Optional, add conditions if needed
      });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Prediction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🎯 Student Performance Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>
          📘 Study Hours per Week:
          <input
            type="number"
            step="any"
            name="study_hours"
            value={formData.study_hours}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          😴 Sleep Hours per Day:
          <input
            type="number"
            step="any"
            name="sleep_hours"
            value={formData.sleep_hours}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          🏫 Attendance Activity:
          <input
            type="number"
            step="any"
            name="attendance"
            value={formData.attendance}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          🗣️ Class Participation:
          <input
            type="number"
            step="any"
            name="participation"
            value={formData.participation}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result && (
        <div className={`result ${result.result === "pass" ? "pass" : "fail"}`}>
          <h2>🎓 Result: {result.result.toUpperCase()}</h2>
          <p>Confidence Level: {result.confidence}</p>
          <p>Estimated Chance of Passing: {result.percentage}</p>
          <p><strong>Interpretation:</strong> {result.interpretation}</p>
          {result.warnings && result.warnings.length > 0 && (
            <div className="warnings">
              <h4>⚠️ Warnings:</h4>
              <ul>
                {result.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
