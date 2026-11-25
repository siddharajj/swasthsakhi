// SwasthSakhi — Responsive Care Plan, Yearly Checklist/Timeline & Family Circle Views
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

export function renderCarePlanView(profile, uiState) {
  const plan = buildPersonalizedPlan(profile);
  const doneCount = plan.tests.filter((t) => profile.completedTests && profile.completedTests[t.id]).length;
  const pct = plan.tests.length ? Math.round((doneCount / plan.tests.length) * 100) : 0;

  const phasePillsHtml = LIFE_PHASES.map(
    (p) => `
      <button type="button" class="filter-pill ${p.id === profile.phase ? 'active' : ''}" data-action="quick-phase" data-phase="${p.id}">
        ${p.icon} ${escapeHtml(p.shortLabel)}
      </button>
    `
  ).join('');

  const redFlagsHtml = plan.redFlags
    .map(
      (rf) => `
      <div style="padding:10px 12px;background:#fff;border-radius:11px;border:1px solid #fecaca;margin-top:8px;">
        <div style="font-size:0.82rem;font-weight:800;color:#991b1b;">⚠️ ${escapeHtml(rf.symptom)}</div>
        <div style="font-size:0.76rem;color:#5c4950;margin-top:3px;">${escapeHtml(rf.why)}</div>
        <div style="font-size:0.76rem;font-weight:700;color:#0f766e;margin-top:4px;">👉 Next Step: ${escapeHtml(rf.action)}</div>
      </div>
    `
    )
    .join('');

  const renderBatchCard = (batchKey) => {
    const items = plan.batches[batchKey] || [];
    if (!items.length) return '';
    const meta = BATCH_GROUPS_META[batchKey];
    const rows = items
      .map((t) => {
        const tier = ACCESS_TIERS_META[t.accessTier];
        const isDone = Boolean(profile.completedTests && profile.completedTests[t.id]);
        return `
          <div style="padding:11px 0;border-top:1px dashed var(--border-soft);display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="min-width:0;">
              <div style="font-size:0.86rem;font-weight:700;color:${isDone ? 'var(--text-muted)' : 'var(--text-main)'};${isDone ? 'text-decoration:line-through;' : ''}">
                ${isDone ? '✅ ' : ''}${escapeHtml(t.name)}
              </div>
              <div class="test-local-name">${escapeHtml(t.hindiHint)}</div>
              <div class="badge-row">
                <span class="badge ${tier.badgeClass}">${tier.shortBadge}</span>
                <span class="badge badge-rose">${escapeHtml(t.inrRange)}</span>
                <span class="body-xs" style="align-self:center;">• ${escapeHtml(t.frequency)}</span>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" data-action="open-test-detail" data-test-id="${t.id}" style="flex-shrink:0;">
              Where &amp; How
            </button>
          </div>
        `;
      })
      .join('');

    return `
      <div class="card">
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px;">
          <div style="font-size:1.45rem;line-height:1;">${meta.icon}</div>
          <div>
            <div class="h3">${escapeHtml(meta.title)} (${items.length})</div>
            <div class="body-xs">${escapeHtml(meta.subtitle)}</div>
          </div>
        </div>
        ${rows}
      </div>
    `;
  };

  const conditionNotesHtml = plan.activeConditions.length
    ? `
      <div class="card" style="background:var(--bg-warm);border-color:#fed7aa;">
        <div class="eyebrow" style="color:var(--amber-700);">Personalised Condition Focus</div>
        <div class="h3" style="margin-bottom:6px;">Tailored Monitoring Added for ${escapeHtml(profile.name)}</div>
        ${plan.activeConditions
          .map(
            (c) => `
            <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #fed7aa;">
              <div style="font-size:0.82rem;font-weight:800;color:#9a3412;">• ${escapeHtml(c.label)}</div>
              <div style="font-size:0.76rem;color:#5c4950;margin-top:2px;">${escapeHtml(c.careNote)}</div>
            </div>
          `
          )
          .join('')}
      </div>
    `
    : '';

  return `
    <div class="stack">
      <!-- Top Phase Explorer Bar -->
      <div class="card" style="padding:12px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
          <span class="body-xs" style="font-weight:800;color:var(--text-main);">Explore or Switch Life Stage (Teenage → Senior Years):</span>
          <button type="button" class="btn btn-secondary btn-sm" data-action="open-edit-profile">
            ✎ Edit ${escapeHtml(profile.name)}’s Profile &amp; Conditions
          </button>
        </div>
        <div class="pill-scroll">${phasePillsHtml}</div>
      </div>

      <!-- Responsive 2-Column Desktop / Stacked Mobile Care Plan Workspace -->
      <div class="layout-plan">
        <!-- Main Left Column: Hero Summary + Batched India Care Plan -->
        <div class="stack">
          <div class="card card-hero">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
              <div>
                <div class="eyebrow">${plan.phase.icon} ${escapeHtml(plan.phase.label)} • Age ${escapeHtml(profile.age)}</div>
                <h1 class="h2" style="margin-top:2px;">${escapeHtml(profile.name)}’s Personalised Health Care Plan</h1>
              </div>
              <span class="badge badge-rose">${plan.tests.length} Annual Checks</span>
            </div>

            <p class="body-sm" style="margin-top:6px;">${escapeHtml(plan.phase.summary)}</p>

            <div style="margin-top:11px;padding:11px 13px;background:#fff;border-radius:12px;border:1px solid #fecdd3;">
              <div style="font-size:0.74rem;font-weight:800;color:var(--plum-800);">🇮🇳 Why This Phase Needs Special Attention in India:</div>
              <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">${escapeHtml(plan.phase.indiaInsight)}</div>
            </div>

            <div class="badge-row" style="margin-top:10px;">
              ${
                plan.bmi
                  ? `<span class="badge ${plan.bmi >= 23 ? 'badge-rx' : 'badge-home'}">BMI ${plan.bmi} • ${escapeHtml(plan.bmiCategoryIndia)}</span>`
                  : ''
              }
              <span class="badge badge-clinic">Est. Smart Combo Cost: ${escapeHtml(plan.estimatedBundledInr)}/yr</span>
            </div>

            <div style="margin-top:12px;">
              <div style="display:flex;justify-content:space-between;font-size:0.76rem;font-weight:700;">
                <span>Yearly Screening Completion (${doneCount} of ${plan.tests.length} done)</span>
                <span>${pct}%</span>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;">
              <button type="button" class="btn btn-primary btn-sm" data-action="go-tab" data-tab="checklist" style="flex:1;min-width:170px;">
                ✓ Open Yearly Checklist &amp; Timeline
              </button>
              <button type="button" class="btn btn-secondary btn-sm" data-action="go-tab" data-tab="analyzer" style="flex:1;min-width:170px;">
                🧪 Analyse Test Results
              </button>
              <button type="button" class="btn btn-whatsapp btn-sm" data-action="share-care-plan" style="flex:1;min-width:170px;">
                📲 Share Plan on WhatsApp
              </button>
            </div>
          </div>

          ${renderBatchCard('morning_fasting_home')}
          ${renderBatchCard('imaging_clinic_visit')}
          ${renderBatchCard('specialist_obgyn')}
        </div>

        <!-- Right Sidebar Column (Sticky on Desktop): Red Flags + Conditions + India Access Guide -->
        <aside class="stack sticky-side">
          <div class="card card-redflag">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div>
                <div class="eyebrow" style="color:#b91c1c;">Symptom Safety Net</div>
                <div class="h3" style="color:#7f1d1d;">Never-Ignore Signs in ${escapeHtml(plan.phase.shortLabel)}</div>
              </div>
              <button type="button" class="btn btn-outline btn-sm" data-action="toggle-redflags">
                ${uiState.redFlagsCollapsed ? 'Show (' + plan.redFlags.length + ')' : 'Hide'}
              </button>
            </div>
            <p class="body-xs" style="color:#7f1d1d;margin-top:3px;">
              Routine annual blood tests cannot detect every condition (such as post-menopausal endometrial thickening). Act promptly if any of these occur:
            </p>
            ${uiState.redFlagsCollapsed ? '' : redFlagsHtml}
          </div>

          ${conditionNotesHtml}

          <div class="card">
            <div class="eyebrow">India Lab &amp; Clinic Access Guide</div>
            <div class="h3" style="margin-bottom:8px;">Where Tests Can Be Done Without vs. With a GP</div>
            <div class="stack" style="gap:9px;">
              <div class="body-xs"><span class="badge badge-home">🏠 Home / Walk-In Lab</span> Direct booking with NABL path labs (Dr. Lal PathLabs, Metropolis, Thyrocare, Tata 1mg, Apollo, Redcliffe) — <strong>no GP prescription needed</strong>.</div>
              <div class="body-xs"><span class="badge badge-clinic">🏥 Clinic / Imaging</span> Visit a diagnostic imaging center or women’s OPD (Mammogram, DEXA Bone Scan, Pap/HPV DNA, non-pregnancy USG).</div>
              <div class="body-xs"><span class="badge badge-rx">📋 Doctor Rx Mandatory</span> Specialist procedure or legally regulated (e.g., <strong>all Pregnancy Ultrasounds require OB-GYN Rx + Form F + ID under India’s PC-PNDT Act</strong>).</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

export function renderChecklistTimelineView(profile, uiState) {
  const plan = buildPersonalizedPlan(profile);
  const filter = uiState.checklistFilter || 'all';
  const subView = uiState.checklistMode || 'checklist';

  const filteredTests = plan.tests.filter((t) => {
    const isDone = Boolean(profile.completedTests && profile.completedTests[t.id]);
    if (filter === 'pending') return !isDone;
    if (filter === 'home') return t.accessTier === 'direct_home';
    if (filter === 'clinic') return t.accessTier !== 'direct_home';
    return true;
  });

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
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:9px;">
          ${tests
            .map((t) => {
              const doneDate = profile.completedTests && profile.completedTests[t.id];
              const tier = ACCESS_TIERS_META[t.accessTier];
              return `
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding-top:7px;border-top:1px dashed var(--border-soft);">
                  <div>
                    <div style="font-size:0.86rem;font-weight:700;">${doneDate ? '✅ ' : '⭕ '}${escapeHtml(t.name)}</div>
                    <div class="body-xs">${escapeHtml(t.frequency)} • <span class="badge ${tier.badgeClass}" style="padding:1px 6px;">${tier.shortBadge}</span></div>
                  </div>
                  <button type="button" class="btn btn-secondary btn-sm" data-action="toggle-test-done" data-test-id="${t.id}">
                    ${doneDate ? 'Done' : 'Mark Done'}
                  </button>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const checklistCardsHtml = filteredTests.length
    ? `<div class="checklist-grid">` +
      filteredTests
        .map((t) => {
          const doneDate = profile.completedTests && profile.completedTests[t.id];
          const isExpanded = uiState.expandedTestId === t.id;
          const tier = ACCESS_TIERS_META[t.accessTier];
          return `
            <div class="test-item ${doneDate ? 'done' : ''}">
              <div class="test-top">
                <button type="button" class="check-circle" data-action="toggle-test-done" data-test-id="${t.id}" aria-label="Mark ${escapeHtml(t.name)} completed">
                  ${doneDate ? '✓' : ''}
                </button>
                <div style="flex:1;min-width:0;">
                  <div class="test-title">${escapeHtml(t.name)}</div>
                  <div class="test-local-name">${escapeHtml(t.hindiHint)}</div>
                  <div class="badge-row">
                    <span class="badge ${tier.badgeClass}">${tier.shortBadge}</span>
                    <span class="badge badge-rose">${escapeHtml(t.inrRange)}</span>
                    ${doneDate ? `<span class="badge badge-home">Done ${escapeHtml(doneDate)}</span>` : ''}
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px;">
                    <span class="body-xs">🗓 ${escapeHtml(t.frequency)}</span>
                    <button type="button" class="body-xs" style="background:none;border:none;color:var(--plum-700);font-weight:800;cursor:pointer;flex-shrink:0;" data-action="expand-test" data-test-id="${t.id}">
                      ${isExpanded ? 'Hide Lab Info ▲' : 'Where & Prep ▼'}
                    </button>
                  </div>
                  ${
                    isExpanded
                      ? `
                    <div class="details-drawer">
                      <div><strong>📍 Where in India:</strong> ${escapeHtml(t.whereInIndia)}</div>
                      <div><strong>💡 Why it matters:</strong> ${escapeHtml(t.whyItMatters)}</div>
                      <div><strong>⏰ Preparation:</strong> ${escapeHtml(t.prepNote)}</div>
                    </div>
                  `
                      : ''
                  }
                </div>
              </div>
            </div>
          `;
        })
        .join('') +
      `</div>`
    : `<div class="card" style="text-align:center;padding:30px 16px;">
         <div style="font-size:1.8rem;">🎉</div>
         <div class="h3" style="margin-top:4px;">All checks in this filter are complete!</div>
         <div class="body-xs" style="margin-top:4px;">Switch filter to "All Checks" to review completed screenings.</div>
       </div>`;

  return `
    <div class="stack">
      <div class="card card-plum">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
          <div>
            <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.06em;opacity:0.9;">Annual Screening Tracker &amp; Schedule</div>
            <h1 style="font-size:1.25rem;font-weight:800;margin-top:2px;">${escapeHtml(profile.name)} • ${doneCount} of ${plan.tests.length} Completed This Year</h1>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="display:flex;gap:4px;background:rgba(0,0,0,0.2);padding:4px;border-radius:11px;">
              <button type="button" class="btn btn-sm" style="background:${subView === 'checklist' ? '#fff' : 'transparent'};color:${subView === 'checklist' ? 'var(--plum-800)' : '#fff'};" data-action="set-checklist-mode" data-mode="checklist">
                ☑️ Checklist View
              </button>
              <button type="button" class="btn btn-sm" style="background:${subView === 'timeline' ? '#fff' : 'transparent'};color:${subView === 'timeline' ? 'var(--plum-800)' : '#fff'};" data-action="set-checklist-mode" data-mode="timeline">
                📅 12-Month Timeline
              </button>
            </div>
            <button type="button" class="pill-action" data-action="doctor-prep-sheet">
              👩‍⚕️ Doctor Visit Sheet
            </button>
          </div>
        </div>
      </div>

      ${
        subView === 'checklist'
          ? `
        <div class="pill-scroll">
          <button type="button" class="filter-pill ${filter === 'all' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="all">All Checks (${plan.tests.length})</button>
          <button type="button" class="filter-pill ${filter === 'pending' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="pending">Pending (${plan.tests.length - doneCount})</button>
          <button type="button" class="filter-pill ${filter === 'home' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="home">🏠 Direct Home Lab (No GP)</button>
          <button type="button" class="filter-pill ${filter === 'clinic' ? 'active' : ''}" data-action="set-checklist-filter" data-filter="clinic">🏥 Clinic &amp; Imaging Scans</button>
        </div>
        ${checklistCardsHtml}
      `
          : `
        <div class="body-sm">Chronological annual plan grouping checks into minimal morning blood draws and clinic visits:</div>
        <div class="timeline-list">${timelineHtml}</div>
      `
      }
    </div>
  `;
}

