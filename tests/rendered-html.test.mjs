import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

function request(worker, path, accept = "text/html") {
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ACMI contractor workspace", async () => {
  const worker = await getWorker();
  const response = await request(worker, "/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ACMI Construction OS<\/title>/i);
  assert.match(html, /ACMI Construction/);
  assert.match(html, /Operating overview/);
  assert.match(html, /Good morning, Yannick/);
  assert.match(html, /Active jobs/);
  assert.match(html, /Pipeline movement/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("exposes integration and database readiness through the health endpoint", async () => {
  const worker = await getWorker();
  const response = await request(worker, "/api/health", "application/json");
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.service, "acmi-construction-os");
  assert.equal(payload.mode, "demo");
  assert.equal(payload.integrations.length, 5);
  assert.ok(payload.integrations.every((integration) => integration.state === "placeholder"));
});

test("keeps multi-tenant and integration foundations in the scaffold", async () => {
  const [schema, permissions, integrations, page, layout, packageJson, previewFiles] = await Promise.all([
    readFile(new URL("../supabase/migrations/0001_acmi_contractor_os.sql", import.meta.url), "utf8"),
    readFile(new URL("../lib/auth/permissions.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/integrations/contracts.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../app/_sites-preview/", import.meta.url)),
  ]);

  assert.deepEqual(previewFiles, []);
  assert.match(schema, /create table public\.tenants/);
  assert.match(schema, /enable row level security/);
  assert.match(schema, /create table public\.projects/);
  assert.match(schema, /create table public\.integration_connections/);
  assert.match(permissions, /administrator/);
  assert.match(permissions, /field_crew/);
  assert.match(integrations, /Microsoft365Gateway/);
  assert.match(integrations, /AIGateway/);
  assert.match(page, /<ContractorOS \/>/);
  assert.match(layout, /ACMI Construction OS/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
