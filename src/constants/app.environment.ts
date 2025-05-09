const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const CONTEXT_PATH = process.env.NEXT_PUBLIC_CONTEXT_PATH || "/api";

export { BACKEND_URL, CONTEXT_PATH };
