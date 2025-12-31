// API Base URL configuration
// Uses environment variable in production, defaults to localhost in development

const API_BASE = import.meta.env.VITE_API_URL || "https://tiesdao-websitexr.vercel.app";

export default API_BASE;
