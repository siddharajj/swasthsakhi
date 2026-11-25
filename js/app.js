// SwasthSakhi — Responsive Desktop, Tablet & Mobile PWA Controller
import {
  LIFE_PHASES,
  TESTS_MASTER,
  ACCESS_TIERS_META,
  buildPersonalizedPlan
} from './clinicalData.js';
import { SHAREABLE_CARDS } from './statsData.js';
import { parseLabReportText, analyzeReportValues } from './analyzerEngine.js';
import { INDIAN_LANGUAGES, tUI, applyLanguagePreference } from './i18n.js';
import {
  loadActiveVault,
  saveVault,
  loadUIPrefs,
  saveUIPrefs,
  generateThreeWordKey,
  registerOrSwitchVault,
  listSavedVaultSummaries
} from './vault.js';
import {
  escapeHtml,
  renderCarePlanView,
  renderChecklistTimelineView,
  renderFamilyAndVaultView,
  renderProfileEditorSheet
} from './viewsPlan.js';
import {
  renderLabAnalyzerView,
  renderStatsAwarenessView
} from './viewsAnalyzerStats.js';

const state = {
  vault: loadActiveVault(),
  prefs: loadUIPrefs(),
  activeTab: 'plan', // 'plan' | 'checklist' | 'analyzer' | 'stats' | 'profiles'
  checklistFilter: 'all',
  checklistMode: 'checklist',
  expandedTestId: null,
  redFlagsCollapsed: false,
  hideBioInputs: false,
  loadedReportId: null,
  draftLabValues: null
};

function getActiveProfile() {
  const found = state.vault.profiles.find((p) => p.id === state.vault.activeProfileId);
  return found || state.vault.profiles[0];
}

function getNavItems(lang, pendingCount) {
  return [
    {
      id: 'plan',
      label: tUI(lang, 'navPlan'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
    },
    {
      id: 'checklist',
      label: tUI(lang, 'navChecklist'),
      badge: pendingCount > 0 ? pendingCount : null,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="m9 14 2 2 4-4"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>`
    },
    {
      id: 'analyzer',
      label: tUI(lang, 'navAnalyzer'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>`
    },
    {
      id: 'stats',
      label: tUI(lang, 'navStats'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8" rx="1"/><rect x="12" y="6" width="3" height="12" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/></svg>`
    },
    {
      id: 'profiles',
      label: tUI(lang, 'navProfiles'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    }
  ];
}

function showToast(msg) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

function openSheet(innerHtml) {
  const backdrop = document.getElementById('sheet-backdrop');
  if (!backdrop) return;
  backdrop.innerHTML = `<div class="bottom-sheet">${innerHtml}</div>`;
  backdrop.hidden = false;
}

function closeSheet() {
  const backdrop = document.getElementById('sheet-backdrop');
  if (!backdrop) return;
  backdrop.hidden = true;
  backdrop.innerHTML = '';
}

function shareOrCopyText(text, toastSuccess = 'Copied to clipboard!') {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {
      window.open(waUrl, '_blank', 'noopener');
    });
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(toastSuccess)).catch(() => {});
  }
  window.open(waUrl, '_blank', 'noopener');
}

function copyPlainText(text, label = 'Copied!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(label));
  } else {
    showToast(label);
  }
}

function syncFontAndLangAttributes() {
  document.documentElement.setAttribute('data-font', state.prefs.largeText ? 'large' : 'normal');
  applyLanguagePreference(state.prefs.lang || 'en');
}

