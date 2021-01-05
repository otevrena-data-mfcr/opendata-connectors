export const ENDPOINT = process.env["ENDPOINT"] || "http://localhost";
export const BASE_URL = process.env["BASE_URL"] || "";
export const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;
export const CACHE_TIMEOUT = Number(process.env["CACHE_TIMEOUT"]) || 30;