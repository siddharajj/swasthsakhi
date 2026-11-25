// SwasthSakhi — User Journey Controller
// Stage 1: Data & Story Hook Landing Page -> Stage 2: Guided 3-Step Profile Wizard (or Demo Mode) -> Stage 3: Clean Health Care Dashboard
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
  loadUserVaultOrNull,
  createDemoSessionVault,
  saveVault,
  loadUIPrefs,
  saveUIPrefs,
  generateThreeWordKey,
  suggestPhaseForAge,
  createPersonalVaultFromOnboarding,
  signInExistingVault,
  upgradeVaultWithSakhiKey,
  clearActiveSessionToLanding,
  listSavedVaultSummaries
} from './vault.js';
import {
  renderLandingPageView,
  renderOnboardingWizardView
} from './viewsLandingOnboarding.js';
import {
  escapeHtml,
  renderCareDashboardView,
  renderChecklistTimelineView,
  renderAccountAndProfilesSheet,
  renderSignInSheet,
  renderProfileEditorSheet
} from './viewsPlan.js';
import {
  renderLabAnalyzerView,
  renderStatsAwarenessView
} from './viewsAnalyzerStats.js';

const existingUserVault = loadUserVaultOrNull();

const state = {
  // New visitors ALWAYS start on 'landing' (the Data & Story Hook page!)
  mode: existingUserVault ? 'dashboard' : 'landing', // 'landing' | 'onboarding' | 'dashboard'
  vault: existingUserVault || null,
  prefs: loadUIPrefs(),
  activeTab: 'plan', // 'plan' (Dashboard) | 'checklist' (Timeline) | 'analyzer' (Lab Check) | 'stats' (Awareness Data)
  dashBatchTab: 'morning_fasting_home',
  openRedFlagIdx: 0,
  checklistFilter: 'all',
  checklistMode: 'timeline',
  hideBioInputs: false,
  loadedReportId: null,
  draftLabValues: null,
  wizard: {
    step: 1,
    relation: 'Self',
    name: '',
    age: 34,
    phase: 'pre_menopausal',
    conditions: [],
    heightCm: '',
    weightKg: '',
    threeWordCode: ''
  }
};

function getActiveProfile() {
  if (!state.vault || !state.vault.profiles || !state.vault.profiles.length) return null;
  return (
    state.vault.profiles.find((p) => p.id === state.vault.activeProfileId) ||
    state.vault.profiles[0]
  );
}