function renderHeaderAndNav() {
  const header = document.getElementById('app-header');
  const safety = document.getElementById('safety-strip');
  const bottomNav = document.getElementById('bottom-nav');

  const profile = getActiveProfile();
  const plan = buildPersonalizedPlan(profile);
  const pendingCount = plan.tests.filter(
    (t) => !(profile.completedTests && profile.completedTests[t.id])
  ).length;

  const lang = state.prefs.lang || 'en';
  const langObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];
  const navItems = getNavItems(lang, pendingCount);

  const desktopNavHtml = navItems
    .map(
      (it) => `
      <button type="button" class="desktop-nav-btn ${state.activeTab === it.id ? 'active' : ''}" data-action="go-tab" data-tab="${it.id}">
        ${it.svg}
        <span>${escapeHtml(it.label)}</span>
        ${it.badge ? `<span class="desktop-nav-badge">${it.badge}</span>` : ''}
      </button>
    `
    )
    .join('');

  const profileChips = state.vault.profiles
    .map((p) => {
      const phaseObj = LIFE_PHASES.find((lp) => lp.id === p.phase) || LIFE_PHASES[1];
      const active = p.id === profile.id;
      return `
        <button type="button" class="profile-chip ${active ? 'active' : ''}" data-action="select-profile" data-profile-id="${p.id}">
          <span>${phaseObj.icon}</span>
          <span>${escapeHtml(p.name)} (${escapeHtml(p.age)})</span>
        </button>
      `;
    })
    .join('');

  header.innerHTML = `
    <div class="container header-inner">
      <div class="header-top-row">
        <div class="brand-cluster">
          <div class="brand-logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3c-3 4-7 6.5-7 11a7 7 0 0 0 14 0c0-4.5-4-7-7-11z"/>
              <path d="M12 8c-1.5 2.2-3.5 3.6-3.5 6a3.5 3.5 0 0 0 7 0c0-2.4-2-3.8-3.5-6z"/>
            </svg>
          </div>
          <div style="min-width:0;">
            <div class="brand-title">SwasthSakhi</div>
            <div class="brand-sub">${escapeHtml(tUI(lang, 'appTagline'))}</div>
          </div>
        </div>

        <nav class="desktop-nav" aria-label="Primary Navigation">
          ${desktopNavHtml}
        </nav>

        <div class="header-actions">
          <button type="button" class="pill-action ${state.prefs.largeText ? 'active-toggle' : ''}" data-action="toggle-large-text" title="Elder-friendly larger text">
            A+
          </button>
          <button type="button" class="pill-action" data-action="open-lang-sheet" title="Translate into 22 Indian languages">
            🌐 ${escapeHtml(langObj.native)}
          </button>
        </div>
      </div>

      <div class="header-sub-row">
        <div class="profile-switcher-bar" role="tablist" aria-label="Switch Family Profile">
          <span class="profile-bar-label">Viewing Plan For:</span>
          ${profileChips}
          <button type="button" class="profile-chip profile-chip-add" data-action="add-new-profile">
            + Add Mom / Family
          </button>
        </div>
      </div>
    </div>
  `;

  safety.innerHTML = `
    <span>🛡️ <strong>Non-Medical Wellness Guide:</strong> ${escapeHtml(tUI(lang, 'safetyNotice'))}</span>
    <button type="button" style="background:none;border:none;color:#9d174d;font-weight:800;font-size:0.74rem;cursor:pointer;flex-shrink:0;" data-action="open-disclaimer-sheet">Privacy &amp; Info</button>
  `;

  bottomNav.innerHTML = navItems
    .map(
      (it) => `
      <button type="button" class="nav-item ${state.activeTab === it.id ? 'active' : ''}" data-action="go-tab" data-tab="${it.id}">
        ${it.badge ? `<span class="nav-badge">${it.badge}</span>` : ''}
        ${it.svg}
        <span>${escapeHtml(it.label)}</span>
      </button>
    `
    )
    .join('');
}

function renderViewport() {
  const viewport = document.getElementById('app-viewport');
  const profile = getActiveProfile();

  if (state.activeTab === 'plan') {
    viewport.innerHTML = renderCarePlanView(profile, state);
  } else if (state.activeTab === 'checklist') {
    viewport.innerHTML = renderChecklistTimelineView(profile, state);
  } else if (state.activeTab === 'analyzer') {
    if (!state.draftLabValues) {
      const firstRep = (profile.labReports || [])[0];
      state.draftLabValues = firstRep ? { ...firstRep.values } : {};
    }
    viewport.innerHTML = renderLabAnalyzerView(profile, state.draftLabValues, state);
  } else if (state.activeTab === 'stats') {
    viewport.innerHTML = renderStatsAwarenessView();
  } else if (state.activeTab === 'profiles') {
    viewport.innerHTML = renderFamilyAndVaultView(state.vault, listSavedVaultSummaries());
  }
}

