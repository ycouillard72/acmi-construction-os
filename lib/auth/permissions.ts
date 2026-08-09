export type TenantRole =
  | "administrator"
  | "project_manager"
  | "estimator"
  | "field_crew"
  | "accounting"
  | "read_only";

export type Resource =
  | "tenant"
  | "members"
  | "crm"
  | "opportunities"
  | "properties"
  | "estimates"
  | "projects"
  | "job_costs"
  | "partners"
  | "documents"
  | "activities"
  | "integrations";

export type Action = "read" | "create" | "update" | "delete" | "approve" | "manage";

type Grant = `${Resource}:${Action}` | "*";

const permissions: Record<TenantRole, ReadonlySet<Grant>> = {
  administrator: new Set<Grant>(["*"]),
  project_manager: new Set<Grant>([
    "crm:read", "opportunities:read", "properties:read", "properties:update",
    "estimates:read", "projects:read", "projects:create", "projects:update",
    "job_costs:read", "job_costs:create", "job_costs:update", "partners:read",
    "documents:read", "documents:create", "documents:update", "activities:read",
    "activities:create", "activities:update",
  ]),
  estimator: new Set<Grant>([
    "crm:read", "opportunities:read", "opportunities:update", "properties:read",
    "estimates:read", "estimates:create", "estimates:update", "estimates:approve",
    "projects:read", "job_costs:read", "partners:read", "documents:read",
    "documents:create", "activities:read", "activities:create", "activities:update",
  ]),
  field_crew: new Set<Grant>([
    "properties:read", "projects:read", "partners:read", "documents:read",
    "documents:create", "activities:read", "activities:create", "activities:update",
  ]),
  accounting: new Set<Grant>([
    "crm:read", "opportunities:read", "estimates:read", "projects:read",
    "job_costs:read", "job_costs:create", "job_costs:update", "partners:read",
    "documents:read", "documents:create", "activities:read",
  ]),
  read_only: new Set<Grant>([
    "crm:read", "opportunities:read", "properties:read", "estimates:read",
    "projects:read", "job_costs:read", "partners:read", "documents:read",
    "activities:read",
  ]),
};

export function can(role: TenantRole, resource: Resource, action: Action): boolean {
  const grants = permissions[role];
  return grants.has("*") || grants.has(`${resource}:${action}`);
}

export function assertPermission(role: TenantRole, resource: Resource, action: Action): void {
  if (!can(role, resource, action)) {
    throw new Error(`Role ${role} cannot ${action} ${resource}.`);
  }
}

export const roleLabels: Record<TenantRole, string> = {
  administrator: "Administrator",
  project_manager: "Project Manager",
  estimator: "Estimator",
  field_crew: "Field Crew",
  accounting: "Accounting",
  read_only: "Read Only",
};