export function renderFamilyAndVaultView(vault, savedVaults) {
  const profilesHtml = vault.profiles
    .map((p) => {
      const isCurrent = p.id === vault.activeProfileId;
      const phaseObj = LIFE_PHASES.find((lp) => lp.id === p.phase) || LIFE_PHASES[1];
      const condLabels = (p.conditions || [])
        .map((cid) => CONDITIONS_CATALOG.find((c) => c.id === cid)?.label)
        .filter(Boolean);
      return `
        <div class="card" style="border-color:${isCurrent ? 'var(--plum-700)' : 'var(--border-soft)'};border-width:${isCurrent ? '2px' : '1px'};">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:1.35rem;">${phaseObj.icon}</span>
              <div>
                <div class="h3">${escapeHtml(p.name)} ${isCurrent ? '<span class="badge badge-rose">Active</span>' : ''}</div>
                <div class="body-xs">${escapeHtml(p.relation || 'Family')} • Age ${escapeHtml(p.age)} • ${escapeHtml(phaseObj.shortLabel)}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;">
              ${
                !isCurrent
                  ? `<button type="button" class="btn btn-primary btn-sm" data-action="select-profile" data-profile-id="${p.id}">Select</button>`
                  : ''
              }
              <button type="button" class="btn btn-outline btn-sm" data-action="edit-specific-profile" data-profile-id="${p.id}">Edit</button>
            </div>
          </div>
          ${
            condLabels.length
              ? `<div class="badge-row" style="margin-top:9px;">${condLabels
                  .map((l) => `<span class="badge badge-rx">${escapeHtml(l)}</span>`)
                  .join('')}</div>`
              : `<div class="body-xs" style="margin-top:8px;">No pre-existing conditions tagged • Routine age/phase plan active</div>`
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="layout-family">
      <!-- Left Column: Family Circle Profiles -->
      <div class="stack">
        <div class="card card-hero">
          <div class="section-head">
            <div>
              <div class="eyebrow">Caregiver &amp; Self Circle</div>
              <h1 class="h2">Women’s Health Profiles</h1>
            </div>
            <button type="button" class="btn btn-primary btn-sm" data-action="add-new-profile">
              + Add Family Member
            </button>
          </div>
          <p class="body-sm">
            Manage preventive screenings for yourself, your Mom, Mother-in-Law, Sister, or Teenage Daughter — each with her own life stage, health history, and lab report timeline.
          </p>
        </div>

        ${profilesHtml}
      </div>

      <!-- Right Column: Accessible 3-Word Sakhi Key Login & Backup -->
      <aside class="stack sticky-side">
        <div class="card">
          <div class="eyebrow">Accessible Login • Built for Every Generation</div>
          <div class="h3" style="margin-bottom:4px;">
            ${vault.isGuest ? '🔓 Currently in Login-Free Instant Mode' : '🔐 Protected by Smart 3-Word Sakhi Key'}
          </div>
          <p class="body-xs" style="margin-bottom:12px;">
            Use Login-Free mode anytime, or claim a memorable <strong>3-Word Sakhi Key</strong> (plus optional phone/email) that elders can easily remember or jot in a notebook — no complex passwords needed.
          </p>

          <div class="sakhi-code-box">
            <div class="body-xs" style="color:#92400e;font-weight:700;">
              ${vault.isGuest ? 'Current Session Mode' : 'Your 3-Word Sakhi Key'}
            </div>
            <div class="sakhi-words" style="margin-top:3px;">
              ${vault.isGuest ? 'Login-Free Device Vault' : escapeHtml(vault.vaultCode)}
            </div>
            ${
              vault.contactAlias
                ? `<div class="body-xs" style="margin-top:3px;">Linked Phone/Email: <strong>${escapeHtml(vault.contactAlias)}</strong></div>`
                : ''
            }
            ${
              !vault.isGuest
                ? `<button type="button" class="btn btn-outline btn-sm" style="margin-top:8px;" data-action="copy-sakhi-key">📋 Copy 3 Words</button>`
                : ''
            }
          </div>

          <form id="sakhi-login-form" class="stack" style="gap:10px;margin-top:14px;">
            <div class="field-group">
              <label class="field-label" for="sakhi-three-words">Enter or Generate 3-Word Sakhi Key</label>
              <div style="display:flex;gap:6px;">
                <input type="text" id="sakhi-three-words" class="input" placeholder="e.g. tulsi-pearl-sunrise" value="${vault.isGuest ? '' : escapeHtml(vault.vaultCode)}" />
                <button type="button" class="btn btn-secondary btn-sm" data-action="roll-three-words" style="flex-shrink:0;">🎲 Pick 3 Words</button>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label" for="sakhi-contact-alias">Optional Phone Number or Email (Easy Lookup)</label>
              <input type="text" id="sakhi-contact-alias" class="input" placeholder="e.g. +91 98765 43210 or mom@family.in" value="${escapeHtml(vault.contactAlias || '')}" />
            </div>
            <button type="submit" class="btn btn-primary btn-block">
              ${vault.isGuest ? '✨ Create / Sign In with 3-Word Key' : '🔄 Save / Switch 3-Word Vault'}
            </button>
          </form>

          ${
            savedVaults.length > 1
              ? `
            <div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--border-soft);">
              <div class="body-xs" style="font-weight:700;margin-bottom:6px;">Saved Accounts on This Device:</div>
              <div class="chip-grid">
                ${savedVaults
                  .map(
                    (sv) => `
                    <button type="button" class="SelectableChip ${sv.vaultCode === vault.vaultCode ? 'selected' : ''}" data-action="quick-switch-vault" data-code="${escapeHtml(sv.vaultCode)}">
                      ${sv.isGuest ? '🔓 Login-Free' : '🔑 ' + escapeHtml(sv.vaultCode)} (${sv.profileCount})
                    </button>
                  `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border-soft);">
            <button type="button" class="btn btn-outline btn-sm" data-action="export-vault-json">
              ⬇️ Backup File (.json)
            </button>
            <label class="btn btn-outline btn-sm" style="cursor:pointer;">
              ⬆️ Restore File
              <input type="file" id="import-vault-input" accept="application/json" hidden />
            </label>
          </div>
        </div>
      </aside>
    </div>
  `;
}

export function renderProfileEditorSheet(profile, isNew = false) {
  const selectedConds = new Set(profile.conditions || []);
  return `
    <div>
      <div class="sheet-handle"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h2 class="h2">${isNew ? 'Add Woman’s Health Profile' : 'Edit Profile & Health History'}</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>

      <form id="profile-editor-form" class="stack" data-profile-id="${escapeHtml(profile.id)}" data-is-new="${isNew ? '1' : '0'}">
        <div class="grid-2 grid-2-responsive">
          <div class="field-group">
            <label class="field-label" for="prof-name">Name / Nickname</label>
            <input type="text" id="prof-name" class="input" required value="${escapeHtml(profile.name)}" placeholder="e.g. Maa, Priya, Didi" />
          </div>
          <div class="field-group">
            <label class="field-label" for="prof-relation">Relation</label>
            <select id="prof-relation" class="select">
              ${['Self', 'Mother', 'Mother-in-Law', 'Sister', 'Daughter (Teen)', 'Aunt / Grandmother', 'Partner / Wife']
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
            <label class="field-label" for="prof-phase">Current Phase of Life</label>
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
            <label class="field-label" for="prof-height">Height (cm, optional)</label>
            <input type="number" id="prof-height" class="input" min="110" max="210" value="${escapeHtml(profile.heightCm || '')}" placeholder="158" />
          </div>
          <div class="field-group">
            <label class="field-label" for="prof-weight">Weight (kg, optional)</label>
            <input type="number" id="prof-weight" class="input" min="25" max="180" value="${escapeHtml(profile.weightKg || '')}" placeholder="60" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Health History &amp; Women-Specific Conditions (Tap to toggle)</label>
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
          <button type="submit" class="btn btn-primary" style="flex:1;">💾 Save Personalised Plan</button>
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
