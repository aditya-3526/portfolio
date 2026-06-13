/**
 * API client. In dev, CRA proxies /api → http://localhost:5050 (see package.json).
 * In prod, set REACT_APP_API_BASE to your backend URL. Render's Blueprint
 * supplies a bare hostname (no scheme), so prepend https:// when needed.
 */
const RAW = (process.env.REACT_APP_API_BASE || "").trim().replace(/\/$/, "");
const BASE = RAW && !/^https?:\/\//.test(RAW) ? `https://${RAW}` : RAW;

export async function fetchPortfolio() {
  const res = await fetch(`${BASE}/api/portfolio`);
  if (!res.ok) throw new Error(`Portfolio fetch failed: ${res.status}`);
  return res.json();
}
