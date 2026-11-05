import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Pipeline from "./components/Pipeline";
import EnquiryModal from "./components/EnquiryModal";
import AiParser from "./components/AiParser";
import WeeklySummary from "./components/WeeklySummary";
import { getEnquiries, updateEnquiry } from "./api";

function App() {
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchEnquiries = async () => {
    try {
      const { data } = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
      setStatusMsg({ type: "error", text: "Failed to connect to server. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await updateEnquiry(enquiryId, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiryId ? { ...e, status: newStatus } : e))
      );
      setStatusMsg({ type: "success", text: `Moved to "${newStatus}"` });
      setTimeout(() => setStatusMsg(null), 2000);
    } catch (err) {
      setStatusMsg({ type: "error", text: "Failed to update status" });
    }
  };

  const handleSelectEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setActiveTab("pipeline");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-center">
          <span className="spinner" style={{ width: 28, height: 28 }} />
          Loading enquiries...
        </div>
      );
    }

    switch (activeTab) {
      case "pipeline":
        return (
          <Pipeline
            enquiries={enquiries}
            onStatusChange={handleStatusChange}
            onSelectEnquiry={setSelectedEnquiry}
          />
        );
      case "parser":
        return <AiParser onEnquiryCreated={fetchEnquiries} />;
      case "summary":
        return <WeeklySummary />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectEnquiry={handleSelectEnquiry}
      />

      <div className="main-content">
        {renderContent()}
      </div>

      {statusMsg && (
        <div className={`status-bar ${statusMsg.type === "error" ? "error" : ""}`}>
          {statusMsg.text}
        </div>
      )}

      {selectedEnquiry && (
        <EnquiryModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onUpdated={fetchEnquiries}
        />
      )}
    </div>
  );
}

export default App;
