export function randomEmail() {
  const t = Date.now();
  const r = Math.floor(Math.random() * 10000);
  return `testuser+${t}${r}@example.com`;
}
