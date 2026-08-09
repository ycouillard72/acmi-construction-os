import { dashboardMetrics, pipeline, projects, weekSchedule } from "../../../../lib/demo-data";

export async function GET() {
  return Response.json({
    tenant: { id: "10000000-0000-4000-8000-000000000001", name: "ACMI Construction", slug: "acmi-construction" },
    metrics: dashboardMetrics,
    pipeline,
    projects,
    schedule: weekSchedule,
    demo: true,
  });
}

