// SwasthSakhi — Responsive Lab Analyzer & India Women's Health Data/Awareness Hub
import { BIOMARKERS_SPEC, analyzeReportValues } from './analyzerEngine.js';
import {
  HERO_STATS,
  SCREENING_GAP_BARS,
  STATE_CERVICAL_CONTRAST,
  SILENT_DEFICIENCIES,
  PMB_SPOTLIGHT,
  INDIA_BREAKTHROUGHS,
  SHAREABLE_CARDS
} from './statsData.js';
import { LIFE_PHASES } from './clinicalData.js';
import { escapeHtml } from './viewsPlan.js';

export function renderLabAnalyzerView(profile, draftValues, uiState) {
  const phaseObj = LIFE_PHASES.find((p) => p.id === profile.phase) || LIFE_PHASES[1];
  const reports = profile.labReports || [];
  const currentValues = draftValues || (reports[0] ? reports[0].values : {});
  const previousReport = reports.length > 1 ? reports[1] : null;

  const analysis = analyzeReportValues(currentValues, profile.phase);

  const inputsHtml = BIOMARKERS_SPEC.map((spec) => {
    const val = currentValues[spec.key] !== undefined ? currentValues[spec.key] : '';
    return `
      <div class="field-group">
        <label class="field-label" for="bio-${spec.key}">
          ${escapeHtml(spec.label)} <span style="color:var(--text-muted);font-weight:500;">(${escapeHtml(spec.unit)})</span>
        </label>
        <input
          type="number"
          step="${spec.step}"
          id="bio-${spec.key}"
          data-bio-key="${spec.key}"
          class="input bio-input"
          placeholder="${escapeHtml(spec.placeholder)}"
          value="${escapeHtml(val)}"
        />
      </div>
    `;
  }).join('');

  const resultCardsHtml = analysis.results.length
    ? `<div class="analyzer-cards-grid">` +
      analysis.results
        .map((r) => {
          const badgeCls =
            r.status === 'within_range'
              ? 'badge-home'
              : r.status === 'attention'
              ? 'badge-rx'
              : 'badge-urgent';

          let deltaHtml = '';
          if (previousReport && previousReport.values && previousReport.values[r.key] !== undefined) {
            const prev = Number(previousReport.values[r.key]);
            const diff = +(r.value - prev).toFixed(2);
            if (diff !== 0) {
              deltaHtml = `<span class="badge badge-clinic">${diff > 0 ? '▲ +' + diff : '▼ ' + diff} vs ${escapeHtml(previousReport.date)}</span>`;
            }
          }

          return `
            <div class="card" style="border-left:4px solid ${
              r.status === 'within_range' ? '#0d9488' : r.status === 'attention' ? '#d97706' : '#dc2626'
            };">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <div>
                  <div class="h3">${escapeHtml(r.label)}</div>
                  <div class="test-local-name">${escapeHtml(r.hindi)}</div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                  <div style="font-size:1.1rem;font-weight:900;color:var(--plum-800);">${r.value} <span style="font-size:0.72rem;font-weight:600;">${escapeHtml(r.unit)}</span></div>
                </div>
              </div>

              <div class="badge-row">
                <span class="badge ${badgeCls}">${escapeHtml(r.badge)}</span>
                ${deltaHtml}
              </div>

              <div class="range-meter" aria-hidden="true">
                <div class="range-pin" style="left:${r.pinPct}%"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.66rem;color:var(--text-muted);">
                <span>Low (${r.scaleMin})</span>
                <span>Context: ${escapeHtml(phaseObj.shortLabel)}</span>
                <span>High (${r.scaleMax})</span>
              </div>

              <p class="body-sm" style="margin-top:8px;">${escapeHtml(r.explain)}</p>
              <div style="margin-top:7px;padding:8px 10px;background:var(--bg-subtle);border-radius:9px;font-size:0.76rem;color:var(--text-secondary);">
                <strong>🥗 Everyday Wellness Context:</strong> ${escapeHtml(r.foodLifestyle)}
              </div>
            </div>
          `;
        })
        .join('') +
      `</div>`
    : `<div class="card" style="text-align:center;padding:30px 18px;">
         <div class="h3">Enter or Paste Any Lab / Ultrasound Value</div>
         <p class="body-xs" style="margin-top:4px;">Supports CBC Hb, Ferritin, TSH, HbA1c, Fasting Sugar/Insulin, Vit D, B12, LDL, TVS Endometrial Thickness (mm), and DEXA T-score.</p>
       </div>`;

  const savedReportsHtml = reports.length
    ? `
      <div class="pill-scroll">
        ${reports
          .map(
            (rep, idx) => `
            <button type="button" class="filter-pill ${idx === 0 && !uiState.loadedReportId ? 'active' : uiState.loadedReportId === rep.id ? 'active' : ''}" data-action="load-saved-report" data-report-id="${rep.id}">
              📄 ${escapeHtml(rep.date)}${rep.note ? ' • ' + escapeHtml(rep.note.length > 26 ? rep.note.slice(0, 25) + '…' : rep.note) : ''}
            </button>
          `
          )
          .join('')}
      </div>
    `
    : '';

  return `
    <div class="layout-analyzer">
      <!-- Left Input Column (Sticky on Desktop) -->
      <aside class="stack sticky-side">
        <div class="card card-hero">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <div>
              <div class="eyebrow">Educational Report Literacy • Non-Medical</div>
              <h1 class="h2">Understand ${escapeHtml(profile.name)}’s Results</h1>
            </div>
            <span class="badge badge-rose">${phaseObj.icon} ${escapeHtml(phaseObj.shortLabel)}</span>
          </div>
          <p class="body-xs" style="margin-top:4px;">
            Translates Indian blood &amp; ultrasound markers using her life stage (${escapeHtml(phaseObj.label)}) and prepares polite questions for her doctor.
          </p>
          ${savedReportsHtml ? `<div style="margin-top:10px;"><div class="body-xs" style="font-weight:700;margin-bottom:4px;">Saved Reports on Device:</div>${savedReportsHtml}</div>` : ''}
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
            <div class="h3">⚡ Quick Paste from Path Lab / SMS</div>
            <span class="badge badge-clinic" title="Planned Phase 2 Feature">📷 AI Scan • Soon</span>
          </div>
          <textarea
            id="paste-lab-textarea"
            class="textarea"
            rows="3"
            placeholder="Paste text from Dr. Lal PathLabs / Tata 1mg / Thyrocare report… e.g. Hemoglobin: 10.8, Ferritin: 13, TSH: 5.4, Vitamin D: 15, Endometrial Thickness: 6.2 mm"
          ></textarea>
          <div style="display:flex;gap:6px;margin-top:8px;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="parse-pasted-report" style="flex:1;">
              ✨ Auto-Fill Values
            </button>
            <button type="button" class="btn btn-outline btn-sm" data-action="load-sample-paste">
              Try Demo Paste
            </button>
          </div>
        </div>

        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div class="h3">📝 Enter / Edit Values (${analysis.results.length} active)</div>
            <button type="button" class="btn btn-outline btn-sm" data-action="toggle-bio-inputs">
              ${uiState.hideBioInputs ? 'Show Inputs ▼' : 'Collapse ▲'}
            </button>
          </div>
          ${
            uiState.hideBioInputs
              ? `<div class="body-xs">Click "Show Inputs" to edit blood, TVS ultrasound (mm), or DEXA T-score values.</div>`
              : `
            <div class="grid-2 grid-2-responsive">${inputsHtml}</div>
            <div style="display:flex;gap:8px;margin-top:12px;">
              <input type="text" id="report-save-note" class="input" placeholder="Report label (e.g. Oct Lal PathLabs)" style="flex:1;" />
              <button type="button" class="btn btn-primary btn-sm" data-action="save-lab-report" style="flex-shrink:0;">
                💾 Save Report
              </button>
            </div>
          `
          }
        </div>
      </aside>

      <!-- Right Live Analysis Column -->
      <div class="stack">
        ${
          analysis.doctorQuestions.length
            ? `
          <div class="card" style="background:var(--amber-50);border-color:#fcd34d;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:10px;">
              <div>
                <div class="eyebrow" style="color:#92400e;">👩‍⚕️ Doctor Visit Prep Card (${analysis.doctorQuestions.length} Points)</div>
                <div class="h3" style="color:#78350f;">Questions to Ask Your Gynecologist / Physician</div>
              </div>
              <button type="button" class="btn btn-whatsapp btn-sm" data-action="share-doctor-questions">
                📲 Share / Copy Questions
              </button>
            </div>
            <p class="body-xs" style="color:#92400e;margin-top:3px;">
              SwasthSakhi does not diagnose or prescribe. Carry these tailored questions to make your clinic visit count:
            </p>
            <ul style="margin-top:8px;padding-left:18px;display:flex;flex-direction:column;gap:5px;font-size:0.8rem;color:#451a03;">
              ${analysis.doctorQuestions.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        ${
          analysis.homaIr
            ? `
          <div class="card" style="background:var(--indigo-50);border-color:#c7d2fe;">
            <div class="eyebrow" style="color:var(--indigo-700);">Calculated Metabolic Literacy</div>
            <div class="body-sm" style="color:#1e1b4b;margin-top:2px;">${escapeHtml(analysis.homaIr.note)}</div>
          </div>
        `
            : ''
        }

        ${resultCardsHtml}
      </div>
    </div>
  `;
}

export function renderStatsAwarenessView() {
  const svgGapBars = SCREENING_GAP_BARS.map((item, idx) => {
    const y = idx * 60 + 10;
    const barMaxW = 260;
    const actualW = Math.max(4, Math.round((item.screenedPct / 100) * barMaxW));
    const targetX = Math.round((item.targetPct / 100) * barMaxW) + 10;
    return `
      <g transform="translate(0, ${y})">
        <text x="10" y="13" fill="#23181c" font-size="11.5" font-weight="700">${escapeHtml(item.label)}</text>
        <rect x="10" y="20" width="${barMaxW}" height="16" rx="8" fill="#f5e6e8" />
        <rect x="10" y="20" width="${actualW}" height="16" rx="8" fill="#e11d48" />
        <line x1="${targetX}" y1="17" x2="${targetX}" y2="39" stroke="#0f766e" stroke-width="2" stroke-dasharray="3,2" />
        <text x="${actualW + 16}" y="32" fill="#9d174d" font-size="11" font-weight="800">India: ${item.screenedPct}%</text>
        <text x="${targetX - 38}" y="50" fill="#0f766e" font-size="9.5" font-weight="700">Goal ${item.targetPct}%</text>
      </g>
    `;
  }).join('');

  const svgMenopauseShift = `
    <svg viewBox="0 0 360 135" width="100%" role="img" aria-label="Comparison showing average Indian menopause at 46.2 years versus Western 51.4 years">
      <rect x="0" y="0" width="360" height="135" rx="14" fill="#fff1f2" />
      <text x="16" y="24" fill="#831843" font-size="11" font-weight="800">THE 5-YEAR EARLIER PHYSIOLOGICAL SHIFT IN INDIA</text>
      <line x1="20" y1="108" x2="340" y2="108" stroke="#d6b8c0" stroke-width="2" />
      <text x="18" y="124" fill="#5c4950" font-size="10">Age 35</text>
      <text x="100" y="124" fill="#5c4950" font-size="10">Age 40</text>
      <text x="190" y="124" fill="#9d174d" font-size="10.5" font-weight="800">46.2 (India)</text>
      <text x="280" y="124" fill="#475569" font-size="10">51.4 (West)</text>

      <rect x="96" y="42" width="114" height="22" rx="11" fill="#fb7185" opacity="0.24" />
      <circle cx="210" cy="53" r="7.5" fill="#be185d" />
      <text x="18" y="57" fill="#831843" font-size="11" font-weight="800">🇮🇳 India</text>
      <text x="102" y="56.5" fill="#831843" font-size="9.2" font-weight="700">Perimenopause ~40</text>

      <rect x="172" y="74" width="124" height="22" rx="11" fill="#94a3b8" opacity="0.24" />
      <circle cx="296" cy="85" r="7.5" fill="#475569" />
      <text x="18" y="89" fill="#475569" font-size="10.5" font-weight="700">🌍 West</text>
      <text x="178" y="88.5" fill="#334155" font-size="9.2">Western App Defaults</text>
    </svg>
  `;

  const stateRowsHtml = STATE_CERVICAL_CONTRAST.map((st) => {
    const barW = Math.max(3, Math.round((st.pct / 12) * 100));
    return `
      <div style="padding:7px 0;border-top:1px dashed var(--border-soft);">
        <div style="display:flex;justify-content:space-between;font-size:0.79rem;font-weight:${st.highlight ? '800' : '600'};color:${st.highlight ? 'var(--plum-800)' : 'var(--text-main)'};">
          <span>${escapeHtml(st.region)} <span style="font-weight:500;color:var(--text-muted);font-size:0.7rem;">• ${escapeHtml(st.tag)}</span></span>
          <span>${st.pct}%</span>
        </div>
        <div style="height:7px;background:#f3e5e8;border-radius:999px;margin-top:4px;overflow:hidden;">
          <div style="height:100%;width:${barW}%;background:${st.highlight ? '#9d174d' : st.pct < 1 ? '#dc2626' : '#fb7185'};border-radius:999px;"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="stack" style="gap:18px;">
      <!-- Awareness Hero Banner -->
      <div class="card card-plum">
        <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.07em;opacity:0.9;">Evidence &amp; Public Health Awareness Hub</div>
        <h1 style="font-size:1.45rem;font-weight:900;margin-top:3px;">India’s Women’s Health &amp; Cancer Screening Gap</h1>
        <p style="font-size:0.86rem;opacity:0.94;margin-top:6px;max-width:860px;">
          Grounded in India’s National Family Health Survey (NFHS-5), ICMR, FOGSI &amp; Indian Menopause Society research — showing why proactive awareness and life-stage screening across Indian households saves lives.
        </p>
      </div>

      <!-- 4 Key Headline Numbers (4-col on Desktop, 2-col on Mobile/Tablet) -->
      <div class="stat-grid-4">
        ${HERO_STATS.map(
          (s) => `
          <div class="stat-box">
            <div class="stat-number">${escapeHtml(s.value)}</div>
            <div class="stat-caption">${escapeHtml(s.label)}</div>
            <div class="body-xs" style="margin-top:4px;">${escapeHtml(s.sub)}</div>
            <div class="stat-source">Source: ${escapeHtml(s.source)}</div>
          </div>
        `
        ).join('')}
      </div>

      <!-- Row 1: Two SVG Data Charts Side-by-Side on Desktop -->
      <div class="stats-two-col">
        <div class="card">
          <div class="eyebrow">Preventive Cancer &amp; Bone Screening Deficit</div>
          <div class="h3" style="margin-bottom:4px;">Actual Screened Women vs. Public Health Target</div>
          <p class="body-xs" style="margin-bottom:10px;">Over 98 out of 100 Indian women aged 30–49 have never had a routine cervical or clinical breast screening check.</p>
          <svg viewBox="0 0 340 250" width="100%" role="img" aria-label="Bar chart of India women screening percentages versus targets">
            ${svgGapBars}
          </svg>
        </div>

        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div class="eyebrow">Why Generic Western Apps Miss the Mark</div>
            <div class="h3" style="margin-bottom:6px;">Earlier Menopause &amp; Bone Loss Timeline in India</div>
            <p class="body-xs" style="margin-bottom:12px;">
              Indian women reach menopause at ~46.2 years on average — 5 years earlier than Western 51–52 yr defaults — causing osteoporotic fractures 10–20 years sooner.
            </p>
            ${svgMenopauseShift}
          </div>
          <div style="margin-top:12px;padding:10px 12px;background:var(--bg-subtle);border-radius:11px;font-size:0.78rem;color:var(--text-secondary);">
            <strong>Key Takeaway:</strong> Baseline DEXA bone density, lipid profile, and HbA1c checks must start in the <strong>mid-40s</strong> in India rather than waiting until 60–65.
          </div>
        </div>
      </div>

      <!-- Row 2: Post-Menopausal Bleeding Spotlight + Normalized Deficiencies Side-by-Side -->
      <div class="stats-two-col">
        <div class="card" style="background:#fff1f2;border-color:#fda4af;">
          <div class="eyebrow" style="color:#9f1239;">Real-Life Awareness Spotlight</div>
          <h2 class="h3" style="color:#881337;margin-top:2px;">${escapeHtml(PMB_SPOTLIGHT.title)}</h2>
          <p class="body-sm" style="color:#4c0519;margin-top:6px;">${escapeHtml(PMB_SPOTLIGHT.storyContext)}</p>
          <div class="stat-grid" style="margin-top:12px;">
            ${PMB_SPOTLIGHT.stats
              .map(
                (st) => `
                <div style="background:#fff;border-radius:12px;padding:11px;border:1px solid #fecdd3;">
                  <div style="font-size:1.12rem;font-weight:900;color:#9f1239;">${escapeHtml(st.figure)}</div>
                  <div style="font-size:0.73rem;color:#5c4950;margin-top:2px;">${escapeHtml(st.caption)}</div>
                </div>
              `
              )
              .join('')}
          </div>
          <div style="margin-top:12px;padding:10px 12px;background:#fff;border-radius:11px;font-size:0.78rem;color:#881337;font-weight:600;">
            💡 ${escapeHtml(PMB_SPOTLIGHT.takeaway)}
          </div>
        </div>

        <div class="card">
          <div class="eyebrow">Normalized Everyday Fatigue</div>
          <div class="h3" style="margin-bottom:8px;">Hidden Deficiencies &amp; Endocrine Burden Across India</div>
          <div class="stack" style="gap:11px;">
            ${SILENT_DEFICIENCIES.map(
              (d) => `
              <div>
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:800;">
                  <span>${escapeHtml(d.name)}</span>
                  <span style="color:var(--plum-700);">${escapeHtml(d.display)}</span>
                </div>
                <div class="progress-track" style="height:7px;margin-top:4px;">
                  <div class="progress-fill" style="width:${d.rangePct}%"></div>
                </div>
                <div class="body-xs" style="margin-top:3px;">${escapeHtml(d.impact)}</div>
              </div>
            `
            ).join('')}
          </div>
        </div>
      </div>

      <!-- Row 3: State Disparities + India's 3 Breakthroughs Side-by-Side -->
      <div class="stats-two-col">
        <div class="card">
          <div class="eyebrow">Regional Disparity (NFHS-5 Women 30–49)</div>
          <div class="h3" style="margin-bottom:4px;">Cervical Screening Across Indian States</div>
          <p class="body-xs" style="margin-bottom:8px;">Even in higher-literacy states, ~90% of women remain unscreened — showing this is both an urban and rural awareness gap.</p>
          ${stateRowsHtml}
        </div>

        <div class="card" style="background:var(--teal-50);border-color:#99f6e4;">
          <div class="eyebrow" style="color:var(--teal-700);">How India Is Closing the Gap</div>
          <div class="h3" style="color:#134e4a;margin-bottom:10px;">3 Practical Solutions Available Right Now</div>
          <div class="stack" style="gap:10px;">
            ${INDIA_BREAKTHROUGHS.map(
              (b) => `
              <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #ccfbf1;">
                <span class="badge badge-home">${escapeHtml(b.badge)}</span>
                <div class="h3" style="margin-top:5px;">${escapeHtml(b.title)}</div>
                <p class="body-xs" style="margin-top:3px;">${escapeHtml(b.body)}</p>
              </div>
            `
            ).join('')}
          </div>
        </div>
      </div>

      <!-- 3-Column Shareable Family WhatsApp Awareness Cards -->
      <div class="card">
        <div class="eyebrow">Spread Awareness in Your Family &amp; Community</div>
        <div class="h3" style="margin-bottom:4px;">1-Tap Shareable Fact Cards (WhatsApp / Copy)</div>
        <p class="body-xs" style="margin-bottom:12px;">Start a stigma-free health conversation with your Mom, Sisters, Aunts, or Friends:</p>
        <div class="share-cards-grid">
          ${SHAREABLE_CARDS.map(
            (sc) => `
            <div style="padding:14px;border:1px solid var(--border-soft);border-radius:14px;background:var(--bg-subtle);display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
              <div>
                <div class="body-xs" style="color:var(--plum-700);font-weight:800;">${escapeHtml(sc.audience)}</div>
                <div class="h3" style="margin-top:3px;">${escapeHtml(sc.title)}</div>
              </div>
              <div style="display:flex;gap:6px;">
                <button type="button" class="btn btn-whatsapp btn-sm" data-action="share-awareness-card" data-card-id="${sc.id}" style="flex:1;">
                  📲 WhatsApp
                </button>
                <button type="button" class="btn btn-outline btn-sm" data-action="copy-awareness-card" data-card-id="${sc.id}">
                  📋 Copy
                </button>
              </div>
            </div>
          `
          ).join('')}
        </div>
      </div>
    </div>
  `;
}
