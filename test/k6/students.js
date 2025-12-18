import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/baseUrl.js';
import { randomEmail } from './helpers/email.js';
import { login } from './helpers/auth.js';

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    http_req_duration: ['p(95)<2000']
  }
};

const postNotasTrend = new Trend('post_notas_duration_ms');

export default function () {
  const baseUrl = getBaseUrl();

  // Auth
  group('auth', () => {
    const { res, token } = login(baseUrl, 'admin', 'admin');
    check(res, { 'login returned token': (r) => {
      try { const b = r.json(); return !!(b && (b.token || (b.data && b.data.token))); } catch (e) { return false; }
    }});
    if (!token) {
      // if login failed, stop this VU early
      return;
    }

    const authHeader = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

    group('student flow', () => {
      const username = randomEmail();
      // register student
      const registerRes = http.post(`${baseUrl}/students`, JSON.stringify({ name: 'Load Test', username }), authHeader);
      check(registerRes, { 'register status is 201': (r) => r.status === 201 });

      // post nota
      const notaPayload = JSON.stringify({ nota: 8 });
      const start = Date.now();
      const notaRes = http.post(`${baseUrl}/students/${username}/notas`, notaPayload, authHeader);
      const duration = Date.now() - start;
      postNotasTrend.add(duration);
      check(notaRes, { 'post nota status is 200': (r) => r.status === 200 });

      // get student
      const getRes = http.get(`${baseUrl}/students/${username}`, authHeader);
      check(getRes, { 'get student status is 200': (r) => r.status === 200 });
    });
  });

  sleep(1);
}
