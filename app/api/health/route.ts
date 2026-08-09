import { getIntegrationStatuses } from "../../../lib/integrations/contracts";

export async function GET() {
  return Response.json({
    service: "acmi-construction-os",
    status: "ok",
    mode: "demo",
    database: "postgresql/supabase-compatible schema included; connection not configured",
    integrations: getIntegrationStatuses(),
    timestamp: new Date().toISOString(),
  });
}

