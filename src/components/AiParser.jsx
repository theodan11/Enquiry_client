import { useState } from "react";
import { aiParse, createEnquiry } from "../api";

export default function AiParser({ onEnquiryCreated }) {
  const [message, setMessage] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleParse = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    setParsed(null);
    setSuccess("");

    try {
      const { data } = await aiParse(message);
      setParsed(data);
    } catch (err) {
      setError("AI parsing failed. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsed) return;
    setSaving(true);
    try {
      await createEnquiry({
        name: parsed.name || "Unknown",
        phone: parsed.phone || "",
        channel: parsed.channel || "Other",
        interest: parsed.interest || "General Enquiry",
        language: parsed.language || "English",
        message: message,
        status: "New",
      });
      setSuccess("Enquiry saved successfully!");
      setMessage("");
      setParsed(null);
      onEnquiryCreated();
    } catch (err) {
      setError("Failed to save enquiry: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ai-parser">
      <div className="ai-section">
        <h3>🤖 AI Message Parser</h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Paste any enquiry message below and AI will automatically extract the contact details, interest, and language.
        </p>

        <textarea
          className="ai-textarea"
          placeholder="Paste an enquiry message here... (WhatsApp message, Facebook message, email, etc.)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button
            className="btn btn-primary"
            onClick={handleParse}
            disabled={loading || !message.trim()}
          >
            {loading ? <><span className="spinner" /> Analyzing...</> : "🔍 Parse Message"}
          </button>
          {message && (
            <button
              className="btn btn-ghost"
              onClick={() => { setMessage(""); setParsed(null); setError(""); setSuccess(""); }}
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", borderRadius: "var(--radius-sm)", color: "var(--accent-rose)", fontSize: "13px" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "var(--radius-sm)", color: "var(--accent-emerald)", fontSize: "13px" }}>
            {success}
          </div>
        )}
      </div>

      {parsed && (
        <div className="ai-section">
          <h3>📋 Extracted Details</h3>
          <div className="ai-result">
            <div className="ai-result-grid">
              <div className="ai-result-field">
                <span>Name</span>
                <span>{parsed.name || "—"}</span>
              </div>
              <div className="ai-result-field">
                <span>Phone</span>
                <span>{parsed.phone || "—"}</span>
              </div>
              <div className="ai-result-field">
                <span>Channel</span>
                <span>{parsed.channel || "—"}</span>
              </div>
              <div className="ai-result-field">
                <span>Interest</span>
                <span>{parsed.interest || "—"}</span>
              </div>
              <div className="ai-result-field">
                <span>Language</span>
                <span>{parsed.language || "—"}</span>
              </div>
              {parsed.summary && (
                <div className="ai-result-field" style={{ gridColumn: "1 / -1" }}>
                  <span>Summary</span>
                  <span>{parsed.summary}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <><span className="spinner" /> Saving...</> : "✅ Save as Enquiry"}
            </button>
            <button className="btn btn-ghost" onClick={handleParse} disabled={loading}>
              🔄 Re-parse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
