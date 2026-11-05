import Reminders from "./Reminders";

export default function Navbar({ activeTab, setActiveTab, onSelectEnquiry }) {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">BI</div>
          <div>
            <div className="navbar-title">BIAI CRM</div>
            <div className="navbar-subtitle">Enquiry Management</div>
          </div>
        </div>
        <div className="navbar-actions">
          <Reminders onSelectEnquiry={onSelectEnquiry} />
        </div>
      </nav>
      <div className="tabs">
        {[
          { id: "pipeline", label: "📊 Pipeline" },
          { id: "parser", label: "🤖 AI Parser" },
          { id: "summary", label: "📋 Weekly Summary" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
