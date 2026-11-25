// SwasthSakhi — Stage 1 (Data & Story Hook Landing Page) + Stage 2 (Guided 3-Step Profile Wizard)
import { LIFE_PHASES, CONDITIONS_CATALOG } from './clinicalData.js';
import { HERO_STATS, SCREENING_GAP_BARS, PMB_SPOTLIGHT } from './statsData.js';
import { escapeHtml } from './viewsPlan.js';

export function renderLandingPageView() {
  const gapBarsHtml = SCREENING_GAP_BARS.map(
    (item) => `
      <div style="margin-top:12px;">
        <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;margin-bottom:4px;">
          <span>${escapeHtml(item.label)}</span>
          <span style="color:var(--plum-800);">India: ${item.screenedPct}% <span style="color:var(--text-muted);font-weight:500;">(Goal ${item.targetPct}%)</span></span>
        </div>
        <div class="progress-track" style="height:10px;background:#f4e6e9;">
          <div class="progress-fill" style="width:${Math.max(2.5, item.screenedPct)}%"></div>
        </div>
      </div>
    `
  ).join('');

  return `
    <div class="stack" style="gap:28px;">
      <!-- HERO SECTION: Emotional Story Hook + Illustration + Dual Clear CTAs -->
      <section class="landing-hero">
        <div>
          <span class="badge badge-rose">🇮🇳 Bridging India’s Women’s Health Gap</span>
          <h1 class="hero-headline">
            98% of women in India have never had a routine cervical screen.
          </h1>
          <p class="hero-lead">
            Across generations, Indian women look after everyone at home first—while silent anemia, earlier menopause at 46, and warning signs like post-menopausal spotting go unchecked until urgent.
          </p>
          <div class="hero-cta-row">
            <button type="button" class="btn btn-primary btn-lg" data-action="start-onboarding">
              Build Personalised Plan →
            </button>
            <button type="button" class="btn btn-secondary btn-lg" data-action="enter-demo-mode">
              Explore Live Demo (Maa &amp; Ananya)
            </button>
          </div>
          <div class="body-xs" style="margin-top:14px;">
            ✓ Free &amp; login-free &nbsp;•&nbsp; ✓ Teenage (13+) to Senior (65+) &nbsp;•&nbsp; ✓ 100% private on your device
          </div>
        </div>

        <div class="hero-image-card">
          <img src="./assets/hero-women.jpg" alt="Three generations of Indian women smiling together" />
          <div class="hero-image-caption">
            <span>From adolescence &amp; motherhood to post-menopause</span>
            <span class="badge badge-home">FOGSI &amp; ICMR Aligned</span>
          </div>
        </div>
      </section>

      <!-- 4 BIG SCANNABLE NUMBERS -->
      <section>
        <div style="margin-bottom:12px;">
          <div class="eyebrow">The Numbers Behind the Silence</div>
          <h2 class="h2">What India’s National Health Data Shows</h2>
        </div>
        <div class="stat-grid-4">
          ${HERO_STATS.map(
            (s) => `
            <div class="stat-box">
              <div class="stat-number">${escapeHtml(s.value)}</div>
              <div class="stat-caption">${escapeHtml(s.label)}</div>
              <div class="body-xs" style="margin-top:4px;">${escapeHtml(s.sub)}</div>
              <div class="stat-source">${escapeHtml(s.source)}</div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- 2 VISUAL INSIGHT CARDS (Clean & Scannable — Zero Text Walls) -->
      <section class="stats-two-col">
        <div class="card">
          <div class="eyebrow">Preventive Screening Deficit</div>
          <h3 class="h2" style="margin-top:2px;">Actual Screening vs. Safe Targets</h3>
          <p class="body-sm" style="margin-top:4px;">
            Most life-threatening women’s conditions—cervical changes, breast lumps, silent bone loss—are highly treatable when caught before symptoms escalate.
          </p>
          <div style="margin-top:8px;">${gapBarsHtml}</div>
        </div>

        <div class="card card-subtle" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
          <div>
            <div class="eyebrow">Real-Life Family Catalyst</div>
            <h3 class="h2" style="margin-top:2px;">Why Earlier Checks &amp; Red-Flag Awareness Matter</h3>
            <p class="body-sm" style="margin-top:6px;">
              Indian women reach menopause ~5 years earlier (<strong>46.2 yrs</strong>) than Western apps assume—and symptoms like <strong>post-menopausal bleeding</strong> are often brushed off out of hesitation.
            </p>
            <div class="grid-2" style="margin-top:14px;">
              <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #f6d8df;">
                <div style="font-size:1.25rem;font-weight:900;color:var(--teal-700);">75% – 90%</div>
                <div class="body-xs" style="margin-top:2px;">Of post-menopausal bleeding cases turn out <strong>benign</strong> (like simple endometrial thickening)</div>
              </div>
              <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #f6d8df;">
                <div style="font-size:1.25rem;font-weight:900;color:var(--plum-800);">10% – 25%</div>
                <div class="body-xs" style="margin-top:2px;">Require ruling out uterine or cervical malignancy via a quick <strong>TVS Ultrasound</strong></div>
              </div>
            </div>
          </div>
          <div style="font-size:0.8rem;color:var(--plum-900);font-weight:600;background:#fff;padding:10px 13px;border-radius:11px;">
            💡 Knowing <em>which</em> tests you can book directly at an Indian path lab vs. when to see a Gynecologist removes hesitation.
          </div>
        </div>
      </section>

      <!-- 3-STEP HOW IT WORKS -->
      <section class="card">
        <div class="eyebrow">Simple, Calm &amp; Practical</div>
        <h2 class="h2" style="margin-top:2px;margin-bottom:16px;">How SwasthSakhi Builds Her Health Care Plan</h2>
        <div class="how-grid">
          <div style="padding:14px;border-radius:14px;background:var(--bg-canvas);">
            <div class="step-num">1</div>
            <div class="h3">Select Life Stage &amp; History</div>
            <p class="body-xs" style="margin-top:4px;">Tailored for Yourself, your Mom, or Sister—covering Teenage, Pregnancy, Perimenopause, Post-Menopause &amp; Senior years.</p>
          </div>
          <div style="padding:14px;border-radius:14px;background:var(--bg-canvas);">
            <div class="step-num">2</div>
            <div class="h3">Follow a Clean Yearly Dashboard</div>
            <p class="body-xs" style="margin-top:4px;">Batches tests into <strong>1 Morning Home Blood Draw (No GP needed)</strong> + <strong>1 Clinic Visit</strong> with realistic ₹ INR estimates.</p>
          </div>
          <div style="padding:14px;border-radius:14px;background:var(--bg-canvas);">
            <div class="step-num">3</div>
            <div class="h3">Understand Lab &amp; Scan Numbers</div>
            <p class="body-xs" style="margin-top:4px;">Paste values from Lal PathLabs / 1mg / TVS scans to see plain-language context and questions to ask your doctor.</p>
          </div>
        </div>

        <div style="margin-top:20px;padding-top:18px;border-top:1px solid var(--border-soft);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
          <div>
            <div class="h3">Ready to create a plan for yourself or your mother?</div>
            <div class="body-xs">Takes less than 60 seconds • Or explore the pre-built Maa &amp; Ananya demo first.</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn btn-outline" data-action="enter-demo-mode">
              Preview Demo
            </button>
            <button type="button" class="btn btn-primary" data-action="start-onboarding">
              Start Personalised Plan →
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

export function renderOnboardingWizardView(wizard) {
  const step = wizard.step || 1;
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;

  let stepContent = '';

  if (step === 1) {
    const relChoices = [
      { id: 'Self', icon: '🙋‍♀️', title: 'For Myself', sub: 'Personal annual screening & lab tracker' },
      { id: 'Mother', icon: '💐', title: 'For My Mother / MIL', sub: 'Menopause, bone, heart & symptom care' },
      { id: 'Sister / Family', icon: '👭', title: 'Sister / Daughter / Family', sub: 'Teenage, reproductive or antenatal plan' }
    ];

    stepContent = `
      <div class="stack" style="gap:18px;">
        <div>
          <h1 class="h1">Who are we building this health plan for?</h1>
          <p class="body-sm" style="margin-top:4px;">You can always add more family members later from your dashboard.</p>
        </div>

        <div class="relation-grid">
          ${relChoices
            .map(
              (rc) => `
              <button type="button" class="choice-tile ${wizard.relation === rc.id ? 'selected' : ''}" data-action="wiz-pick-relation" data-relation="${escapeHtml(rc.id)}">
                <div style="font-size:1.5rem;">${rc.icon}</div>
                <div class="h3" style="margin-top:6px;">${escapeHtml(rc.title)}</div>
                <div class="body-xs" style="margin-top:2px;">${escapeHtml(rc.sub)}</div>
              </button>
            `
            )
            .join('')}
        </div>

        <div class="grid-2 grid-2-responsive">
          <div class="field-group">
            <label class="field-label" for="wiz-name">Her Name or Nickname</label>
            <input type="text" id="wiz-name" class="input" placeholder="${wizard.relation === 'Mother' ? 'e.g. Maa, Sunita' : 'e.g. Priya, Didi'}" value="${escapeHtml(wizard.name)}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="wiz-age">Current Age (Years)</label>
            <input type="number" id="wiz-age" class="input" min="12" max="105" placeholder="e.g. 54" value="${escapeHtml(wizard.age)}" />
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;">
          <button type="button" class="btn btn-outline" data-action="wiz-cancel">← Back</button>
          <button type="button" class="btn btn-primary" data-action="wiz-next-1">Continue to Life Stage →</button>
        </div>
      </div>
    `;
  } else if (step === 2) {
    stepContent = `
      <div class="stack" style="gap:18px;">
        <div>
          <h1 class="h1">Which phase of life is ${escapeHtml(wizard.name || 'she')} in?</h1>
          <p class="body-sm" style="margin-top:4px;">We highlighted a suggested stage for age ${escapeHtml(wizard.age)} — pick whichever fits best right now.</p>
        </div>

        <div class="phase-grid">
          ${LIFE_PHASES.map(
            (lp) => `
              <button type="button" class="choice-tile ${wizard.phase === lp.id ? 'selected' : ''}" data-action="wiz-pick-phase" data-phase="${lp.id}">
                <div style="font-size:1.35rem;">${lp.icon}</div>
                <div style="font-size:0.86rem;font-weight:800;margin-top:5px;color:var(--text-main);">${escapeHtml(lp.label)}</div>
                <div class="body-xs" style="margin-top:2px;">${escapeHtml(lp.ageHint)}</div>
              </button>
            `
          ).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;">
          <button type="button" class="btn btn-outline" data-action="wiz-prev" data-target="1">← Back</button>
          <button type="button" class="btn btn-primary" data-action="wiz-next-2">Continue to Health History →</button>
        </div>
      </div>
    `;
  } else {
    const selectedSet = new Set(wizard.conditions || []);
    stepContent = `
      <form id="wiz-finish-form" class="stack" style="gap:18px;">
        <div>
          <h1 class="h1">Any specific health history to tailor for?</h1>
          <p class="body-sm" style="margin-top:4px;">Optional — select any that apply, or leave blank for a standard preventive screening plan.</p>
        </div>

        <div class="chip-grid">
          ${CONDITIONS_CATALOG.map(
            (c) => `
              <button type="button" class="SelectableChip ${selectedSet.has(c.id) ? 'selected' : ''}" data-action="wiz-toggle-cond" data-cond-id="${c.id}">
                ${escapeHtml(c.label)}
              </button>
            `
          ).join('')}
        </div>

        <div class="grid-2 grid-2-responsive" style="padding-top:4px;">
          <div class="field-group">
            <label class="field-label" for="wiz-height">Height in cm (Optional, for Asian-Indian BMI)</label>
            <input type="number" id="wiz-height" class="input" min="110" max="210" placeholder="e.g. 158" value="${escapeHtml(wizard.heightCm || '')}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="wiz-weight">Weight in kg (Optional)</label>
            <input type="number" id="wiz-weight" class="input" min="25" max="180" placeholder="e.g. 60" value="${escapeHtml(wizard.weightKg || '')}" />
          </div>
        </div>

        <div style="background:var(--bg-canvas);padding:14px;border-radius:14px;border:1px solid var(--border-soft);">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <div>
              <div style="font-size:0.82rem;font-weight:750;">Optional: Claim a 3-Word Sakhi Key</div>
              <div class="body-xs">Easy 3-word code to remember &amp; lock your plan (or leave blank to stay login-free).</div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-action="wiz-roll-key">🎲 Pick 3 Words</button>
          </div>
          <input type="text" id="wiz-sakhi-key" class="input" style="margin-top:8px;" placeholder="Leave blank for login-free, or e.g. tulsi-pearl-sunrise" value="${escapeHtml(wizard.threeWordCode || '')}" />
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;">
          <button type="button" class="btn btn-outline" data-action="wiz-prev" data-target="2">← Back</button>
          <button type="submit" class="btn btn-primary btn-lg">Generate Health Dashboard →</button>
        </div>
      </form>
    `;
  }

  return `
    <div class="wizard-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span class="eyebrow">Step ${step} of 3 • Personalised Setup</span>
        <span class="body-xs">${pct}%</span>
      </div>
      <div class="progress-track" style="margin-bottom:18px;">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="wizard-card">
        ${stepContent}
      </div>
    </div>
  `;
}
