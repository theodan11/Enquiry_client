export default function EnquiryCard({ enquiry, onClick }) {
  const channelClass = () => {
    const ch = enquiry.channel.toLowerCase();
    if (ch.includes("whatsapp")) return "channel-whatsapp";
    if (ch.includes("facebook")) return "channel-facebook";
    if (ch.includes("website")) return "channel-website";
    if (ch.includes("phone")) return "channel-phone";
    return "channel-other";
  };

  const interestBadge = () => {
    const map = {
      Bootcamp: "badge-bootcamp",
      Fellowship: "badge-fellowship",
      "Corporate Training": "badge-corporate",
      Support: "badge-support",
      "Not a Lead": "badge-not-a-lead",
    };
    return map[enquiry.interest] || "";
  };

  const timeAgo = () => {
    const diff = Date.now() - new Date(enquiry.createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isOverdue = enquiry.status === "New" && 
    (Date.now() - new Date(enquiry.createdAt).getTime()) > 48 * 60 * 60 * 1000;

  return (
    <div
      className={`enquiry-card ${isOverdue ? "card-overdue" : ""}`}
      draggable
      onClick={() => onClick(enquiry)}
      onDragStart={(e) => {
        e.dataTransfer.setData("enquiryId", enquiry._id);
        e.target.classList.add("dragging");
      }}
      onDragEnd={(e) => e.target.classList.remove("dragging")}
    >
      <div className="card-header">
        <span className="card-name">{enquiry.name}</span>
        <span className={`card-channel ${channelClass()}`}>
          {enquiry.channel.replace(" Messenger", "").replace(" form", "").replace(" call note", "")}
        </span>
      </div>
      <div className="card-message">{enquiry.message}</div>
      <div className="card-footer">
        <span className={`card-badge ${interestBadge()}`}>{enquiry.interest}</span>
        <span className="card-time">{timeAgo()}</span>
      </div>
    </div>
  );
}
