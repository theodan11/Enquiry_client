import { useState } from "react";
import EnquiryCard from "./EnquiryCard";

const STATUSES = [
  { key: "New", color: "var(--col-new)" },
  { key: "Contacted", color: "var(--col-contacted)" },
  { key: "Interested", color: "var(--col-interested)" },
  { key: "Paid", color: "var(--col-paid)" },
  { key: "Lost", color: "var(--col-lost)" },
];

export default function Pipeline({ enquiries, onStatusChange, onSelectEnquiry }) {
  const [dragOverCol, setDragOverCol] = useState(null);

  const grouped = {};
  STATUSES.forEach((s) => (grouped[s.key] = []));
  enquiries.forEach((e) => {
    if (grouped[e.status]) grouped[e.status].push(e);
  });

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const enquiryId = e.dataTransfer.getData("enquiryId");
    if (enquiryId) {
      onStatusChange(enquiryId, targetStatus);
    }
  };

  return (
    <div className="pipeline">
      {STATUSES.map((s) => (
        <div
          key={s.key}
          className={`pipeline-column ${dragOverCol === s.key ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverCol(s.key);
          }}
          onDragLeave={() => setDragOverCol(null)}
          onDrop={(e) => handleDrop(e, s.key)}
        >
          <div className="column-header">
            <div className="column-title">
              <span className="column-dot" style={{ background: s.color }} />
              {s.key}
            </div>
            <span className="column-count">{grouped[s.key].length}</span>
          </div>
          <div className="column-cards">
            {grouped[s.key].length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                No enquiries
              </div>
            ) : (
              grouped[s.key].map((enquiry) => (
                <EnquiryCard
                  key={enquiry._id}
                  enquiry={enquiry}
                  onClick={onSelectEnquiry}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