function getWorkspaceTabs(lang, pendingCount) {
  return [
    {
      id: 'plan',
      label: lang === 'en' ? 'Dashboard' : tUI(lang, 'navPlan'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`
    },
    {
      id: 'checklist',
      label: lang === 'en' ? 'Schedule' : tUI(lang, 'navChecklist'),
      badge: pendingCount > 0 ? pendingCount : null,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="m9 14 2 2 4-4"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>`
    },
    {
      id: 'analyzer',
      label: lang === 'en' ? 'Lab Analyser' : tUI(lang, 'navAnalyzer'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>`
    },
    {
      id: 'stats',
      label: lang === 'en' ? 'Data & Gap' : tUI(lang, 'navStats'),
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8" rx="1"/><rect x="12" y="6" width="3" height="12" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/></svg>`
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

function renderChrome() {
  const demoSlot = document.getElementById('demo-banner-slot');
  const header = document.getElementById('app-header');
  const safety = document.getElementById('safety-strip');
  const bottomNav = document.getElementById('bottom-nav');

  const lang = state.prefs.lang || 'en';
  const langObj = INDIAN_LANGUAGES.find((l) => l.code === lang) || INDIAN_LANGUAGES[0];

  // Demo Banner (Shown ONLY in Demo Mode!)
  if (state.mode === 'dashboard' && state.vault && state.vault.isDemo) {
    const profile = getActiveProfile();
    demoSlot.hidden = false;
    demoSlot.innerHTML = `
      <div class="demo-banner-wrap">
        <div class="container demo-banner-inner">
          <div class="demo-switch-group">
            <span>✨ <strong>Demo Preview:</strong></span>
            ${state.vault.profiles
              .map(
                (p) => `
                <button type="button" class="demo-person-chip ${p.id === profile.id ? 'active' : ''}" data-action="select-profile" data-profile-id="${p.id}">
                  ${escapeHtml(p.name)} (${p.age})
                </button>
              `
              )
              .join('')}
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button type="button" class="demo-person-chip active" data-action="start-onboarding">
              Build Your Own Plan →
            </button>
            <button type="button" class="demo-person-chip" data-action="go-landing">
              Exit Demo
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    demoSlot.hidden = true;
    demoSlot.innerHTML = '';
  }

  // Header adapts cleanly between Landing/Onboarding vs Active Dashboard
  if (state.mode !== 'dashboard' || !state.vault) {
    const savedCount = listSavedVaultSummaries().length;
    header.innerHTML = `
      <div class="container header-row">
        <button type="button" class="brand-btn" data-action="go-landing">
          <div class="brand-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3c-3 4-7 6.5-7 11a7 7 0 0 0 14 0c0-4.5-4-7-7-11z"/></svg>
          </div>
          <div>
            <span class="brand-title">SwasthSakhi</span>
            <span class="brand-tag">${escapeHtml(tUI(lang, 'appTagline'))}</span>
          </div>
        </button>

        <div class="header-actions">
          <button type="button" class="header-pill ${state.prefs.largeText ? 'active-toggle' : ''}" data-action="toggle-large-text" title="Larger text">
            A+
          </button>
          <button type="button" class="header-pill" data-action="open-lang-sheet">
            🌐 ${escapeHtml(langObj.native)}
          </button>
          <button type="button" class="header-pill" data-action="open-signin-sheet">
            🔑 ${savedCount > 0 ? 'My Saved Plan' : 'Sign In'}
          </button>
          ${
            state.mode === 'landing'
              ? `<button type="button" class="btn btn-primary btn-sm" data-action="start-onboarding">Build Plan →</button>`
              : ''
          }
        </div>
      </div>
    `;
    bottomNav.hidden = true;
    bottomNav.innerHTML = '';
  } else {
    const profile = getActiveProfile();
    const plan = buildPersonalizedPlan(profile);
    const pendingCount = plan.tests.filter(
      (t) => !(profile.completedTests && profile.completedTests[t.id])
    ).length;
    const phaseObj = LIFE_PHASES.find((lp) => lp.id === profile.phase) || LIFE_PHASES[1];
    const tabs = getWorkspaceTabs(lang, pendingCount);

    header.innerHTML = `
      <div class="container header-row">
        <button type="button" class="brand-btn" data-action="go-landing" title="Back to Home Story">
          <div class="brand-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3c-3 4-7 6.5-7 11a7 7 0 0 0 14 0c0-4.5-4-7-7-11z"/></svg>
          </div>
          <div>
            <span class="brand-title">SwasthSakhi</span>
            <span class="brand-tag">${state.vault.isDemo ? 'Demo Workspace' : 'Personal Health Plan'}</span>
          </div>
        </button>

        <nav class="desktop-nav" aria-label="Workspace Views">
          ${tabs
            .map(
              (it) => `
              <button type="button" class="desktop-nav-btn ${state.activeTab === it.id ? 'active' : ''}" data-action="go-tab" data-tab="${it.id}">
                ${it.svg}
                <span>${escapeHtml(it.label)}</span>
                ${it.badge ? `<span class="nav-count-pill">${it.badge}</span>` : ''}
              </button>
            `
            )
            .join('')}
        </nav>

        <div class="header-actions">
          <button type="button" class="header-pill profile-trigger-pill" data-action="open-account-sheet">
            <span>${phaseObj.icon}</span>
            <span>${escapeHtml(profile.name)}</span>
            <span style="opacity:0.65;">▾</span>
          </button>
          <button type="button" class="header-pill ${state.prefs.largeText ? 'active-toggle' : ''}" data-action="toggle-large-text" title="Larger text">
            A+
          </button>
          <button type="button" class="header-pill" data-action="open-lang-sheet">
            🌐 ${escapeHtml(langObj.native)}
          </button>
        </div>
      </div>
    `;

    bottomNav.hidden = false;
    bottomNav.innerHTML = tabs
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

  safety.innerHTML = `
    <span>🛡️ ${escapeHtml(tUI(lang, 'safetyNotice'))}</span>
    <button type="button" style="background:none;border:none;color:var(--plum-800);font-weight:750;font-size:0.73rem;cursor:pointer;flex-shrink:0;" data-action="open-disclaimer-sheet">Privacy &amp; Disclaimer</button>
  `;
}

function renderViewport() {
  const viewport = document.getElementById('app-viewport');

  if (state.mode === 'landing') {
    viewport.innerHTML = renderLandingPageView();
    return;
  }

  if (state.mode === 'onboarding') {
    viewport.innerHTML = renderOnboardingWizardView(state.wizard);
    return;
  }

  const profile = getActiveProfile();
  if (!profile) {
    state.mode = 'landing';
    viewport.innerHTML = renderLandingPageView();
    return;
  }

  if (state.activeTab === 'plan') {
    viewport.innerHTML = renderCareDashboardView(profile, state);
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
  }
}

function renderAll(scrollTop = false) {
  renderChrome();
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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div>
          <div class="eyebrow">All 22 Scheduled Indian Languages</div>
          <h2 class="h2">Choose Language / अपनी भाषा चुनें</h2>
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
  const isDone = Boolean(profile && profile.completedTests && profile.completedTests[t.id]);
  const tier = ACCESS_TIERS_META[t.accessTier];

  openSheet(`
    <div class="stack" style="gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
        <div>
          <span class="badge ${tier.badgeClass}">${tier.label}</span>
          <h2 class="h2" style="margin-top:6px;">${escapeHtml(t.name)}</h2>
          <div class="body-xs" style="color:var(--plum-700);font-weight:700;margin-top:2px;">${escapeHtml(t.hindiHint)}</div>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>

      <div class="badge-row">
        <span class="badge badge-rose">India Cost: ${escapeHtml(t.inrRange)}</span>
        <span class="badge badge-clinic">${escapeHtml(t.frequency)}</span>
      </div>

      <div style="background:var(--teal-50);border:1px solid #99f6e4;border-radius:14px;padding:14px;">
        <div class="h3" style="color:#134e4a;">📍 Where &amp; How in India</div>
        <p class="body-sm" style="color:#115e59;margin-top:4px;">${escapeHtml(t.whereInIndia)}</p>
      </div>

      <div style="background:var(--bg-canvas);border-radius:14px;padding:14px;">
        <div class="h3">💡 Why It Matters</div>
        <p class="body-sm" style="margin-top:4px;">${escapeHtml(t.whyItMatters)}</p>
        <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border-strong);font-size:0.8rem;color:var(--text-secondary);">
          <strong>⏰ Preparation:</strong> ${escapeHtml(t.prepNote)}
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" data-action="toggle-test-done-sheet" data-test-id="${t.id}">
        ${isDone ? '✓ Marked Completed (Click to Undo)' : '☑️ Mark Check as Completed'}
      </button>
    </div>
  `);
}

function openDoctorPrepSheet() {
  const profile = getActiveProfile();
  if (!profile) return;
  const plan = buildPersonalizedPlan(profile);
  const latestRep = (profile.labReports || [])[0];
  const analysis = latestRep ? analyzeReportValues(latestRep.values, profile.phase) : { doctorQuestions: [] };
  const pending = plan.tests.filter((t) => !(profile.completedTests && profile.completedTests[t.id]));

  const summaryText = [
    `🌸 SwasthSakhi Clinic Visit Summary — ${profile.name} (Age ${profile.age}, ${plan.phase.label})`,
    plan.activeConditions.length
      ? `History: ${plan.activeConditions.map((c) => c.label).join(', ')}`
      : 'History: Routine preventive screening',
    pending.length
      ? `\nUpcoming Screenings (${pending.length}):\n` + pending.slice(0, 6).map((t) => `• ${t.name}`).join('\n')
      : '\nAll scheduled annual screenings marked complete!',
    analysis.doctorQuestions.length
      ? `\nQuestions for Doctor:\n` + analysis.doctorQuestions.map((q) => `• ${q}`).join('\n')
      : ''
  ]
    .filter(Boolean)
    .join('\n');

  openSheet(`
    <div class="stack" style="gap:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="h2">👩‍⚕️ Doctor Visit Summary Sheet</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-xs">Show this summary at your appointment or share it on WhatsApp beforehand:</p>
      <pre style="white-space:pre-wrap;background:var(--bg-canvas);padding:14px;border-radius:12px;border:1px solid var(--border-soft);font-family:inherit;font-size:0.8rem;color:var(--text-main);">${escapeHtml(summaryText)}</pre>
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
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="h2">🛡️ Non-Medical Disclaimer &amp; Privacy</h2>
        <button type="button" class="btn btn-outline btn-sm" data-action="close-sheet">✕</button>
      </div>
      <p class="body-sm">
        <strong>Not Medical Advice:</strong> SwasthSakhi is an educational preventive health organizer and report-literacy companion informed by FOGSI, ICMR, NP-NCD, WHO, and Indian Menopause Society guidelines. It does <strong>not</strong> diagnose conditions, prescribe medicines, or replace a qualified Gynecologist or Physician.
      </p>
      <p class="body-sm">
        <strong>100% On-Device Privacy:</strong> Your profiles and test numbers stay locally in your browser (<code>localStorage</code>) and are never sent to external servers.
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
    // --- Stage Transitions ---
    case 'go-landing': {
      closeSheet();
      clearActiveSessionToLanding();
      state.mode = 'landing';
      renderAll(true);
      break;
    }
    case 'enter-demo-mode': {
      closeSheet();
      state.vault = createDemoSessionVault();
      state.mode = 'dashboard';
      state.activeTab = 'plan';
      state.dashBatchTab = 'morning_fasting_home';
      state.draftLabValues = null;
      renderAll(true);
      showToast('Viewing Live Demo: Maa (56) & Ananya (31)');
      break;
    }
    case 'start-onboarding': {
      closeSheet();
      state.wizard = {
        step: 1,
        relation: 'Self',
        name: '',
        age: 34,
        phase: 'pre_menopausal',
        conditions: [],
        heightCm: '',
        weightKg: '',
        threeWordCode: ''
      };
      state.mode = 'onboarding';
      renderAll(true);
      break;
    }
    case 'open-signin-sheet': {
      openSheet(renderSignInSheet(listSavedVaultSummaries()));
      break;
    }
    case 'open-account-sheet': {
      if (state.vault) {
        openSheet(renderAccountAndProfilesSheet(state.vault, listSavedVaultSummaries()));
      }
      break;
    }

    // --- Onboarding Wizard Controls ---
    case 'wiz-pick-relation': {
      const rel = btn.getAttribute('data-relation') || 'Self';
      const nameEl = document.getElementById('wiz-name');
      const ageEl = document.getElementById('wiz-age');
      if (nameEl) state.wizard.name = nameEl.value;
      if (ageEl && ageEl.value) state.wizard.age = Number(ageEl.value);
      else if (rel === 'Mother') state.wizard.age = 54;
      else if (rel === 'Self') state.wizard.age = 34;
      else state.wizard.age = 22;
      state.wizard.relation = rel;
      renderViewport();
      break;
    }
    case 'wiz-cancel': {
      state.mode = 'landing';
      renderAll(true);
      break;
    }
    case 'wiz-next-1': {
      const nameVal = document.getElementById('wiz-name')?.value.trim() || '';
      const ageVal = Number(document.getElementById('wiz-age')?.value) || 34;
      state.wizard.name = nameVal || (state.wizard.relation === 'Mother' ? 'Maa' : 'My Plan');
      state.wizard.age = Math.max(12, Math.min(105, ageVal));
      state.wizard.phase = suggestPhaseForAge(state.wizard.age, state.wizard.relation);
      state.wizard.step = 2;
      renderAll(true);
      break;
    }
    case 'wiz-pick-phase': {
      state.wizard.phase = btn.getAttribute('data-phase') || 'pre_menopausal';
      renderViewport();
      break;
    }
    case 'wiz-prev': {
      state.wizard.step = Number(btn.getAttribute('data-target')) || 1;
      renderAll(true);
      break;
    }
    case 'wiz-next-2': {
      state.wizard.step = 3;
      renderAll(true);
      break;
    }
    case 'wiz-toggle-cond': {
      const cid = btn.getAttribute('data-cond-id');
      const set = new Set(state.wizard.conditions || []);
      if (set.has(cid)) set.delete(cid);
      else set.add(cid);
      state.wizard.conditions = Array.from(set);
      btn.classList.toggle('selected');
      break;
    }
    case 'wiz-roll-key': {
      const inp = document.getElementById('wiz-sakhi-key');
      const key = generateThreeWordKey();
      state.wizard.threeWordCode = key;
      if (inp) inp.value = key;
      break;
    }

    // --- Dashboard & Workspace Controls ---
    case 'go-tab': {
      state.activeTab = btn.getAttribute('data-tab') || 'plan';
      renderAll(true);
      break;
    }
    case 'set-dash-batch': {
      state.dashBatchTab = btn.getAttribute('data-batch') || 'all';
      renderViewport();
      break;
    }
    case 'toggle-rf-item': {
      const idx = Number(btn.getAttribute('data-rf-idx'));
      state.openRedFlagIdx = state.openRedFlagIdx === idx ? -1 : idx;
      renderViewport();
      break;
    }
    case 'toggle-large-text': {
      state.prefs.largeText = !state.prefs.largeText;
      saveUIPrefs(state.prefs);
      syncFontAndLangAttributes();
      renderChrome();
      showToast(state.prefs.largeText ? 'Larger Text ON' : 'Standard Text Size');
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
      if (state.vault && pid && state.vault.profiles.some((p) => p.id === pid)) {
        state.vault.activeProfileId = pid;
        state.draftLabValues = null;
        state.loadedReportId = null;
        state.dashBatchTab = 'morning_fasting_home';
        saveVault(state.vault);
        closeSheet();
        renderAll(true);
        showToast(`Viewing ${getActiveProfile().name}`);
      }
      break;
    }
    case 'open-test-detail': {
      openTestDetailSheet(btn.getAttribute('data-test-id'));
      break;
    }
    case 'toggle-test-done':
    case 'toggle-test-done-sheet': {
      if (!profile) break;
      const tid = btn.getAttribute('data-test-id');
      if (!tid) break;
      if (!profile.completedTests) profile.completedTests = {};
      if (profile.completedTests[tid]) {
        delete profile.completedTests[tid];
        showToast('Marked as pending');
      } else {
        profile.completedTests[tid] = new Date().toISOString().slice(0, 10);
        showToast('✓ Marked complete!');
      }
      saveVault(state.vault);
      if (action === 'toggle-test-done-sheet') closeSheet();
      renderAll(false);
      break;
    }
    case 'set-checklist-filter': {
      state.checklistFilter = btn.getAttribute('data-filter') || 'all';
      renderViewport();
      break;
    }
    case 'set-checklist-mode': {
      state.checklistMode = btn.getAttribute('data-mode') || 'timeline';
      renderViewport();
      break;
    }
    case 'doctor-prep-sheet': {
      openDoctorPrepSheet();
      break;
    }
    case 'open-edit-profile': {
      if (profile) openSheet(renderProfileEditorSheet(profile, false));
      break;
    }
    case 'edit-specific-profile': {
      const pid = btn.getAttribute('data-profile-id');
      const target = state.vault?.profiles.find((p) => p.id === pid) || profile;
      if (target) openSheet(renderProfileEditorSheet(target, false));
      break;
    }
    case 'add-new-profile': {
      const fresh = {
        id: 'prof_' + Date.now(),
        name: '',
        relation: 'Mother',
        age: 54,
        heightCm: '',
        weightKg: '',
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
      if (!state.vault || state.vault.profiles.length <= 1) {
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
      if (!profile) break;
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
        `Created privately on *SwasthSakhi*.`;
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
      showToast(`✨ Extracted ${count} biomarkers!`);
      break;
    }
    case 'save-lab-report': {
      if (!profile) break;
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
      showToast('💾 Report saved!');
      break;
    }
    case 'load-saved-report': {
      if (!profile) break;
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
      if (!profile) break;
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
    case 'quick-open-saved': {
      const code = btn.getAttribute('data-code');
      const opened = signInExistingVault({ threeWordCode: code });
      if (opened) {
        state.vault = opened;
        state.mode = 'dashboard';
        state.activeTab = 'plan';
        state.draftLabValues = null;
        closeSheet();
        renderAll(true);
        showToast('Opened saved health plan');
      }
      break;
    }
    case 'export-vault-json': {
      if (!state.vault) break;
      const blob = new Blob([JSON.stringify(state.vault, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `swasthsakhi-${state.vault.vaultCode}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded backup file');
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
  if (e.target.id === 'wiz-finish-form') {
    e.preventDefault();
    const heightCm = Number(document.getElementById('wiz-height')?.value) || null;
    const weightKg = Number(document.getElementById('wiz-weight')?.value) || null;
    const threeWordCode = document.getElementById('wiz-sakhi-key')?.value.trim() || '';

    const newProfile = {
      id: 'prof_' + Date.now(),
      name: state.wizard.name || 'My Plan',
      relation: state.wizard.relation || 'Self',
      age: Number(state.wizard.age) || 34,
      phase: state.wizard.phase || 'pre_menopausal',
      heightCm,
      weightKg,
      conditions: state.wizard.conditions || [],
      completedTests: {},
      labReports: []
    };

    state.vault = createPersonalVaultFromOnboarding(newProfile, { threeWordCode });
    state.mode = 'dashboard';
    state.activeTab = 'plan';
    state.dashBatchTab = 'morning_fasting_home';
    state.draftLabValues = null;
    renderAll(true);
    showToast(`✨ Built ${newProfile.name}’s Health Care Dashboard!`);
  } else if (e.target.id === 'signin-existing-form') {
    e.preventDefault();
    const code = document.getElementById('signin-code')?.value || '';
    const alias = document.getElementById('signin-alias')?.value || '';
    const found = signInExistingVault({ threeWordCode: code, contactAlias: alias });
    if (found) {
      state.vault = found;
      state.mode = 'dashboard';
      state.activeTab = 'plan';
      state.draftLabValues = null;
      closeSheet();
      renderAll(true);
      showToast('Welcome back!');
    } else {
      showToast('No matching saved plan on this device — try Restore File or Build Plan');
    }
  } else if (e.target.id === 'profile-editor-form') {
    e.preventDefault();
    if (!state.vault) return;
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
    showToast(`Updated ${updated.name}’s Dashboard`);
  } else if (e.target.id === 'sakhi-login-form') {
    e.preventDefault();
    if (!state.vault) return;
    const words = document.getElementById('sakhi-three-words')?.value || '';
    const alias = document.getElementById('sakhi-contact-alias')?.value || '';
    const { vault, mode } = upgradeVaultWithSakhiKey(state.vault, {
      threeWordCode: words,
      contactAlias: alias
    });
    state.vault = vault;
    state.draftLabValues = null;
    closeSheet();
    renderAll(false);
    showToast(
      mode === 'switched'
        ? `🔑 Switched to ${vault.vaultCode}`
        : `🔑 Saved with 3-Word Key: ${vault.vaultCode}`
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
          imported.isDemo = false;
          saveVault(imported);
          state.vault = imported;
          state.mode = 'dashboard';
          state.activeTab = 'plan';
          state.draftLabValues = null;
          closeSheet();
          renderAll(true);
          showToast('Restored health plan from backup!');
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
