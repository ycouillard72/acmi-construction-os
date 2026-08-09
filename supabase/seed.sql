-- Realistic fictional demo records for ACMI Construction.
-- Run only in a local or dedicated preview environment.

insert into public.tenants (id, name, slug, legal_name, phone, email, settings)
values (
  '10000000-0000-4000-8000-000000000001',
  'ACMI Construction',
  'acmi-construction',
  'ACMI Construction',
  '(863) 563-1200',
  'info@acmiconstruction.com',
  '{"service_area":"Central Florida","default_margin_target":24,"currency":"USD"}'::jsonb
)
on conflict (id) do nothing;

insert into public.companies (id, tenant_id, name, kind, phone, email, notes, tags)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Cofield Residence', 'customer', '(352) 555-0164', 'd.cofield@example.com', 'Active roof replacement client in Clermont.', array['residential','roofing']),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Lakeside Retail Partners', 'prospect', '(863) 555-0182', 'facilities@lakeside.example', 'Three retail properties in Polk County.', array['commercial','roofing']),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Magnolia Dental Group', 'prospect', '(407) 555-0120', 'admin@magnoliadental.example', 'Tenant-improvement proposal under review.', array['commercial','buildout']),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Orange Line Electric', 'subcontractor', '(407) 555-0131', 'office@orangeline.example', 'Preferred electrical subcontractor.', array['electrical','preferred']),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'Lake County Roofing Supply', 'vendor', '(863) 555-0175', 'orders@lcrs.example', 'Primary roofing material supplier.', array['roofing','materials','preferred'])
on conflict (tenant_id, name) do nothing;

insert into public.contacts (id, tenant_id, company_id, first_name, last_name, title, email, phone, source, tags)
values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Daniel', 'Cofield', 'Homeowner', 'd.cofield@example.com', '(352) 555-0164', 'Referral', array['active_client']),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'Jamal', 'Brooks', 'Facilities Director', 'j.brooks@example.com', '(863) 555-0182', 'Website', array['commercial','qualified']),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000003', 'Alyssa', 'Green', 'Practice Manager', 'alyssa@magnoliadental.example', '(407) 555-0120', 'Architect referral', array['commercial','proposal_sent']),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000004', 'Luis', 'Rivera', 'Owner', 'luis@orangeline.example', '(407) 555-0131', 'Trade network', array['subcontractor'])
on conflict (id) do nothing;

insert into public.properties (
  id, tenant_id, company_id, primary_contact_id, name, property_type,
  address_line_1, city, state, postal_code, county, roof_system,
  roof_age_years, roof_squares, access_notes
)
values
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Cofield Residence', 'single_family', '4218 Arrowtree Blvd', 'Clermont', 'FL', '34711', 'Lake', 'standing_seam_metal', 0, 38.5, 'Gate code is stored in the secure field notes.'),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'Oak Ridge Retail Center', 'retail_center', '2800 Oak Ridge Commerce Dr', 'Lakeland', 'FL', '33801', 'Polk', 'tpo_60_mil', 18, 142.0, 'Crane plan must use the rear service lane after business hours.')
on conflict (id) do nothing;

insert into public.opportunities (
  id, tenant_id, company_id, contact_id, property_id, name, stage,
  service_type, priority, source, estimated_value, probability,
  expected_close_date, next_step, next_step_at
)
values
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', 'Lakeside Retail Roof', 'new_lead', 'commercial_roofing', 'hot', 'Website', 132000, 20, current_date + 35, 'Schedule roof walk and core sample', now() + interval '2 days'),
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', null, 'Magnolia Dental Buildout', 'proposal_sent', 'commercial_buildout', 'hot', 'Architect referral', 286000, 65, current_date + 18, 'Review proposal with ownership group', now() + interval '3 days')
on conflict (id) do nothing;

insert into public.estimates (
  id, tenant_id, opportunity_id, estimate_number, title, status,
  subtotal, tax, total, estimated_cost, overhead_percent, profit_percent,
  valid_until, sent_at
)
values (
  '60000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000002',
  'EST-26104',
  'Magnolia Dental Buildout',
  'sent',
  286000, 0, 286000, 216100, 10, 14.4,
  current_date + 14,
  now() - interval '2 days'
)
on conflict (tenant_id, estimate_number) do nothing;

