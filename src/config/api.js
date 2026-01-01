// API Base URL configuration
// Uses environment variable in production, defaults to localhost in development

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;