function renderAll(scrollTop = false) {
  renderHeaderAndNav();
  renderViewport();
  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (state.prefs.lang && state.prefs.lang !== 'en') {
    applyLanguagePreference(state.prefs.lang);
  }
}

function openLanguageSheet() {
  const current = state.prefs.lang || 'en';
  openSheet(`
    <div>
      <div class="sheet-handle"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div>
          <div class="eyebrow">All 22 Scheduled Indian Languages</div>
          <h2 class="h2">Choose Your Language / अपनी भाषा चुनें</h2>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-xs" style="margin-bottom:12px;">
        Translates navigation immediately and translates health plans, test details, and awareness statistics across Indian scripts.
      </p>
      <div class="grid-2 grid-2-responsive" style="gap:8px;">
        ${INDIAN_LANGUAGES.map(
          (l) => `
            <button type="button" class="SelectableChip ${current === l.code ? 'selected' : ''}" style="text-align:left;display:flex;justify-content:space-between;align-items:center;" data-action="choose-lang" data-lang="${l.code}">
              <span style="font-size:0.86rem;font-weight:800;">${escapeHtml(l.native)}</span>
              <span style="font-size:0.7rem;opacity:0.75;">${escapeHtml(l.english)}</span>
            </button>
          `
        ).join('')}
      </div>
    </div>
  `);
}

function openTestDetailSheet(testId) {
  const t = TESTS_MASTER[testId];
  if (!t) return;
  const profile = getActiveProfile();
  const isDone = Boolean(profile.completedTests && profile.completedTests[t.id]);
  const tier = ACCESS_TIERS_META[t.accessTier];

  openSheet(`
    <div class="stack" style="gap:12px;">
      <div class="sheet-handle"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
        <div>
          <span class="badge ${tier.badgeClass}">${tier.label}</span>
          <h2 class="h2" style="margin-top:6px;">${escapeHtml(t.name)}</h2>
          <div class="test-local-name">${escapeHtml(t.hindiHint)}</div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>

      <div class="badge-row">
        <span class="badge badge-rose">Estimated India Cost: ${escapeHtml(t.inrRange)}</span>
        <span class="badge badge-clinic">Cadence: ${escapeHtml(t.frequency)}</span>
      </div>

      <div class="card" style="background:var(--teal-50);border-color:#99f6e4;">
        <div class="h3" style="color:#134e4a;">📍 Where &amp; How to Get It Done in India</div>
        <p class="body-sm" style="color:#115e59;margin-top:4px;">${escapeHtml(t.whereInIndia)}</p>
      </div>

      <div class="card">
        <div class="h3">💡 Why This Check Matters</div>
        <p class="body-sm" style="margin-top:4px;">${escapeHtml(t.whyItMatters)}</p>
        <div style="margin-top:9px;padding-top:9px;border-top:1px dashed var(--border-soft);font-size:0.79rem;color:var(--text-secondary);">
          <strong>⏰ Preparation Tip:</strong> ${escapeHtml(t.prepNote)}
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" data-action="toggle-test-done-sheet" data-test-id="${t.id}">
        ${isDone ? '✓ Completed (Click to Unmark)' : '☑️ Mark Check as Completed'}
      </button>
    </div>
  `);
}

