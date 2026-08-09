export type IntegrationProvider = "microsoft_365" | "email" | "power_automate" | "webhook" | "ai";

export type IntegrationStatus = {
  provider: IntegrationProvider;
  state: "placeholder" | "pending" | "connected" | "error" | "disabled";
  capabilities: string[];
  lastSyncedAt?: string;
};

export type IntegrationContext = {
  tenantId: string;
  actorId?: string;
  correlationId: string;
};

export type DocumentUpload = {
  name: string;
  contentType: string;
  bytes: Uint8Array;
  projectId?: string;
  category: string;
};

export type ExternalDocument = {
  externalId: string;
  externalUrl: string;
  name: string;
  version?: string;
};

export interface Microsoft365Gateway {
  status(context: IntegrationContext): Promise<IntegrationStatus>;
  uploadDocument(context: IntegrationContext, upload: DocumentUpload): Promise<ExternalDocument>;
  createCalendarEvent(
    context: IntegrationContext,
    event: { title: string; startsAt: string; endsAt: string; attendeeEmails: string[] },
  ): Promise<{ externalId: string; externalUrl?: string }>;
}

export interface EmailGateway {
  status(context: IntegrationContext): Promise<IntegrationStatus>;
  send(
    context: IntegrationContext,
    message: { to: string[]; subject: string; html: string; replyTo?: string },
  ): Promise<{ messageId: string }>;
}

export interface AutomationGateway {
  status(context: IntegrationContext): Promise<IntegrationStatus>;
  emit(
    context: IntegrationContext,
    event: { name: string; version: number; payload: Record<string, unknown> },
  ): Promise<{ accepted: boolean; eventId: string }>;
}

export interface AIGateway {
  status(context: IntegrationContext): Promise<IntegrationStatus>;
  answer(
    context: IntegrationContext,
    request: { question: string; recordScope: string[]; maxRecords?: number },
  ): Promise<{ answer: string; citations: Array<{ recordId: string; label: string }> }>;
}

export class IntegrationNotConfiguredError extends Error {
  constructor(provider: IntegrationProvider) {
    super(`${provider} is an integration placeholder and has no credentials configured.`);
    this.name = "IntegrationNotConfiguredError";
  }
}

const placeholders: IntegrationStatus[] = [
  { provider: "microsoft_365", state: "placeholder", capabilities: ["sharepoint_documents", "calendar", "outlook_mail"] },
  { provider: "email", state: "placeholder", capabilities: ["proposal_delivery", "task_notifications"] },
  { provider: "power_automate", state: "placeholder", capabilities: ["approval_flows", "microsoft_native_automation"] },
  { provider: "webhook", state: "placeholder", capabilities: ["signed_outbound_events", "idempotent_inbound_events"] },
  { provider: "ai", state: "placeholder", capabilities: ["tenant_scoped_search", "summaries", "drafts"] },
];

export function getIntegrationStatuses(): IntegrationStatus[] {
  return placeholders.map((status) => ({ ...status, capabilities: [...status.capabilities] }));
}

