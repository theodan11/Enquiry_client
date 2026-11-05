import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Enquiry endpoints
export const getEnquiries = () => API.get("/enquiries");
export const getEnquiry = (id) => API.get(`/enquiries/${id}`);
export const createEnquiry = (data) => API.post("/enquiries", data);
export const updateEnquiry = (id, data) => API.patch(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}`);
export const getReminders = () => API.get("/enquiries/reminders");
export const getSummaryData = () => API.get("/enquiries/summary");

// AI endpoints
export const aiParse = (message) => API.post("/ai/parse", { message });
export const aiReply = (data) => API.post("/ai/reply", data);
export const aiWeeklySummary = (data) => API.post("/ai/weekly-summary", data);
