import { useState } from "react";
import { updateEnquiry, deleteEnquiry } from "../api";
import AiReply from "./AiReply";

const STATUSES = ["New", "Contacted", "Interested", "Paid", "Lost"];
const INTERESTS = ["Bootcamp", "Fellowship", "Corporate Training", "General Enquiry", "Support", "Not a Lead"];
const CHANNELS = ["WhatsApp", "Facebook Messenger", "Facebook comment", "Website form", "Phone call note", "Other"];

export default function EnquiryModal({ enquiry, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: enquiry.name,
    phone: enquiry.phone,
    channel: enquiry.channel,
    interest: enquiry.interest,
    status: enquiry.status,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEnquiry(enquiry._id, form);
      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this enquiry permanently?")) return;
    setDeleting(true);
    try {
      await deleteEnquiry(enquiry._id);
      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{enquiry.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Original message */}
          <div className="modal-field">
            <label>Original Message</label>
            <div className="modal-message-box">
              <p>{enquiry.message}</p>
            </div>
          </div>

          {/* Editable fields */}
          <div className="modal-row">
            <div className="modal-field">
              <label>Name</label>
              <input value={form.name} onChange={handleChange("name")} />
            </div>
            <div className="modal-field">
              <label>Phone</label>
              <input value={form.phone} onChange={handleChange("phone")} placeholder="No phone" />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Channel</label>
              <select value={form.channel} onChange={handleChange("channel")}>
                {CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Interest</label>
              <select value={form.interest} onChange={handleChange("interest")}>
                {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Status</label>
              <select value={form.status} onChange={handleChange("status")}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Language</label>
              <input value={enquiry.language} disabled style={{ opacity: 0.6 }} />
            </div>
          </div>

          <div className="modal-field">
            <label>Received</label>
            <input value={formatDate(enquiry.createdAt)} disabled style={{ opacity: 0.6 }} />
          </div>

          {/* AI Reply */}
          <div className="modal-field">
            <label>AI Suggested Reply</label>
            <AiReply enquiry={enquiry} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "🗑 Delete"}
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner" /> Saving...</> : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
