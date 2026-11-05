import { useState, useEffect } from "react";
import { getReminders } from "../api";

export default function Reminders({ onSelectEnquiry }) {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);

  // const fetchReminders = async () => {
  //   try {
  //     const { data } = await getReminders();
  //     setReminders(data);
  //   } catch (err) {
  //     console.error("Failed to fetch reminders:", err);
  //   }
  // };

  const fetchReminders = async () => {
    try {
      const { data } = await getReminders();
      // Sort descending: newest (most recent) at the top
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReminders(sorted);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
    // Poll every 3 seconds instead of every 60 seconds
    const interval = setInterval(fetchReminders, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update helper so seconds are visible during testing
  const timeAgo = (date) => {
    const diffSec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const hours = Math.floor(diffSec / 3600);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  //
  // useEffect(() => {
  //   fetchReminders();
  //   const interval = setInterval(fetchReminders, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  // const timeAgo = (date) => {
  //   const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
  //   if (hours < 24) return `${hours}h ago`;
  //   return `${Math.floor(hours / 24)}d ago`;
  // };
  //
  return (
    <div style={{ position: "relative" }}>
      <button className="btn-icon" onClick={() => setOpen(!open)} title="Follow-up reminders">
        🔔
        {reminders.length > 0 && (
          <span className="reminder-badge">{reminders.length}</span>
        )}
      </button>

      {open && (
        <div className="reminder-dropdown">
          <div className="reminder-header">
            ⏰ Follow-up Needed ({reminders.length})
          </div>
          <div className="reminder-list">
            {reminders.length === 0 ? (
              <div className="reminder-empty">
                ✅ No overdue follow-ups!
              </div>
            ) : (
              reminders.map((r) => (
                <div
                  key={r._id}
                  className="reminder-item"
                  onClick={() => {
                    onSelectEnquiry(r);
                    setOpen(false);
                  }}
                >
                  <div className="reminder-name">{r.name}</div>
                  <div className="reminder-meta">
                    {r.channel} · {r.interest} · {timeAgo(r.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
