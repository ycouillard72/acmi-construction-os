-- ACMI Construction OS
-- PostgreSQL 15+ / Supabase-compatible foundation.
-- Every operational record carries tenant_id; Row Level Security enforces isolation.

create extension if not exists pgcrypto;

create type public.tenant_role as enum (
  'administrator',
  'project_manager',
  'estimator',
  'field_crew',
  'accounting',
  'read_only'
);

create type public.company_kind as enum (
  'customer', 'prospect', 'subcontractor', 'vendor', 'architect',
  'engineer', 'referral_partner', 'carrier', 'other'
);

create type public.opportunity_stage as enum (
  'new_lead', 'qualified', 'site_visit', 'estimating',
  'proposal_sent', 'negotiation', 'verbal_yes', 'won', 'lost'
);

create type public.estimate_status as enum (
  'draft', 'internal_review', 'sent', 'follow_up', 'approved', 'declined', 'expired'
);

create type public.project_status as enum (
  'preconstruction', 'permitting', 'procurement', 'active',
  'on_hold', 'substantial_completion', 'closeout', 'warranty', 'closed'
);

create type public.partner_status as enum ('pending', 'approved', 'review_required', 'suspended', 'inactive');
create type public.activity_kind as enum ('task', 'call', 'email', 'meeting', 'site_visit', 'note', 'inspection', 'milestone');
create type public.activity_status as enum ('open', 'in_progress', 'waiting', 'completed', 'cancelled');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  legal_name text,
  timezone text not null default 'America/New_York',
  phone text,
  email text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.tenant_role not null default 'read_only',
  is_active boolean not null default true,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  kind public.company_kind not null default 'prospect',
  website text,
  phone text,
  email text,
  billing_address jsonb,
  notes text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  first_name text not null,
  last_name text not null,
  title text,
  email text,
  phone text,
  preferred_contact_method text,
  source text,
  owner_id uuid references public.profiles(id),
  tags text[] not null default '{}',
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  primary_contact_id uuid references public.contacts(id) on delete set null,
  name text,
  property_type text,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state char(2) not null default 'FL',
  postal_code text not null,
  county text,
  parcel_id text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  roof_system text,
  roof_age_years numeric(5,2),
  roof_squares numeric(8,2),
  access_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  stage public.opportunity_stage not null default 'new_lead',
  service_type text not null,
  priority text not null default 'warm',
  source text,
  estimated_value numeric(14,2) not null default 0 check (estimated_value >= 0),
  probability integer not null default 10 check (probability between 0 and 100),
  expected_close_date date,
  loss_reason text,
  owner_id uuid references public.profiles(id),
  next_step text,
  next_step_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.estimates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  estimate_number text not null,
  title text not null,
  status public.estimate_status not null default 'draft',
  version integer not null default 1,
  subtotal numeric(14,2) not null default 0,
  tax numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  estimated_cost numeric(14,2) not null default 0,
  overhead_percent numeric(7,4) not null default 0,
  profit_percent numeric(7,4) not null default 0,
  gross_margin_percent numeric(7,4) generated always as (
    case when total = 0 then 0 else ((total - estimated_cost) / total) * 100 end
  ) stored,
  valid_until date,
  sent_at timestamptz,
  approved_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, estimate_number)
);

create table public.estimate_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  sort_order integer not null default 0,
  cost_code text,
  trade text,
  description text not null,
  quantity numeric(12,3) not null default 1,
  unit text not null default 'LS',
  unit_cost numeric(14,2) not null default 0,
  unit_price numeric(14,2) not null default 0,
  allowance boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  estimate_id uuid references public.estimates(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  project_number text not null,
  name text not null,
  service_type text not null,
  status public.project_status not null default 'preconstruction',
  production_stage text,
  project_manager_id uuid references public.profiles(id),
  superintendent_id uuid references public.profiles(id),
  start_date date,
  target_completion_date date,
  actual_completion_date date,
  percent_complete numeric(5,2) not null default 0 check (percent_complete between 0 and 100),
  contract_amount numeric(14,2) not null default 0,
  original_estimated_cost numeric(14,2) not null default 0,
  committed_cost numeric(14,2) not null default 0,
  actual_cost numeric(14,2) not null default 0,
  forecast_cost numeric(14,2) not null default 0,
  approved_change_orders numeric(14,2) not null default 0,
  pending_change_orders numeric(14,2) not null default 0,
  next_milestone text,
  next_milestone_at timestamptz,
  permit_number text,
  claim_number text,
  carrier text,
  adjuster_name text,
  measurement_report_url text,
  roof_system text,
  roof_squares numeric(8,2),
  waste_factor numeric(6,3),
  material_order_status text,
  final_inspection_at timestamptz,
  warranty_expires_at date,
  risk_level text not null default 'normal',
  blockers text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_number)
);