function openDoctorPrepSheet() {
  const profile = getActiveProfile();
  const plan = buildPersonalizedPlan(profile);
  const latestRep = (profile.labReports || [])[0];
  const analysis = latestRep ? analyzeReportValues(latestRep.values, profile.phase) : { doctorQuestions: [] };
  const pending = plan.tests.filter((t) => !(profile.completedTests && profile.completedTests[t.id]));

  const summaryText = [
    `🌸 SwasthSakhi Clinic Visit Summary — ${profile.name} (Age ${profile.age}, ${plan.phase.label})`,
    plan.activeConditions.length
      ? `History: ${plan.activeConditions.map((c) => c.label).join(', ')}`
      : 'History: Routine preventive check',
    pending.length
      ? `\nUpcoming Checks to Review (${pending.length}):\n` + pending.slice(0, 6).map((t) => `• ${t.name}`).join('\n')
      : '\nAll scheduled annual screenings marked complete!',
    analysis.doctorQuestions.length
      ? `\nQuestions for Doctor:\n` + analysis.doctorQuestions.map((q) => `• ${q}`).join('\n')
      : ''
  ]
    .filter(Boolean)
    .join('\n');

  openSheet(`
    <div class="stack" style="gap:12px;">
      <div class="sheet-handle"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="h2">👩‍⚕️ Doctor Visit Summary Sheet</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-xs">Show or print this summary for your Gynecologist / Physician, or share it on WhatsApp before the appointment:</p>
      <pre style="white-space:pre-wrap;background:#fff;padding:14px;border-radius:12px;border:1px solid var(--border-strong);font-family:inherit;font-size:0.8rem;color:var(--text-main);">${escapeHtml(summaryText)}</pre>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn btn-whatsapp" style="flex:1;" id="share-doc-summary-btn">📲 Send on WhatsApp</button>
        <button type="button" class="btn btn-outline" id="copy-doc-summary-btn">📋 Copy</button>
      </div>
    </div>
  `);

  document.getElementById('share-doc-summary-btn')?.addEventListener('click', () => shareOrCopyText(summaryText));
  document.getElementById('copy-doc-summary-btn')?.addEventListener('click', () => copyPlainText(summaryText, 'Doctor summary copied!'));
}

