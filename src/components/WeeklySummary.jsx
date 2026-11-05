import { useState, useEffect } from "react";
import { getSummaryData, getEnquiries, aiWeeklySummary } from "../api";

export default function WeeklySummary() {
  const [summaryData, setSummaryData] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getSummaryData();
      setSummaryData(data);
    } catch (err) {
      console.error("Failed to fetch summary data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateAiSummary = async () => {
    if (!summaryData) return;
    setGenerating(true);
    try {
      const { data: enquiries } = await getEnquiries();
      const { data } = await aiWeeklySummary({
        summaryData,
        enquiries: enquiries.slice(0, 15),
      });
      setAiSummary(data.summary);
    } catch (err) {
      setAiSummary("Failed to generate AI summary. Check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <span className="spinner" style={{ width: 24, height: 24 }} />
        Loading summary data...
      </div>
    );
  }

  if (!summaryData) return null;

  return (
    <div className="summary-container">
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{summaryData.total}</div>
          <div className="stat-label">Total Enquiries</div>
        </div>
        {Object.entries(summaryData.byStatus).map(([key, val]) => (
          <div className="stat-card" key={key}>
            <div className="stat-value">{val}</div>
            <div className="stat-label">{key}</div>
          </div>
        ))}
      </div>

      <div className="ai-section" style={{ marginBottom: "20px" }}>
        <h3>📊 By Channel</h3>
        <div className="ai-result-grid">
          {Object.entries(summaryData.byChannel).map(([key, val]) => (
            <div className="ai-result-field" key={key}>
              <span>{key}</span>
              <span>{val} enquiries</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-section" style={{ marginBottom: "20px" }}>
        <h3>🎯 By Interest</h3>
        <div className="ai-result-grid">
          {Object.entries(summaryData.byInterest).map(([key, val]) => (
            <div className="ai-result-field" key={key}>
              <span>{key}</span>
              <span>{val} enquiries</span>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-ai-text">
        <h3>🤖 AI Weekly Report</h3>
        {aiSummary ? (
          <p>{aiSummary}</p>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <button
              className="btn btn-primary"
              onClick={generateAiSummary}
              disabled={generating}
            >
              {generating ? <><span className="spinner" /> Generating Report...</> : "✨ Generate AI Weekly Report"}
            </button>
            <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
              AI will analyze your data and create an actionable summary
            </p>
          </div>
        )}

        {aiSummary && (
          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button className="btn btn-ghost btn-sm" onClick={generateAiSummary} disabled={generating}>
              🔄 Regenerate
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(aiSummary)}>
              📋 Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
