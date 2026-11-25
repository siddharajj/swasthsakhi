// SwasthSakhi — Clean Bento Health Care Dashboard, Yearly Schedule & Account Modal Views
import {
  LIFE_PHASES,
  CONDITIONS_CATALOG,
  ACCESS_TIERS_META,
  BATCH_GROUPS_META,
  buildPersonalizedPlan
} from './clinicalData.js';

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderCareDashboardView(profile, uiState) {
  const plan = buildPersonalizedPlan(profile);
  const totalCount = plan.tests.length;
  const doneCount = plan.tests.filter((t) => profile.completedTests && profile.completedTests[t.id]).length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const homeCount = plan.batches.morning_fasting_home.length;
  const clinicCount = plan.batches.imaging_clinic_visit.length + plan.batches.specialist_obgyn.length;

  // Active batch tab inside the main dashboard card (defaults to 'all')
  const batchTab = uiState.dashBatchTab || 'all';
  let displayedTests = plan.tests;
  let batchDesc = 'Showing all recommended screenings — filter by visit type above to plan your appointments.';
  if (batchTab === 'morning_fasting_home') {
    displayedTests = plan.batches.morning_fasting_home;
    batchDesc = BATCH_GROUPS_META.morning_fasting_home.subtitle;
  } else if (batchTab === 'imaging_clinic_visit') {
    displayedTests = plan.batches.imaging_clinic_visit;
    batchDesc = BATCH_GROUPS_META.imaging_clinic_visit.subtitle;
  } else if (batchTab === 'specialist_obgyn') {
    displayedTests = plan.batches.specialist_obgyn;
    batchDesc = BATCH_GROUPS_META.specialist_obgyn.subtitle;
  }

  // Fallback if selected batch happens to have 0 tests for this phase
  if (!displayedTests.length) {
    displayedTests = plan.tests;
  }

  // SVG Donut Progress Ring for KPI 1
  const radius = 20;
  const circ = +(2 * Math.PI * radius).toFixed(1);
  const dashOffset = +(circ - (pct / 100) * circ).toFixed(1);

  const testRowsHtml = displayedTests
    .map((t) => {
      const isDone = Boolean(profile.completedTests && profile.completedTests[t.id]);
      const tier = ACCESS_TIERS_META[t.accessTier];
      return `
        <div class="clean-test-row">
          <div class="clean-test-left">
            <button type="button" class="check-circle ${isDone ? 'checked' : ''}" data-action="toggle-test-done" data-test-id="${t.id}" aria-label="Toggle ${escapeHtml(t.name)}">
              ${isDone ? '✓' : ''}
            </button>
            <div class="clean-test-info">
              <div class="clean-test-title ${isDone ? 'is-done' : ''}">
                ${escapeHtml(t.name)}
              </div>
              <div class="clean-test-meta">
                <span class="badge ${tier.badgeClass}">${tier.shortBadge}</span>
                <span class="badge badge-rose">${escapeHtml(t.inrRange)}</span>
                <span class="body-xs">• ${escapeHtml(t.frequency)}</span>
              </div>
            </div>
          </div>
          <div class="clean-test-action">
            <button type="button" class="btn btn-outline btn-sm" data-action="open-test-detail" data-test-id="${t.id}">
              Details ›
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  const openRfIdx = uiState.openRedFlagIdx ?? 0;
  const redFlagAccordions = plan.redFlags
    .map((rf, idx) => {
      const isOpen = openRfIdx === idx;
      return `
        <div class="rf-accordion-item">
          <button type="button" class="rf-accordion-btn" data-action="toggle-rf-item" data-rf-idx="${idx}">
            <span>⚠️ ${escapeHtml(rf.symptom)}</span>
            <span style="font-size:0.75rem;color:var(--text-muted);flex-shrink:0;">${isOpen ? '▲' : '▼'}</span>
          </button>
          ${
            isOpen
              ? `
            <div class="rf-accordion-body">
              <div>${escapeHtml(rf.why)}</div>
              <div style="margin-top:5px;font-weight:750;color:var(--teal-700);">👉 ${escapeHtml(rf.action)}</div>
            </div>
          `
              : ''
          }
        </div>
      `;
    })
    .join('');

  return `
    <div>
      <!-- Clean Dashboard Title Header -->
      <div class="dash-header-bar">
        <div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-rose">${plan.phase.icon} ${escapeHtml(plan.phase.label)}</span>
            <span class="body-xs">Age ${escapeHtml(profile.age)} ${profile.relation ? '• ' + escapeHtml(profile.relation) : ''}</span>
            ${
              plan.bmi
                ? `<span class="badge ${plan.bmi >= 23 ? 'badge-rx' : 'badge-home'}">BMI ${plan.bmi}</span>`
                : ''
            }
          </div>
          <h1 class="h1" style="margin-top:5px;">${escapeHtml(profile.name)}’s Health Care Dashboard</h1>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-outline btn-sm" data-action="open-edit-profile">
            ✎ Edit Profile
          </button>
          <button type="button" class="btn btn-outline btn-sm" data-action="doctor-prep-sheet">
            👩‍⚕️ Doctor Sheet
          </button>
          <button type="button" class="btn btn-whatsapp btn-sm" data-action="share-care-plan">
            📲 Share Plan
          </button>
        </div>
      </div>

      <!-- 4 Bento KPI Summary Cards -->
      <div class="kpi-bento-grid">
        <div class="kpi-card" style="flex-direction:row;align-items:center;justify-content:space-between;">
          <div>
            <div class="kpi-label">Yearly Progress</div>
            <div class="kpi-value" style="margin-top:4px;">${doneCount} <span style="font-size:0.95rem;color:var(--text-muted);font-weight:600;">/ ${totalCount}</span></div>
            <div class="kpi-sub" style="margin-top:2px;">Checks completed</div>
          </div>
          <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="${radius}" fill="none" stroke="#f0e4e7" stroke-width="5" />
            <circle
              cx="26"
              cy="26"
              r="${radius}"
              fill="none"
              stroke="#9d174d"
              stroke-width="5"
              stroke-linecap="round"
              stroke-dasharray="${circ}"
              stroke-dashoffset="${dashOffset}"
              transform="rotate(-90 26 26)"
            />
            <text x="26" y="30" text-anchor="middle" font-size="11" font-weight="800" fill="#4a0d26">${pct}%</text>
          </svg>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Morning Home Draw</div>
          <div class="kpi-value">${homeCount} Tests</div>
          <div class="kpi-sub">🏠 Direct Path Lab • No GP Rx</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Clinic &amp; Imaging</div>
          <div class="kpi-value">${clinicCount} Checks</div>
          <div class="kpi-sub">🏥 Scans &amp; Gynecologist OPD</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-label">Est. Annual Cost</div>
          <div class="kpi-value" style="font-size:1.25rem;color:var(--plum-800);">${escapeHtml(plan.estimatedBundledInr)}</div>
          <div class="kpi-sub">India wellness combo rate</div>
        </div>
      </div>

      <!-- Main 2-Column Dashboard Grid -->
      <div class="dashboard-main-grid">
        <!-- Left Bento: Clean Visit-Batched Screening Table -->
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;">
            <div>
              <div class="eyebrow">Personalised Screening Plan</div>
              <h2 class="h2" style="margin-top:1px;">Grouped by Visit Type</h2>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-action="go-tab" data-tab="checklist">
              📅 12-Month View →
            </button>
          </div>

          <div class="batch-tabs" role="tablist">
            <button type="button" class="batch-tab-btn ${batchTab === 'all' ? 'active' : ''}" data-action="set-dash-batch" data-batch="all">
              All (${totalCount})
            </button>
            ${
              plan.batches.morning_fasting_home.length
                ? `<button type="button" class="batch-tab-btn ${batchTab === 'morning_fasting_home' ? 'active' : ''}" data-action="set-dash-batch" data-batch="morning_fasting_home">
                     🧪 Home Blood Draw (${plan.batches.morning_fasting_home.length})
                   </button>`
                : ''
            }
            ${
              plan.batches.imaging_clinic_visit.length
                ? `<button type="button" class="batch-tab-btn ${batchTab === 'imaging_clinic_visit' ? 'active' : ''}" data-action="set-dash-batch" data-batch="imaging_clinic_visit">
                     🏥 Clinic &amp; Scans (${plan.batches.imaging_clinic_visit.length})
                   </button>`
                : ''
            }
            ${
              plan.batches.specialist_obgyn.length
                ? `<button type="button" class="batch-tab-btn ${batchTab === 'specialist_obgyn' ? 'active' : ''}" data-action="set-dash-batch" data-batch="specialist_obgyn">
                     👩‍⚕️ Doctor Guided (${plan.batches.specialist_obgyn.length})
                   </button>`
                : ''
            }
          </div>

          <div class="body-xs" style="padding:10px 4px 4px;">
            ${escapeHtml(batchDesc)}
          </div>

          <div class="clean-test-list">
            ${testRowsHtml}
          </div>
        </div>

        <!-- Right Bento: Concise Clinical Context, Lab Shortcut & Expandable Safety Net -->
        <aside class="stack sticky-side" style="gap:16px;">
          <!-- Life Stage India Context + Lab Analyser Action -->
          <div class="card card-subtle">
            <div class="eyebrow">🇮🇳 India Stage Focus</div>
            <p class="body-sm" style="margin-top:5px;color:var(--text-main);">
              ${escapeHtml(plan.phase.indiaInsight)}
            </p>
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f2d5dc;display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span class="body-xs" style="color:var(--plum-900);font-weight:600;">Have recent blood or scan reports?</span>
              <button type="button" class="btn btn-primary btn-sm" data-action="go-tab" data-tab="analyzer">
                Analyse Report →
              </button>
            </div>
          </div>

          <!-- Compact Expandable Red Flag Watchlist -->
          <div class="card card-redflag">
            <div class="eyebrow" style="color:var(--red-700);">Symptom Safety Net</div>
            <div class="h3" style="margin-top:2px;margin-bottom:4px;">Never-Ignore Signs in ${escapeHtml(plan.phase.shortLabel)}</div>
            <p class="body-xs" style="margin-bottom:10px;">Tap a symptom to see why routine blood tests miss it and what to ask for:</p>
            <div class="stack" style="gap:8px;">
              ${redFlagAccordions}
            </div>
          </div>

          ${
            plan.activeConditions.length
              ? `
            <div class="card">
              <div class="eyebrow">Active History Focus</div>
              <div class="badge-row" style="margin-top:8px;">
                ${plan.activeConditions.map((c) => `<span class="badge badge-rx">${escapeHtml(c.label)}</span>`).join('')}
              </div>
              <p class="body-xs" style="margin-top:8px;">
                ${escapeHtml(plan.activeConditions[0].careNote)}
              </p>
            </div>
          `
              : ''
          }
        </aside>
      </div>
    </div>
  `;
}

export function renderChecklistTimelineView(profile, uiState) {
  const plan = buildPersonalizedPlan(profile);
  const filter = uiState.checklistFilter || 'all';
  const subView = uiState.checklistMode || 'timeline';

  const doneCount = plan.tests.filter((t) => profile.completedTests && profile.completedTests[t.id]).length;

  const slotMap = new Map();
  for (const t of plan.tests) {
    const key = t.timelineSlot || 'Annual Check';
    if (!slotMap.has(key)) slotMap.set(key, []);
    slotMap.get(key).push(t);
  }

  const timelineHtml = Array.from(slotMap.entries())
    .map(
      ([slotTitle, tests]) => `
      <div class="card timeline-node">
        <div class="eyebrow">${escapeHtml(slotTitle)}</div>
        <div class="clean-test-list" style="margin-top:6px;">
          ${tests
            .map((t) => {
              const doneDate = profile.completedTests && profile.completedTests[t.id];
              const tier = ACCESS_TIERS_META[t.accessTier];
              return `
                <div class="clean-test-row">
                  <div class="clean-test-left">
                    <button type="button" class="check-circle ${doneDate ? 'checked' : ''}" data-action="toggle-test-done" data-test-id="${t.id}">
                      ${doneDate ? '✓' : ''}
                    </button>
                    <div class="clean-test-info">
                      <div class="clean-test-title ${doneDate ? 'is-done' : ''}">${escapeHtml(t.name)}</div>
                      <div class="clean-test-meta">
                        <span class="badge ${tier.badgeClass}">${tier.shortBadge}</span>
                        <span class="body-xs">• ${escapeHtml(t.frequency)} ${doneDate ? '• Done ' + escapeHtml(doneDate) : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div class="clean-test-action">
                    <button type="button" class="btn btn-outline btn-sm" data-action="open-test-detail" data-test-id="${t.id}">Where &amp; Prep</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const filteredTests = plan.tests.filter((t) => {
    const isDone = Boolean(profile.completedTests && profile.completedTests[t.id]);
    if (filter === 'pending') return !isDone;
    if (filter === 'home') return t.accessTier === 'direct_home';
    if (filter === 'clinic') return t.accessTier !== 'direct_home';
    return true;
  });

  const gridHtml = filteredTests.length
    ? `<div class="checklist-grid">` +
      filteredTests
        .map((t) => {
          const doneDate = profile.completedTests && profile.completedTests[t.id];
          const tier = ACCESS_TIERS_META[t.accessTier];
          return `
            <div class="card" style="padding:15px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;${doneDate ? 'background:#f8fbfa;border-color:#bbf7d0;' : ''}">
              <div style="display:flex;align-items:flex-start;gap:11px;">
                <button type="button" class="check-circle ${doneDate ? 'checked' : ''}" data-action="toggle-test-done" data-test-id="${t.id}">
                  ${doneDate ? '✓' : ''}
                </button>
                <div style="min-width:0;">
                  <div style="font-size:0.88rem;font-weight:750;${doneDate ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${escapeHtml(t.name)}</div>
                  <div class="body-xs" style="margin-top:2px;">${escapeHtml(t.frequency)}</div>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-left:33px;">
                <span class="badge ${tier.badgeClass}">${tier.shortBadge}</span>
                <button type="button" class="btn btn-outline btn-sm" data-action="open-test-detail" data-test-id="${t.id}">India Lab Guide ›</button>
              </div>
            </div>
          `;
        })
        .join('') +
      `</div>`
    : `<div class="card" style="text-align:center;padding:30px;">
         <div class="h3">🎉 All checks in this filter are completed!</div>
       </div>`;

  return `
    <div class="stack">
      <div class="dash-header-bar" style="margin-bottom:4px;">
        <div>
          <div class="eyebrow">Annual Schedule &amp; Checklist</div>
          <h1 class="h1" style="margin-top:2px;">${escapeHtml(profile.name)} • ${doneCount} of ${plan.tests.length} Done</h1>
        </div>
        <div style="display:flex;gap:6px;background:var(--bg-muted);padding:4px;border-radius:11px;">
          <button type="button" class="btn btn-sm" style="background:${subView === 'timeline' ? '#fff' : 'transparent'};color:${subView === 'timeline' ? 'var(--plum-800)' : 'var(--text-secondary)'};" data-action="set-checklist-mode" data-mode="timeline">
            📅 12-Month Timeline
          </button>
          <button type="button" class="btn btn-sm" style="background:${subView === 'checklist' ? '#fff' : 'transparent'};color:${subView === 'checklist' ? 'var(--plum-800)' : 'var(--text-secondary)'};" data-action="set-checklist-mode" data-mode="checklist">
            ☑️ Grid Checklist
          </button>
        </div>
      </div>

      ${
        subView === 'timeline'
          ? `
        <p class="body-sm">Tests batched chronologically so most annual screening finishes in just one morning blood draw and one half-day clinic visit:</p>
        <div class="timeline-list">${timelineHtml}</div>
      `
          : `
        <div class="pill-scroll">
          <button type="button" class="filter-pill ${filter === 'all' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="all">All (${plan.tests.length})</button>
          <button type="button" class="filter-pill ${filter === 'pending' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="pending">Pending (${plan.tests.length - doneCount})</button>
          <button type="button" class="filter-pill ${filter === 'home' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="home">🏠 Home Lab (No GP)</button>
          <button type="button" class="filter-pill ${filter === 'clinic' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="clinic">🏥 Clinic &amp; Scans</button>
        </div>
        ${gridHtml}
      `
      }
    </div>
  `;
}

export function renderAccountAndProfilesSheet(vault, savedVaults) {
  const profilesList = (vault.profiles || [])
    .map((p) => {
      const isCurrent = p.id === vault.activeProfileId;
      const phaseObj = LIFE_PHASES.find((lp) => lp.id === p.phase) || LIFE_PHASES[1];
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;border:1.5px solid ${isCurrent ? 'var(--plum-700)' : 'var(--border-soft)'};background:${isCurrent ? 'var(--rose-50)' : '#fff'};">
          <div>
            <div style="font-size:0.88rem;font-weight:750;">${phaseObj.icon} ${escapeHtml(p.name)} <span class="body-xs">(${escapeHtml(p.age)})</span></div>
            <div class="body-xs">${escapeHtml(phaseObj.label)}</div>
          </div>
          <div style="display:flex;gap:6px;">
            ${
              !isCurrent
                ? `<button type="button" class="btn btn-primary btn-sm" data-action="select-profile" data-profile-id="${p.id}">Switch</button>`
                : `<span class="badge badge-rose">Active</span>`
            }
            <button type="button" class="btn btn-outline btn-sm" data-action="edit-specific-profile" data-profile-id="${p.id}">Edit</button>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="stack" style="gap:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="eyebrow">${vault.isDemo ? 'Demo Preview Mode' : 'Family Profiles & Vault'}</div>
          <h2 class="h2">${vault.isDemo ? 'Sample Profiles' : 'Switch or Add Family Member'}</h2>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>

      <div class="stack" style="gap:8px;">
        ${profilesList}
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${
          vault.isDemo
            ? `<button type="button" class="btn btn-primary btn-block" data-action="start-onboarding">
                 ✨ Exit Demo &amp; Build Your Own Plan →
               </button>`
            : `<button type="button" class="btn btn-secondary btn-block" data-action="add-new-profile">
                 + Add Another Family Member (Mom / Sister / Self)
               </button>`
        }
      </div>

      ${
        !vault.isDemo
          ? `
        <div style="padding-top:14px;border-top:1px solid var(--border-soft);">
          <div class="h3">🔑 3-Word Sakhi Key &amp; Backup</div>
          <p class="body-xs" style="margin-top:2px;margin-bottom:10px;">
            ${vault.isGuest ? 'Currently saved locally without a login key. Assign 3 easy words anytime:' : `Active 3-Word Key: <strong>${escapeHtml(vault.vaultCode)}</strong>`}
          </p>
          <form id="sakhi-login-form" class="stack" style="gap:8px;">
            <div style="display:flex;gap:6px;">
              <input type="text" id="sakhi-three-words" class="input" placeholder="e.g. tulsi-pearl-sunrise" value="${vault.isGuest ? '' : escapeHtml(vault.vaultCode)}" />
              <button type="button" class="btn btn-secondary btn-sm" data-action="roll-three-words" style="flex-shrink:0;">🎲 3 Words</button>
            </div>
            <input type="text" id="sakhi-contact-alias" class="input" placeholder="Optional phone or email lookup" value="${escapeHtml(vault.contactAlias || '')}" />
            <button type="submit" class="btn btn-primary btn-sm">Save / Switch 3-Word Key</button>
          </form>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
            <button type="button" class="btn btn-outline btn-sm" data-action="export-vault-json">⬇️ Download Backup</button>
            <label class="btn btn-outline btn-sm" style="cursor:pointer;">
              ⬆️ Restore File
              <input type="file" id="import-vault-input" accept="application/json" hidden />
            </label>
          </div>
        </div>
      `
          : ''
      }

      <div style="padding-top:8px;border-top:1px dashed var(--border-soft);display:flex;justify-content:space-between;align-items:center;">
        <span class="body-xs">Return to home awareness story?</span>
        <button type="button" class="btn btn-outline btn-sm" data-action="go-landing">← Home Page</button>
      </div>
    </div>
  `;
}

export function renderSignInSheet(savedVaults) {
  return `
    <div class="stack" style="gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="eyebrow">Welcome Back</div>
          <h2 class="h2">Open Saved Plan</h2>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-xs">Enter your 3-Word Sakhi Key or linked phone/email on this device, or restore from a backup file:</p>

      <form id="signin-existing-form" class="stack" style="gap:10px;">
        <div class="field-group">
          <label class="field-label" for="signin-code">3-Word Sakhi Key</label>
          <input type="text" id="signin-code" class="input" placeholder="e.g. tulsi-pearl-sunrise" />
        </div>
        <div class="field-group">
          <label class="field-label" for="signin-alias">Or Linked Phone / Email</label>
          <input type="text" id="signin-alias" class="input" placeholder="e.g. +91 98765 43210" />
        </div>
        <button type="submit" class="btn btn-primary btn-block">Open My Health Dashboard →</button>
      </form>

      ${
        savedVaults.length
          ? `
        <div style="padding-top:10px;border-top:1px dashed var(--border-soft);">
          <div class="body-xs" style="font-weight:700;margin-bottom:6px;">Saved Plans Found on This Device:</div>
          <div class="chip-grid">
            ${savedVaults
              .map(
                (sv) => `
                <button type="button" class="SelectableChip" data-action="quick-open-saved" data-code="${escapeHtml(sv.vaultCode)}">
                  ${sv.isGuest ? '📋 ' + escapeHtml(sv.names) : '🔑 ' + escapeHtml(sv.vaultCode)}
                </button>
              `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <div style="padding-top:10px;border-top:1px solid var(--border-soft);">
        <label class="btn btn-outline btn-block btn-sm" style="cursor:pointer;">
          ⬆️ Restore from Backup File (.json)
          <input type="file" id="import-vault-input" accept="application/json" hidden />
        </label>
      </div>
    </div>
  `;
}

export function renderProfileEditorSheet(profile, isNew = false) {
  const selectedConds = new Set(profile.conditions || []);
  return `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 class="h2">${isNew ? 'Add Family Member' : 'Edit Profile & History'}</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>

      <form id="profile-editor-form" class="stack" style="gap:12px;" data-profile-id="${escapeHtml(profile.id)}" data-is-new="${isNew ? '1' : '0'}">
        <div class="grid-2 grid-2-responsive">
          <div class="field-group">
            <label class="field-label" for="prof-name">Name / Nickname</label>
            <input type="text" id="prof-name" class="input" required value="${escapeHtml(profile.name)}" placeholder="e.g. Maa, Priya" />
          </div>
          <div class="field-group">
            <label class="field-label" for="prof-relation">Relation</label>
            <select id="prof-relation" class="select">
              ${['Self', 'Mother', 'Mother-in-Law', 'Sister', 'Daughter (Teen)', 'Aunt / Grandmother', 'Sister / Family']
                .map(
                  (r) => `<option value="${escapeHtml(r)}" ${profile.relation === r ? 'selected' : ''}>${escapeHtml(r)}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>

        <div class="grid-2 grid-2-responsive">
          <div class="field-group">
            <label class="field-label" for="prof-age">Age (Years)</label>
            <input type="number" id="prof-age" class="input" min="11" max="105" required value="${escapeHtml(profile.age)}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="prof-phase">Phase of Life</label>
            <select id="prof-phase" class="select">
              ${LIFE_PHASES.map(
                (lp) =>
                  `<option value="${lp.id}" ${profile.phase === lp.id ? 'selected' : ''}>${lp.icon} ${escapeHtml(lp.label)} (${escapeHtml(lp.ageHint)})</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="grid-2 grid-2-responsive">
          <div class="field-group">
            <label class="field-label" for="prof-height">Height in cm (Optional)</label>
            <input type="number" id="prof-height" class="input" min="110" max="210" value="${escapeHtml(profile.heightCm || '')}" placeholder="158" />
          </div>
          <div class="field-group">
            <label class="field-label" for="prof-weight">Weight in kg (Optional)</label>
            <input type="number" id="prof-weight" class="input" min="25" max="180" value="${escapeHtml(profile.weightKg || '')}" placeholder="60" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Pre-Existing Conditions (Optional)</label>
          <div class="chip-grid" id="prof-conditions-chips">
            ${CONDITIONS_CATALOG.map(
              (c) => `
                <button type="button" class="SelectableChip ${selectedConds.has(c.id) ? 'selected' : ''}" data-action="toggle-form-cond" data-cond-id="${c.id}">
                  ${escapeHtml(c.label)}
                </button>
              `
            ).join('')}
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:6px;">
          <button type="submit" class="btn btn-primary" style="flex:1;">Save Changes</button>
          ${
            !isNew
              ? `<button type="button" class="btn btn-outline" style="color:var(--red-700);" data-action="delete-profile" data-profile-id="${escapeHtml(profile.id)}">Delete</button>`
              : ''
          }
        </div>
      </form>
    </div>
  `;
}