function openDisclaimerSheet() {
  openSheet(`
    <div class="stack" style="gap:12px;">
      <div class="sheet-handle"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="h2">🛡️ Non-Medical Wellness Disclaimer &amp; Privacy</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-sm">
        <strong>1. Not Medical Advice:</strong> SwasthSakhi is an educational preventive health organizer and report-literacy companion informed by public FOGSI, ICMR, NP-NCD, WHO, and Indian Menopause Society awareness guidelines. It does <strong>not</strong> provide medical diagnosis, prescribe medicines/dosages, or replace a qualified Gynecologist or Physician.
      </p>
      <p class="body-sm">
        <strong>2. Urgent Symptoms:</strong> Never delay an in-person doctor visit because of a normal blood test. Symptoms like post-menopausal spotting, breast lumps, severe pregnancy headaches/bleeding, or chest/jaw discomfort always require prompt medical evaluation.
      </p>
      <p class="body-sm">
        <strong>3. 100% On-Device Privacy:</strong> Your family profiles, menstrual/menopause phases, and lab values are stored locally in your browser (<code>localStorage</code>) and never uploaded to any external database.
      </p>
    </div>
  `);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) {
    if (e.target.id === 'sheet-backdrop') closeSheet();
    return;
  }

  const action = btn.getAttribute('data-action');
  const profile = getActiveProfile();

  switch (action) {
    case 'go-tab': {
      state.activeTab = btn.getAttribute('data-tab') || 'plan';
      renderAll(true);
      break;
    }
    case 'toggle-large-text': {
      state.prefs.largeText = !state.prefs.largeText;
      saveUIPrefs(state.prefs);
      syncFontAndLangAttributes();
      renderHeaderAndNav();
      showToast(state.prefs.largeText ? 'Larger Elder-Friendly Text ON' : 'Standard Text Size');
      break;
    }
    case 'open-lang-sheet': {
      openLanguageSheet();
      break;
    }
    case 'choose-lang': {
      const code = btn.getAttribute('data-lang') || 'en';
      state.prefs.lang = code;
      saveUIPrefs(state.prefs);
      closeSheet();
      syncFontAndLangAttributes();
      renderAll(false);
      const langObj = INDIAN_LANGUAGES.find((l) => l.code === code);
      showToast(`Language: ${langObj ? langObj.native : code}`);
      break;
    }
    case 'close-sheet': {
      closeSheet();
      break;
    }
    case 'open-disclaimer-sheet': {
      openDisclaimerSheet();
      break;
    }
    case 'select-profile': {
      const pid = btn.getAttribute('data-profile-id');
      if (pid && state.vault.profiles.some((p) => p.id === pid)) {
        state.vault.activeProfileId = pid;
        state.draftLabValues = null;
        state.loadedReportId = null;
        saveVault(state.vault);
        renderAll(true);
        const switched = getActiveProfile();
        showToast(`Switched to ${switched.name}`);
      }
      break;
    }
    case 'quick-phase': {
      const ph = btn.getAttribute('data-phase');
      if (ph) {
        profile.phase = ph;
        saveVault(state.vault);
        renderAll(false);
      }
      break;
    }
    case 'toggle-redflags': {
      state.redFlagsCollapsed = !state.redFlagsCollapsed;
      renderViewport();
      break;
    }
    case 'open-test-detail': {
      openTestDetailSheet(btn.getAttribute('data-test-id'));
      break;
    }
    case 'toggle-test-done':
    case 'toggle-test-done-sheet': {
      const tid = btn.getAttribute('data-test-id');
      if (!tid) break;
      if (!profile.completedTests) profile.completedTests = {};
      if (profile.completedTests[tid]) {
        delete profile.completedTests[tid];
        showToast('Marked as pending');
      } else {
        profile.completedTests[tid] = new Date().toISOString().slice(0, 10);
        showToast('✓ Marked complete for this year!');
      }
      saveVault(state.vault);
      if (action === 'toggle-test-done-sheet') closeSheet();
      renderAll(false);
      break;
    }
    case 'expand-test': {
      const tid = btn.getAttribute('data-test-id');
      state.expandedTestId = state.expandedTestId === tid ? null : tid;
      renderViewport();
      break;
    }
    case 'set-checklist-filter': {
      state.checklistFilter = btn.getAttribute('data-filter') || 'all';
      renderViewport();
      break;
    }
    case 'set-checklist-mode': {
      state.checklistMode = btn.getAttribute('data-mode') || 'checklist';
      renderViewport();
      break;
    }
    case 'doctor-prep-sheet': {
      openDoctorPrepSheet();
      break;
    }
    case 'open-edit-profile': {
      openSheet(renderProfileEditorSheet(profile, false));
      break;
    }
    case 'edit-specific-profile': {
      const pid = btn.getAttribute('data-profile-id');
      const target = state.vault.profiles.find((p) => p.id === pid) || profile;
      openSheet(renderProfileEditorSheet(target, false));
      break;
    }
    case 'add-new-profile': {
      const fresh = {
        id: 'prof_' + Date.now(),
        name: '',
        relation: 'Mother',
        age: 52,
        heightCm: 156,
        weightKg: 62,
        phase: 'post_menopause',
        conditions: [],
        completedTests: {},
        labReports: []
      };
      openSheet(renderProfileEditorSheet(fresh, true));
      break;
    }
    case 'toggle-form-cond': {
      btn.classList.toggle('selected');
      break;
    }
    case 'delete-profile': {
      const pid = btn.getAttribute('data-profile-id');
      if (state.vault.profiles.length <= 1) {
        showToast('Keep at least one profile active');
        break;
      }
      state.vault.profiles = state.vault.profiles.filter((p) => p.id !== pid);
      state.vault.activeProfileId = state.vault.profiles[0].id;
      state.draftLabValues = null;
      saveVault(state.vault);
      closeSheet();
      renderAll(true);
      showToast('Profile removed');
      break;
    }
    case 'share-care-plan': {
      const plan = buildPersonalizedPlan(profile);
      const homeList = plan.batches.morning_fasting_home.map((t) => `  • ${t.name}`).join('\n');
      const clinicList = [
        ...plan.batches.imaging_clinic_visit,
        ...plan.batches.specialist_obgyn
      ]
        .map((t) => `  • ${t.name}`)
        .join('\n');
      const msg =
        `🌸 *${profile.name}’s Annual Women’s Health Plan (${plan.phase.label})*\n` +
        `Est. Bundled India Cost: ${plan.estimatedBundledInr}\n\n` +
        (homeList ? `🏠 *Morning Home Blood Draw (No GP Needed):*\n${homeList}\n\n` : '') +
        (clinicList ? `🏥 *Clinic & Imaging Checks:*\n${clinicList}\n\n` : '') +
        `Prepared privately on *SwasthSakhi* (Educational guide — consult your Gynecologist).`;
      shareOrCopyText(msg, 'Care plan copied!');
      break;
    }
    case 'toggle-bio-inputs': {
      state.hideBioInputs = !state.hideBioInputs;
      renderViewport();
      break;
    }
    case 'load-sample-paste': {
      const ta = document.getElementById('paste-lab-textarea');
      if (ta) {
        ta.value =
          'Dr Lal PathLabs Summary — Hemoglobin: 10.9 g/dL | Serum Ferritin: 12 ng/mL | TSH: 5.3 uIU/mL | HbA1c: 5.9 % | Fasting Glucose: 104 mg/dL | Vitamin D: 14 ng/mL | Vitamin B12: 182 pg/mL | LDL Cholesterol: 142 mg/dL | TVS USG Endometrial Thickness: 5.8 mm | DEXA T-Score: -1.9';
      }
      break;
    }
    case 'parse-pasted-report': {
      const ta = document.getElementById('paste-lab-textarea');
      const parsed = parseLabReportText(ta ? ta.value : '');
      const count = Object.keys(parsed).length;
      if (!count) {
        showToast('No lab numbers detected — click "Try Demo Paste" to see format');
        break;
      }
      state.draftLabValues = { ...(state.draftLabValues || {}), ...parsed };
      renderViewport();
      showToast(`✨ Extracted ${count} biomarkers into analyser!`);
      break;
    }
    case 'save-lab-report': {
      const cleanVals = {};
      for (const [k, v] of Object.entries(state.draftLabValues || {})) {
        if (v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))) {
          cleanVals[k] = Number(v);
        }
      }
      if (!Object.keys(cleanVals).length) {
        showToast('Enter at least one biomarker value first');
        break;
      }
      const noteInput = document.getElementById('report-save-note');
      const newRep = {
        id: 'rep_' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        note: noteInput && noteInput.value.trim() ? noteInput.value.trim() : 'Saved Health Check',
        values: cleanVals
      };
      if (!profile.labReports) profile.labReports = [];
      profile.labReports.unshift(newRep);
      state.loadedReportId = newRep.id;
      saveVault(state.vault);
      renderViewport();
      showToast('💾 Saved to ' + profile.name + '’s timeline!');
      break;
    }
    case 'load-saved-report': {
      const rid = btn.getAttribute('data-report-id');
      const found = (profile.labReports || []).find((r) => r.id === rid);
      if (found) {
        state.loadedReportId = found.id;
        state.draftLabValues = { ...found.values };
        renderViewport();
        showToast(`Loaded report from ${found.date}`);
      }
      break;
    }
    case 'share-doctor-questions': {
      const analysis = analyzeReportValues(state.draftLabValues || {}, profile.phase);
      const txt =
        `👩‍⚕️ *Questions for Doctor (${profile.name}, Age ${profile.age})*\n\n` +
        analysis.doctorQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
      shareOrCopyText(txt, 'Questions copied!');
      break;
    }
    case 'share-awareness-card': {
      const cid = btn.getAttribute('data-card-id');
      const card = SHAREABLE_CARDS.find((c) => c.id === cid);
      if (card) shareOrCopyText(card.whatsappText, 'Awareness message copied!');
      break;
    }
    case 'copy-awareness-card': {
      const cid = btn.getAttribute('data-card-id');
      const card = SHAREABLE_CARDS.find((c) => c.id === cid);
      if (card) copyPlainText(card.whatsappText, 'Copied awareness message!');
      break;
    }
    case 'roll-three-words': {
      const inp = document.getElementById('sakhi-three-words');
      if (inp) inp.value = generateThreeWordKey();
      break;
    }
    case 'copy-sakhi-key': {
      copyPlainText(state.vault.vaultCode, '3-Word Sakhi Key copied!');
      break;
    }
    case 'quick-switch-vault': {
      const code = btn.getAttribute('data-code');
      const res = registerOrSwitchVault({ threeWordCode: code });
      state.vault = res.vault;
      state.draftLabValues = null;
      renderAll(true);
      showToast(`Switched vault: ${state.vault.isGuest ? 'Login-Free' : state.vault.vaultCode}`);
      break;
    }
    case 'export-vault-json': {
      const blob = new Blob([JSON.stringify(state.vault, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swasthsakhi-${state.vault.vaultCode}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded private backup JSON');
      break;
    }
  }
});