insert into public.estimate_items (
  tenant_id, estimate_id, sort_order, cost_code, trade, description,
  quantity, unit, unit_cost, unit_price
)
values
  ('10000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 10, '01-100', 'General Conditions', 'Project management, supervision, temporary protection, and cleanup', 1, 'LS', 24500, 32500),
  ('10000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 20, '09-200', 'Interiors', 'Partitions, ceilings, doors, finishes, and dental casework coordination', 1, 'LS', 112800, 148500),
  ('10000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', 30, '26-100', 'Electrical', 'Power, lighting, low-voltage pathways, and equipment connections', 1, 'LS', 78800, 105000);

insert into public.projects (
  id, tenant_id, property_id, project_number, name, service_type, status,
  production_stage, start_date, target_completion_date, percent_complete,
  contract_amount, original_estimated_cost, committed_cost, actual_cost,
  forecast_cost, next_milestone, next_milestone_at, permit_number,
  roof_system, roof_squares, waste_factor, material_order_status, risk_level
)
values
  ('70000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'AC-26041', 'Cofield Residence Roof Replacement', 'roof_replacement', 'active', 'dry_in_complete', current_date - 12, current_date + 9, 62, 48600, 32740, 31420, 22860, 33450, 'Standing seam metal delivery', now() + interval '3 days', 'R-26-04188', 'standing_seam_metal', 38.5, 0.12, 'confirmed', 'normal'),
  ('70000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', 'AC-26028', 'Oak Ridge Commercial Reroof', 'commercial_roofing', 'procurement', 'material_procurement', current_date + 8, current_date + 42, 28, 218500, 164600, 151200, 26700, 171800, 'TPO and insulation delivery', now() + interval '6 days', 'BLD-26-1988', 'tpo_60_mil', 142.0, 0.08, 'scheduled', 'watch')
on conflict (tenant_id, project_number) do nothing;

insert into public.project_cost_entries (
  tenant_id, project_id, cost_code, trade, entry_type, vendor_company_id,
  reference_number, description, amount, entry_date, source_system
)
values
  ('10000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', '07-310', 'Roofing', 'commitment', '20000000-0000-4000-8000-000000000005', 'PO-26041-02', 'Standing seam panels, trim, clips, and accessories', 18640, current_date - 8, 'acmi_os'),
  ('10000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001', '02-410', 'Roofing', 'actual', null, 'TIME-26041-W1', 'Tear-off, disposal, and dry-in labor', 9220, current_date - 3, 'accounting_placeholder'),
  ('10000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000002', '07-540', 'Roofing', 'commitment', '20000000-0000-4000-8000-000000000005', 'PO-26028-01', 'TPO membrane, insulation, fasteners, and accessories', 104700, current_date - 5, 'acmi_os');

insert into public.partners (
  id, tenant_id, company_id, partner_type, trades, status, w9_received,
  agreement_signed, coi_expires_on, safety_score, quality_score, schedule_score
)
values
  ('80000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000004', 'subcontractor', array['electrical'], 'approved', true, true, current_date + 132, 94, 96, 91),
  ('80000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000005', 'vendor', array['roofing_materials'], 'approved', true, true, null, null, 97, 95)
on conflict (tenant_id, company_id) do nothing;

insert into public.documents (
  tenant_id, name, category, mime_type, version, storage_provider,
  project_id, metadata
)
values
  ('10000000-0000-4000-8000-000000000001', 'Cofield Notice of Commencement.pdf', 'permit_legal', 'application/pdf', 'v1', 'microsoft_365_placeholder', '70000000-0000-4000-8000-000000000001', '{"retention":"project_closeout_plus_7_years"}'::jsonb),
  ('10000000-0000-4000-8000-000000000001', 'Oak Ridge TPO Submittal.pdf', 'product_submittal', 'application/pdf', 'v2', 'metadata_only', '70000000-0000-4000-8000-000000000002', '{"approved":true}'::jsonb);

insert into public.activities (
  tenant_id, kind, status, title, description, priority, due_at, project_id
)
values
  ('10000000-0000-4000-8000-000000000001', 'task', 'open', 'Confirm Cofield metal delivery window', 'Confirm truck access and homeowner notification.', 'high', now() + interval '1 day', '70000000-0000-4000-8000-000000000001'),
  ('10000000-0000-4000-8000-000000000001', 'inspection', 'open', 'Oak Ridge preconstruction roof walk', 'Verify penetrations, staging, and crane location.', 'normal', now() + interval '5 days', '70000000-0000-4000-8000-000000000002'),
  ('10000000-0000-4000-8000-000000000001', 'call', 'open', 'Follow up on Magnolia proposal', 'Review alternates and anticipated decision date.', 'high', now() + interval '2 days', null);

insert into public.integration_connections (tenant_id, provider, status, display_name, config)
values
  ('10000000-0000-4000-8000-000000000001', 'microsoft_365', 'placeholder', 'Microsoft 365 / SharePoint', '{"capabilities":["documents","calendar","email"]}'::jsonb),
  ('10000000-0000-4000-8000-000000000001', 'email', 'placeholder', 'Transactional email', '{"capabilities":["proposal_delivery","notifications"]}'::jsonb),
  ('10000000-0000-4000-8000-000000000001', 'power_automate', 'placeholder', 'Power Automate', '{"capabilities":["outbound_webhooks","approval_flows"]}'::jsonb),
  ('10000000-0000-4000-8000-000000000001', 'ai', 'placeholder', 'AI workspace assistant', '{"capabilities":["search","summaries","drafts"]}'::jsonb)
on conflict (tenant_id, provider) do nothing;
