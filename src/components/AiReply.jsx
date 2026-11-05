import { useState } from "react";
import { aiReply } from "../api";

export default function AiReply({ enquiry }) {
  const [reply, setReply] = useState(enquiry.aiSuggestedReply || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateReply = async () => {
    setLoading(true);
    try {
      const { data } = await aiReply({
        message: enquiry.message,
        language: enquiry.language,
        interest: enquiry.interest,
        name: enquiry.name,
      });
      setReply(data.reply);
    } catch (err) {
      setReply("Failed to generate reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <button
        className="btn btn-primary btn-sm"
        onClick={generateReply}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Generating...</> : "✨ Generate AI Reply"}
      </button>

      {reply && (
        <div className="ai-reply-box">
          <div className="ai-reply-text">{reply}</div>
          <div className="ai-reply-actions">
            <button className="btn btn-ghost btn-sm" onClick={copyReply}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={generateReply} disabled={loading}>
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