document.addEventListener('input', (e) => {
  if (e.target.classList.contains('bio-input')) {
    const key = e.target.getAttribute('data-bio-key');
    if (!state.draftLabValues) state.draftLabValues = {};
    state.draftLabValues[key] = e.target.value;
    const activeId = e.target.id;
    const valBefore = e.target.value;
    renderViewport();
    const refocused = document.getElementById(activeId);
    if (refocused) {
      refocused.focus();
      refocused.value = valBefore;
    }
  }
});

document.addEventListener('submit', (e) => {
  if (e.target.id === 'profile-editor-form') {
    e.preventDefault();
    const form = e.target;
    const pid = form.getAttribute('data-profile-id');
    const isNew = form.getAttribute('data-is-new') === '1';

    const selectedConds = Array.from(
      form.querySelectorAll('#prof-conditions-chips .SelectableChip.selected')
    ).map((el) => el.getAttribute('data-cond-id'));

    const updated = {
      id: pid,
      name: document.getElementById('prof-name').value.trim() || 'Family Member',
      relation: document.getElementById('prof-relation').value,
      age: Number(document.getElementById('prof-age').value) || 35,
      phase: document.getElementById('prof-phase').value,
      heightCm: Number(document.getElementById('prof-height').value) || null,
      weightKg: Number(document.getElementById('prof-weight').value) || null,
      conditions: selectedConds
    };

    if (isNew) {
      updated.completedTests = {};
      updated.labReports = [];
      state.vault.profiles.push(updated);
    } else {
      const idx = state.vault.profiles.findIndex((p) => p.id === pid);
      if (idx >= 0) {
        state.vault.profiles[idx] = {
          ...state.vault.profiles[idx],
          ...updated
        };
      }
    }

    state.vault.activeProfileId = updated.id;
    state.draftLabValues = null;
    saveVault(state.vault);
    closeSheet();
    state.activeTab = 'plan';
    renderAll(true);
    showToast(`Saved ${updated.name}’s Care Plan!`);
  } else if (e.target.id === 'sakhi-login-form') {
    e.preventDefault();
    const words = document.getElementById('sakhi-three-words')?.value || '';
    const alias = document.getElementById('sakhi-contact-alias')?.value || '';
    const { vault, mode } = registerOrSwitchVault({
      threeWordCode: words,
      contactAlias: alias,
      keepCurrentProfiles: true
    });
    state.vault = vault;
    state.draftLabValues = null;
    renderAll(false);
    showToast(
      mode === 'restored'
        ? `🔑 Signed in to ${vault.vaultCode}`
        : `✨ Created 3-Word Key: ${vault.vaultCode}`
    );
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'import-vault-input' && e.target.files && e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        if (imported && Array.isArray(imported.profiles) && imported.profiles.length) {
          imported.vaultCode = imported.vaultCode || generateThreeWordKey();
          imported.isGuest = false;
          saveVault(imported);
          state.vault = imported;
          state.draftLabValues = null;
          renderAll(true);
          showToast('Restored family profiles from backup!');
        } else {
          showToast('Invalid backup file format');
        }
      } catch (_) {
        showToast('Could not parse backup JSON');
      }
    };
    reader.readAsText(e.target.files[0]);
  }
});

syncFontAndLangAttributes();
renderAll(false);
