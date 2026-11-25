import { LIFE_PHASES, CONDITIONS_CATALOG, TESTS_MASTER, buildPersonalizedPlan } from '../js/clinicalData.js';
import { analyzeReportValues, parseLabReportText } from '../js/analyzerEngine.js';
import { INDIAN_LANGUAGES, tUI } from '../js/i18n.js';
import { generateThreeWordKey, normalizeThreeWordKey, suggestPhaseForAge, createDemoSessionVault } from '../js/vault.js';
import { HERO_STATS, SCREENING_GAP_BARS } from '../js/statsData.js';

let passed = 0;
function assert(cond, msg) {
  if (!cond) {
    throw new Error('ASSERTION FAILED: ' + msg);
  }
  passed++;
}

// 1. Verify all 9 life phases resolve valid tests & red flags
assert(LIFE_PHASES.length === 9, 'Expected 9 life phases from teen to senior');
for (const lp of LIFE_PHASES) {
  assert(lp.redFlags && lp.redFlags.length >= 1, `Phase ${lp.id} must have red flags`);
  for (const tid of lp.baselineTests) {
    assert(Boolean(TESTS_MASTER[tid]), `Missing TESTS_MASTER entry for ${tid} in phase ${lp.id}`);
  }
  const plan = buildPersonalizedPlan({
    name: 'Test',
    age: lp.id === 'teen' ? 16 : lp.id === 'senior' ? 70 : 42,
    phase: lp.id,
    conditions: ['pcos', 'bone_joint'],
    heightCm: 158,
    weightKg: 62
  });
  assert(plan.tests.length >= 4, `Plan for ${lp.id} should include tests`);
  if (lp.id === 'pregnancy') {
    assert(
      !plan.tests.some((t) => t.id === 'dexa_bone' || t.id === 'mammogram_breast'),
      'Pregnancy plan must exclude routine DEXA/mammogram'
    );
  }
}

// 2. Verify Asian-Indian BMI cutoff (23.0 kg/m2)
const bmiPlan = buildPersonalizedPlan({
  name: 'Meera',
  age: 24,
  phase: 'pre_menopausal',
  heightCm: 158,
  weightKg: 59, // BMI ~ 23.6
  conditions: []
});
assert(bmiPlan.bmi === 23.6, 'Expected BMI 23.6');
assert(bmiPlan.bmiCategoryIndia.includes('Overweight'), 'BMI 23.6 should trigger Asian-Indian 23.0 alert');
assert(bmiPlan.tests.some((t) => t.id === 'lipid_profile'), 'BMI >= 23 should add lipid profile');

// 3. Verify Post-Menopausal vs Pre-Menopausal TVS Endometrial Thickness in Lab Analyzer
const postMenoEval = analyzeReportValues({ tvs_et_mm: 5.8, dexa_tscore: -1.9, ferritin: 18 }, 'post_menopause');
const etPost = postMenoEval.results.find((r) => r.key === 'tvs_et_mm');
assert(etPost.status === 'discuss_soon', '5.8 mm endometrial thickness post-menopause must prompt review');
assert(postMenoEval.doctorQuestions.length >= 3, 'Should generate doctor questions for ET, DEXA & Ferritin');

const preMenoEval = analyzeReportValues({ tvs_et_mm: 5.8 }, 'pre_menopausal');
const etPre = preMenoEval.results.find((r) => r.key === 'tvs_et_mm');
assert(etPre.status === 'within_range', '5.8 mm endometrial thickness pre-menopause is within normal cycling range');

// 4. Verify Pregnancy-sensitive TSH & HOMA-IR calculation
const pregEval = analyzeReportValues({ tsh: 3.6, fasting_glucose: 98, fasting_insulin: 14 }, 'pre_pregnancy');
assert(pregEval.results.find((r) => r.key === 'tsh').status === 'attention', 'TSH 3.6 pre-pregnancy should prompt optimization note');
assert(pregEval.homaIr && pregEval.homaIr.score > 3.0, 'HOMA-IR should calculate > 3.0');

// 5. Verify Smart Lab Text Parser
const sampleRaw =
  'Lal PathLabs: Hemoglobin: 10.6 g/dL, Serum Ferritin: 11 ng/mL, TSH 5.2, HbA1c: 6.0%, Fasting Glucose 106, Vitamin D: 13, Vitamin B12 180, LDL: 144, Endometrial Thickness: 6.1 mm, T-Score: -2.6';
const parsed = parseLabReportText(sampleRaw);
assert(parsed.hemoglobin === 10.6, 'Parsed Hb');
assert(parsed.ferritin === 11, 'Parsed Ferritin');
assert(parsed.tsh === 5.2, 'Parsed TSH');
assert(parsed.hba1c === 6.0, 'Parsed HbA1c');
assert(parsed.tvs_et_mm === 6.1, 'Parsed TVS ET mm');
assert(parsed.dexa_tscore === -2.6, 'Parsed DEXA T-score');

// 6. Verify 22 Indian Languages + 3-Word Sakhi Key + Stats Data
assert(INDIAN_LANGUAGES.length >= 22, 'Should list all 22 scheduled Indian languages');
assert(tUI('hi', 'navPlan') === 'हेल्थ प्लान', 'Hindi UI string check');
const key3 = generateThreeWordKey();
assert(key3.split('-').length === 3, '3-word Sakhi key format check');
assert(normalizeThreeWordKey('  Tulsi Pearl  Sunrise ') === 'tulsi-pearl-sunrise', 'Key normalizer check');
assert(HERO_STATS[0].value === '1.9%', 'NFHS-5 cervical stat check');
assert(SCREENING_GAP_BARS.length === 4, 'Screening gap chart dataset check');

print(`ALL ${passed} AUTOMATED TESTS PASSED SUCCESSFULLY!`);
