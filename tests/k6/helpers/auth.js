import http from 'k6/http';
import { check } from 'k6';

export function login(baseUrl, username = 'admin', password = 'admin') {
  const url = `${baseUrl}/login`;
  const payload = JSON.stringify({ username, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'login status is 200': (r) => r.status === 200 });
  let body = {};
  try { body = res.json(); } catch (e) { body = {}; }
  const token = body.token || (body.data && body.data.token) || null;
  return { res, token };
}
