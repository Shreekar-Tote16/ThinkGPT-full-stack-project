
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "/api"
    : "http://localhost:5000/api");