create table public.project_cost_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  cost_code text not null,
  trade text,
  entry_type text not null check (entry_type in ('budget', 'commitment', 'actual', 'forecast', 'change_order')),
  vendor_company_id uuid references public.companies(id) on delete set null,
  reference_number text,
  description text,
  amount numeric(14,2) not null,
  entry_date date not null default current_date,
  source_system text not null default 'acmi_os',
  external_id text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  partner_type text not null check (partner_type in ('subcontractor', 'vendor', 'consultant')),
  trades text[] not null default '{}',
  status public.partner_status not null default 'pending',
  w9_received boolean not null default false,
  agreement_signed boolean not null default false,
  coi_expires_on date,
  workers_comp_expires_on date,
  license_number text,
  license_expires_on date,
  safety_score numeric(5,2),
  quality_score numeric(5,2),
  schedule_score numeric(5,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, company_id)
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  category text not null,
  mime_type text,
  byte_size bigint,
  version text,
  storage_provider text not null default 'metadata_only',
  external_id text,
  external_url text,
  sharepoint_site_id text,
  sharepoint_drive_id text,
  project_id uuid references public.projects(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  partner_id uuid references public.partners(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  kind public.activity_kind not null default 'task',
  status public.activity_status not null default 'open',
  title text not null,
  description text,
  priority text not null default 'normal',
  due_at timestamptz,
  completed_at timestamptz,
  assignee_id uuid references public.profiles(id),
  owner_id uuid references public.profiles(id),
  contact_id uuid references public.contacts(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  partner_id uuid references public.partners(id) on delete cascade,
  source text not null default 'manual',
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider text not null check (provider in ('microsoft_365', 'email', 'power_automate', 'webhook', 'ai')),
  status text not null default 'placeholder' check (status in ('placeholder', 'pending', 'connected', 'error', 'disabled')),
  display_name text,
  config jsonb not null default '{}'::jsonb,
  -- Never store raw OAuth secrets here. Use Supabase Vault or the hosting secret store.
  secret_reference text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider)
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider text not null,
  event_name text not null,
  external_id text,
  payload jsonb not null,
  status text not null default 'received',
  attempts integer not null default 0,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text,
  unique (tenant_id, provider, external_id)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index contacts_tenant_name_idx on public.contacts (tenant_id, last_name, first_name);
create index properties_tenant_city_idx on public.properties (tenant_id, city);
create index opportunities_tenant_stage_idx on public.opportunities (tenant_id, stage, expected_close_date);
create index estimates_tenant_status_idx on public.estimates (tenant_id, status, valid_until);
create index projects_tenant_status_idx on public.projects (tenant_id, status, target_completion_date);
create index project_cost_entries_project_idx on public.project_cost_entries (tenant_id, project_id, entry_date);
create index partners_tenant_status_idx on public.partners (tenant_id, status, coi_expires_on);
create index documents_project_idx on public.documents (tenant_id, project_id, category);
create index activities_tenant_due_idx on public.activities (tenant_id, status, due_at);
create index audit_events_tenant_created_idx on public.audit_events (tenant_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'tenants', 'profiles', 'companies', 'contacts', 'properties', 'opportunities',
    'estimates', 'projects', 'partners', 'documents', 'activities', 'integration_connections'
  ] loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

create or replace function public.is_tenant_member(check_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where tenant_id = check_tenant_id
      and user_id = auth.uid()
      and is_active = true
  );
$$;

create or replace function public.has_tenant_role(check_tenant_id uuid, allowed_roles public.tenant_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where tenant_id = check_tenant_id
      and user_id = auth.uid()
      and is_active = true
      and role = any(allowed_roles)
  );
$$;

grant execute on function public.is_tenant_member(uuid) to authenticated;
grant execute on function public.has_tenant_role(uuid, public.tenant_role[]) to authenticated;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

create policy tenants_select_member on public.tenants for select using (public.is_tenant_member(id));
create policy profiles_select_self on public.profiles for select using (id = auth.uid());
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy memberships_select_member on public.memberships for select using (public.is_tenant_member(tenant_id));
create policy memberships_admin_write on public.memberships for all
  using (public.has_tenant_role(tenant_id, array['administrator']::public.tenant_role[]))
  with check (public.has_tenant_role(tenant_id, array['administrator']::public.tenant_role[]));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'companies', 'contacts', 'properties', 'opportunities', 'estimates', 'estimate_items',
    'projects', 'project_cost_entries', 'partners', 'documents', 'activities',
    'integration_connections', 'webhook_events', 'audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I_tenant_select on public.%I for select using (public.is_tenant_member(tenant_id))',
      table_name, table_name
    );
    execute format(
      'create policy %I_tenant_insert on public.%I for insert with check (public.has_tenant_role(tenant_id, array[''administrator'', ''project_manager'', ''estimator'', ''field_crew'', ''accounting'']::public.tenant_role[]))',
      table_name, table_name
    );
    execute format(
      'create policy %I_tenant_update on public.%I for update using (public.has_tenant_role(tenant_id, array[''administrator'', ''project_manager'', ''estimator'', ''field_crew'', ''accounting'']::public.tenant_role[])) with check (public.has_tenant_role(tenant_id, array[''administrator'', ''project_manager'', ''estimator'', ''field_crew'', ''accounting'']::public.tenant_role[]))',
      table_name, table_name
    );
    execute format(
      'create policy %I_tenant_delete on public.%I for delete using (public.has_tenant_role(tenant_id, array[''administrator'']::public.tenant_role[]))',
      table_name, table_name
    );
  end loop;
end;
$$;

-- Hardening note: narrow field-crew/accounting writes with table-specific policies before production.
-- Service-role onboarding should create the first tenant, profile, and administrator membership atomically.
