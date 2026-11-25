// SwasthSakhi — Non-Medical Educational Lab & Imaging Result Literacy Engine
// Strictly educational wellness literacy: translates numbers into plain language,
// applies life-phase & Asian-Indian reference context, and generates Doctor Visit Questions.
// Does NOT diagnose conditions or prescribe treatments/dosages.

export const BIOMARKERS_SPEC = [
  {
    key: 'hemoglobin',
    label: 'Hemoglobin (Hb)',
    plainMeaning: 'Oxygen-carrying red blood cell protein',
    unit: 'g/dL',
    step: '0.1',
    placeholder: 'e.g. 11.4',
    scaleMin: 7,
    scaleMax: 16.5,
    evaluate(val, phase) {
      const lowCutoff = phase === 'pregnancy' ? 11.0 : 12.0;
      if (val < 9.0) {
        return {
          status: 'discuss_soon',
          badge: 'Markedly Below Reference',
          explain: `At ${val} g/dL, Hemoglobin is well below the ${lowCutoff} g/dL reference for ${phase === 'pregnancy' ? 'pregnancy' : 'adult women'}.`,
          foodLifestyle: 'Pair iron-rich Indian foods (ragi, rajma, kala chana, Til/sesame, greens) with lemon/amla (Vitamin C), and keep tea/coffee 1 hour away from meals.',
          doctorQuestion: `My Hemoglobin is ${val} g/dL — should we check peripheral smear, Ferritin, B12, and investigate any hidden blood loss?`
        };
      }
      if (val < lowCutoff) {
        return {
          status: 'attention',
          badge: 'Below Reference (<' + lowCutoff + ' g/dL)',
          explain: `57% of Indian women fall in this mild-to-moderate low Hemoglobin zone (<${lowCutoff} g/dL), often causing normalized tiredness, breathlessness, or hair fall.`,
          foodLifestyle: 'Combine dietary iron + Vitamin C at lunch/dinner; avoid taking calcium and iron at the exact same meal as they compete for absorption.',
          doctorQuestion: `My Hemoglobin (${val} g/dL) is below ${lowCutoff} g/dL — what is the root cause (iron store depletion, B12, heavy cycles, or thalassemia trait)?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Within Reference Range',
        explain: `${val} g/dL meets the ≥${lowCutoff} g/dL reference benchmark. Tip: check Serum Ferritin too, as iron reserves can dip before Hemoglobin drops.`,
        foodLifestyle: 'Maintain balanced protein, greens, pulses, and Vitamin C intake.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'ferritin',
    label: 'Serum Ferritin (Iron Stores)',
    plainMeaning: 'Stored body iron reserve bank',
    unit: 'ng/mL',
    step: '1',
    placeholder: 'e.g. 18',
    scaleMin: 2,
    scaleMax: 160,
    evaluate(val) {
      if (val < 15) {
        return {
          status: 'discuss_soon',
          badge: 'Depleted Iron Reserves (<15)',
          explain: `Ferritin of ${val} ng/mL indicates near-empty stored iron reserves, even if Hemoglobin still looks borderline normal.`,
          foodLifestyle: 'Prioritize iron + Vitamin C pairing (lemon squeezed over dal/palak) and discuss replenishment with your doctor.',
          doctorQuestion: `My Serum Ferritin is ${val} ng/mL — how should we safely rebuild my iron stores and address why they are dropping?`
        };
      }
      if (val < 30) {
        return {
          status: 'attention',
          badge: 'Low-Normal Reserve (15–29)',
          explain: `Many Indian lab sheets print "13–150 ng/mL" as normal, yet clinical studies note diffuse hair shedding, restless legs, and fatigue often persist when Ferritin sits below 30–40 ng/mL.`,
          foodLifestyle: 'Focus on iron-dense meals (garden cress/halim seeds, roasted chana, curry leaves) away from chai/coffee.',
          doctorQuestion: `Even though ${val} ng/mL is near the lower lab cutoff, could low iron reserves explain fatigue or hair fall for me?`
        };
      }
      if (val > 150) {
        return {
          status: 'attention',
          badge: 'Above Typical Female Range',
          explain: `Ferritin (${val} ng/mL) can rise either from excess iron supplementation or as an acute-phase marker of inflammation/fatty liver.`,
          foodLifestyle: 'Pause any unprescribed iron tonics until reviewed by your physician.',
          doctorQuestion: `My Ferritin is elevated at ${val} ng/mL — does this reflect inflammation/metabolic changes or iron overload?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Healthy Iron Reserve (30–150)',
        explain: `${val} ng/mL reflects well-cushioned iron reserves.`,
        foodLifestyle: 'Continue steady dietary iron & protein habits.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'tsh',
    label: 'TSH (Thyroid Stimulating Hormone)',
    plainMeaning: 'Master thyroid signaling hormone',
    unit: 'mIU/L',
    step: '0.05',
    placeholder: 'e.g. 4.2',
    scaleMin: 0.1,
    scaleMax: 10,
    evaluate(val, phase) {
      const pregSensitive = phase === 'pre_pregnancy' || phase === 'pregnancy';
      if (val < 0.4) {
        return {
          status: 'attention',
          badge: 'Low TSH (<0.4 mIU/L)',
          explain: `Low TSH (${val} mIU/L) can reflect an overactive thyroid (hyperthyroidism), postpartum thyroiditis phase, or slightly high thyroid tablet strength.`,
          foodLifestyle: 'Note any palpitations, heat intolerance, tremors, or sudden weight loss to share at your consult.',
          doctorQuestion: `My TSH is ${val} mIU/L — should we check Free T3/Free T4 or review my thyroid medication?`
        };
      }
      if (pregSensitive && val > 2.5) {
        return {
          status: 'attention',
          badge: 'Pre-Conception / Pregnancy Review (>2.5)',
          explain: `While general labs list up to 4.5 mIU/L as normal, FOGSI/endocrine guidelines often evaluate TSH >2.5–3.0 mIU/L closely when planning pregnancy or in Trimester 1.`,
          foodLifestyle: 'Keep morning routines consistent; ensure iodized salt in home cooking.',
          doctorQuestion: `Since I am in ${phase === 'pregnancy' ? 'pregnancy' : 'pre-pregnancy planning'}, should we optimize my TSH (${val} mIU/L) and check Anti-TPO antibodies?`
        };
      }
      if (val > 4.5) {
        return {
          status: 'discuss_soon',
          badge: 'Elevated TSH (>4.5 mIU/L)',
          explain: `TSH of ${val} mIU/L sits above typical adult reference (~0.45–4.5 mIU/L), suggesting sluggish thyroid signaling (subclinical or clinical hypothyroidism) — 4–5× more common in Indian women.`,
          foodLifestyle: 'Avoid raw goitrogenic mega-juices on an empty stomach; check Vitamin D & lipids as hypothyroidism raises LDL.',
          doctorQuestion: `My TSH is ${val} mIU/L — could we check Free T4 and Anti-TPO to decide whether monitoring or treatment is appropriate?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Within Typical Range',
        explain: `${val} mIU/L is within expected thyroid reference limits for your current stage.`,
        foodLifestyle: 'Recheck annually (or if cycle/energy shifts occur).',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'hba1c',
    label: 'HbA1c (3-Month Blood Sugar Avg)',
    plainMeaning: '8–12 week average blood glucose',
    unit: '%',
    step: '0.1',
    placeholder: 'e.g. 5.8',
    scaleMin: 4.2,
    scaleMax: 9.0,
    evaluate(val) {
      if (val >= 6.5) {
        return {
          status: 'discuss_soon',
          badge: 'Diabetic Reference Zone (≥6.5%)',
          explain: `HbA1c of ${val}% reflects elevated 3-month average glucose in the diabetic reference range (note: severe iron/B12 anemia can also slightly skew HbA1c).`,
          foodLifestyle: 'Walk 15 minutes after meals, prioritize protein/fiber before rotis/rice, and consult a physician promptly.',
          doctorQuestion: `My HbA1c is ${val}% — let’s confirm with fasting/post-meal glucose and build a structured management plan.`
        };
      }
      if (val >= 5.7) {
        return {
          status: 'attention',
          badge: 'Pre-Diabetes Window (5.7–6.4%)',
          explain: `${val}% falls in the early insulin-resistance / pre-diabetes window — the #1 most reversible stage through movement, muscle building, and meal sequencing!`,
          foodLifestyle: 'Eat sabzi + dal/curd/paneer/eggs first on your plate before rice/roti; add 3 days/week of strength exercises.',
          doctorQuestion: `My HbA1c is ${val}% in the pre-diabetic range — what lifestyle targets and retest timeline should I follow?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Healthy Glycemic Range (<5.7%)',
        explain: `${val}% indicates steady 3-month blood glucose regulation.`,
        foodLifestyle: 'Keep post-meal walks and muscle-preserving protein intake active.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'fasting_glucose',
    label: 'Fasting Blood Glucose (FBS)',
    plainMeaning: 'Morning blood sugar after overnight fast',
    unit: 'mg/dL',
    step: '1',
    placeholder: 'e.g. 96',
    scaleMin: 65,
    scaleMax: 160,
    evaluate(val, phase) {
      const upper = phase === 'pregnancy' ? 92 : 99;
      if (val >= 126) {
        return {
          status: 'discuss_soon',
          badge: 'Elevated Fasting Glucose (≥126)',
          explain: `Fasting glucose of ${val} mg/dL exceeds the 126 mg/dL threshold.`,
          foodLifestyle: 'Confirm 8–10 hour overnight fast and review alongside HbA1c with your doctor.',
          doctorQuestion: `My fasting blood sugar is ${val} mg/dL — what confirmatory tests and steps do you recommend?`
        };
      }
      if (val > upper) {
        return {
          status: 'attention',
          badge: `Borderline Fasting (> ${upper} mg/dL)`,
          explain: `${val} mg/dL is slightly above the ${upper} mg/dL reference (${phase === 'pregnancy' ? 'stricter antenatal target' : 'impaired fasting glucose 100–125'}).`,
          foodLifestyle: 'Earlier dinners (2.5–3 hours before sleep) and a 15-minute post-dinner stroll noticeably help morning fasting numbers.',
          doctorQuestion: `My fasting glucose is ${val} mg/dL — should we pair this with a 2-hour post-meal / OGTT check?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Within Reference Range',
        explain: `${val} mg/dL is comfortably within normal morning fasting limits.`,
        foodLifestyle: 'Maintain regular meal timing and hydration.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'fasting_insulin',
    label: 'Fasting Serum Insulin',
    plainMeaning: 'Baseline metabolic & PCOS insulin signal',
    unit: 'µIU/mL',
    step: '0.1',
    placeholder: 'e.g. 13.5',
    scaleMin: 2,
    scaleMax: 30,
    evaluate(val) {
      if (val > 12) {
        return {
          status: 'attention',
          badge: 'Elevated Insulin Signal (>12 µIU/mL)',
          explain: `Even if lab sheets print up to 24 µIU/mL, fasting insulin at ${val} µIU/mL suggests your pancreas is working extra hard to keep blood sugar normal (classic in South Asian PCOS & perimenopause).`,
          foodLifestyle: 'Cut liquid sugars/packaged juices, pair carbs with protein, and build leg/core muscle (muscle acts as a glucose sponge).',
          doctorQuestion: `My Fasting Insulin is ${val} µIU/mL — does this indicate insulin resistance contributing to my cycle or metabolic pattern?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Sensitive Insulin Response',
        explain: `${val} µIU/mL reflects calm baseline fasting insulin demand.`,
        foodLifestyle: 'Continue strength & aerobic activity.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'vit_d',
    label: '25-OH Vitamin D',
    plainMeaning: 'Calcium absorption & bone health vitamin',
    unit: 'ng/mL',
    step: '1',
    placeholder: 'e.g. 16',
    scaleMin: 4,
    scaleMax: 80,
    evaluate(val) {
      if (val < 20) {
        return {
          status: 'discuss_soon',
          badge: 'Deficient (<20 ng/mL)',
          explain: `${val} ng/mL is in the Vitamin D deficiency bracket (shared by 70–90% of Indian women), limiting bone calcium uptake and aggravating body aches.`,
          foodLifestyle: 'Vitamin D is fat-soluble — doctors typically pair a guided loading/maintenance schedule with healthy dietary fats and morning sunlight.',
          doctorQuestion: `My Vitamin D is ${val} ng/mL — what safe replenishment schedule and maintenance plan should I follow?`
        };
      }
      if (val < 30) {
        return {
          status: 'attention',
          badge: 'Insufficient (20–29 ng/mL)',
          explain: `${val} ng/mL sits just short of the ≥30 ng/mL bone-protective sufficiency zone.`,
          foodLifestyle: 'Include fortified milk/curd, mushrooms, or eggs and discuss maintenance support with your doctor.',
          doctorQuestion: `My Vitamin D is ${val} ng/mL — should we top it up into the 30–50 ng/mL sufficiency window?`
        };
      }
      if (val > 100) {
        return {
          status: 'discuss_soon',
          badge: 'Excess / Toxicity Alert (>100)',
          explain: `${val} ng/mL is dangerously high (usually from unsupervised high-dose weekly sachets/injections taken too long).`,
          foodLifestyle: 'Stop any Vitamin D supplements immediately and consult your physician to check serum calcium.',
          doctorQuestion: `My Vitamin D reached ${val} ng/mL — should we check Serum Calcium and pause supplementation?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Sufficient (30–60+ ng/mL)',
        explain: `${val} ng/mL supports healthy calcium absorption, bone remodeling, and muscle strength.`,
        foodLifestyle: 'Recheck once a year to avoid slipping back into deficiency.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'vit_b12',
    label: 'Serum Vitamin B12',
    plainMeaning: 'Nerve comfort, red blood cell & energy vitamin',
    unit: 'pg/mL',
    step: '5',
    placeholder: 'e.g. 195',
    scaleMin: 80,
    scaleMax: 800,
    evaluate(val) {
      if (val < 200) {
        return {
          status: 'discuss_soon',
          badge: 'Deficient (<200 pg/mL)',
          explain: `${val} pg/mL is below standard B12 sufficiency, a frequent cause of fatigue, mouth ulcers, low mood, and pins-and-needles in hands/feet.`,
          foodLifestyle: 'Include curd, buttermilk, paneer, milk, fortified foods (or eggs/fish if non-veg), and ask your doctor about restoration.',
          doctorQuestion: `My Vitamin B12 is ${val} pg/mL — what form of B12 replenishment do you advise for me?`
        };
      }
      if (val < 300) {
        return {
          status: 'attention',
          badge: 'Borderline Zone (200–299 pg/mL)',
          explain: `While >200 pg/mL clears the lowest lab bar, neurological & energy wellness is typically stronger above 300–350 pg/mL — especially on vegetarian diets or Metformin.`,
          foodLifestyle: 'Boost daily fermented dairy (dahi/chaas), paneer, or nutritional yeast.',
          doctorQuestion: `My B12 is ${val} pg/mL in the 200–300 borderline window — would addressing this help energy or nerve comfort?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Healthy B12 Reserve (≥300)',
        explain: `${val} pg/mL indicates comfortable Vitamin B12 reserves.`,
        foodLifestyle: 'Keep steady dietary B12 sources in daily meals.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'ldl',
    label: 'LDL Cholesterol ("Bad" Cholesterol)',
    plainMeaning: 'Artery-plaque forming cholesterol fraction',
    unit: 'mg/dL',
    step: '1',
    placeholder: 'e.g. 135',
    scaleMin: 50,
    scaleMax: 210,
    evaluate(val, phase) {
      if (val >= 160) {
        return {
          status: 'discuss_soon',
          badge: 'High LDL (≥160 mg/dL)',
          explain: `LDL of ${val} mg/dL is elevated. Note: untreated hypothyroidism and menopause estrogen drop both push LDL sharply upward!`,
          foodLifestyle: 'Swap deep-fried snacks & excess vanaspati/reheated oils for soluble fiber (oats, barley/jau, flaxseed/alsi, walnuts, methi) and check TSH.',
          doctorQuestion: `My LDL cholesterol is ${val} mg/dL — could thyroid or menopausal shifts be contributing, and what is my personal cardiac target?`
        };
      }
      if (val >= 130 || ((phase === 'post_menopause' || phase === 'senior') && val >= 115)) {
        return {
          status: 'attention',
          badge: 'Borderline High LDL',
          explain: `At ${val} mg/dL, LDL deserves proactive nutrition & heart-risk attention, especially as South Asians carry higher risk at moderate LDL levels.`,
          foodLifestyle: 'Add 1 tbsp ground flaxseed/chia, daily brisk walking, and plenty of soluble-fiber vegetables & dals.',
          doctorQuestion: `With LDL at ${val} mg/dL, how does my overall Non-HDL / Triglyceride-to-HDL ratio look?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Favorable LDL (<115–130)',
        explain: `${val} mg/dL sits in a favorable general range (individual targets vary if diabetic or with heart history).`,
        foodLifestyle: 'Keep active movement and heart-friendly home cooking.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'tvs_et_mm',
    label: 'TVS Endometrial Thickness (Uterine Lining)',
    plainMeaning: 'Uterine inner lining measurement on ultrasound',
    unit: 'mm',
    step: '0.1',
    placeholder: 'e.g. 5.5 (from USG report)',
    scaleMin: 1,
    scaleMax: 18,
    evaluate(val, phase) {
      const isPostMeno = phase === 'menopause' || phase === 'post_menopause' || phase === 'senior';
      if (isPostMeno) {
        if (val > 4.0) {
          return {
            status: 'discuss_soon',
            badge: 'Post-Menopause Review Needed (>4 mm)',
            explain: `After menopause, the uterine lining normally stays thin (typically ≤4 mm, especially if investigating post-menopausal bleeding). A reading of ${val} mm is called endometrial thickening — 75–90% of PMB cases turn out benign (polyps, simple hyperplasia), yet prompt Gynecologist evaluation is essential to rule out malignancy.`,
            foodLifestyle: 'Do NOT panic — bring your exact scan film & report promptly to your Gynecologist to see if hysteroscopy or gentle endometrial sampling is indicated.',
            doctorQuestion: `My post-menopausal TVS ultrasound notes an endometrial thickness of ${val} mm — should we evaluate for a benign polyp/hyperplasia or perform an endometrial biopsy?`
          };
        }
        return {
          status: 'within_range',
          badge: 'Thin Post-Menopausal Lining (≤4 mm)',
          explain: `${val} mm is within the typical thin post-menopausal reference (≤4 mm). Note: if you ever experience recurrent spotting, always still follow up with your Gynecologist.`,
          foodLifestyle: 'Keep all ultrasound copies organized chronologically in one folder.',
          doctorQuestion: null
        };
      }
      // Pre-menopausal / Perimenopausal context
      if (val > 16) {
        return {
          status: 'attention',
          badge: 'Thickened Pre-Menopausal Lining (>16 mm)',
          explain: `Before menopause, lining thickness changes naturally across the month (3–5 mm right after period, up to 12–16 mm before next period). At ${val} mm, your Gynecologist will correlate this with your exact cycle day and bleeding pattern.`,
          foodLifestyle: 'Note the exact Day 1 of your last menstrual period when showing this scan to your Gynecologist.',
          doctorQuestion: `My TVS shows ${val} mm endometrial thickness on Day __ of my cycle — should we repeat the scan right after my next period (Day 5–7)?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Cycle-Dependent Pre-Menopausal Range',
        explain: `${val} mm falls within the normal cycling range (4–16 mm) prior to menopause; interpretation always depends on which day of your cycle the scan was done.`,
        foodLifestyle: 'Always jot down your Last Menstrual Period (LMP) date on ultrasound reports.',
        doctorQuestion: null
      };
    }
  },
  {
    key: 'dexa_tscore',
    label: 'DEXA Bone Density T-Score (Spine / Hip)',
    plainMeaning: 'Hip & lumbar spine bone mineral density score',
    unit: 'SD',
    step: '0.1',
    placeholder: 'e.g. -1.8',
    scaleMin: -4.0,
    scaleMax: 1.5,
    evaluate(val) {
      if (val <= -2.5) {
        return {
          status: 'discuss_soon',
          badge: 'Osteoporosis Threshold (≤ -2.5)',
          explain: `A T-score of ${val} falls in the WHO Osteoporosis category, meaning bones are porous and need structured medical + fall-prevention protection before any slip occurs.`,
          foodLifestyle: 'Ensure good indoor lighting, non-slip bathroom mats, supervised resistance balance work, and adequate protein + calcium + Vit D.',
          doctorQuestion: `My DEXA T-score is ${val} — what bone-strengthening therapy, Vitamin D/Calcium balance, and safe exercises should I start?`
        };
      }
      if (val < -1.0) {
        return {
          status: 'attention',
          badge: 'Osteopenia / Early Bone Thinning (-1.0 to -2.4)',
          explain: `A T-score of ${val} signals Osteopenia (early bone mineral loss, affecting ~42% of post-menopausal Indian women) — the ideal window to halt progression before osteoporosis!`,
          foodLifestyle: 'Combine weight-bearing brisk walks + light strength training + ragi/curd/paneer/sesame + sufficient Vitamin D (≥30 ng/mL).',
          doctorQuestion: `My DEXA shows Osteopenia (T-score ${val}) — how can we protect my bone density and when should I repeat my DEXA scan?`
        };
      }
      return {
        status: 'within_range',
        badge: 'Normal Bone Density (≥ -1.0)',
        explain: `T-score of ${val} reflects preserved bone mineral density.`,
        foodLifestyle: 'Keep strength-bearing exercise and Vitamin D/calcium nutrition steady.',
        doctorQuestion: null
      };
    }
  }
];

export function analyzeReportValues(valuesObj, phase = 'pre_menopausal') {
  const results = [];
  const doctorQuestions = [];

  for (const spec of BIOMARKERS_SPEC) {
    const raw = valuesObj ? valuesObj[spec.key] : undefined;
    if (raw === undefined || raw === null || raw === '') continue;
    const num = Number(raw);
    if (Number.isNaN(num)) continue;

    const evalOut = spec.evaluate(num, phase);
    const pct = Math.max(
      4,
      Math.min(96, Math.round(((num - spec.scaleMin) / (spec.scaleMax - spec.scaleMin)) * 100))
    );

    results.push({
      ...spec,
      value: num,
      pinPct: pct,
      ...evalOut
    });

    if (evalOut.doctorQuestion) {
      doctorQuestions.push(evalOut.doctorQuestion);
    }
  }

  // Educational HOMA-IR calculation when both Fasting Glucose & Fasting Insulin exist
  let homaIr = null;
  if (valuesObj?.fasting_glucose && valuesObj?.fasting_insulin) {
    const fg = Number(valuesObj.fasting_glucose);
    const fi = Number(valuesObj.fasting_insulin);
    if (fg > 0 && fi > 0) {
      const score = +((fg * fi) / 405).toFixed(2);
      homaIr = {
        score,
        note:
          score >= 2.5
            ? `Educational HOMA-IR Index is ${score} (≥2.5 suggests underlying insulin resistance worth discussing alongside PCOS/perimenopause nutrition).`
            : `Educational HOMA-IR Index is ${score} (<2.0–2.5 reflects favorable fasting glucose-insulin balance).`
      };
      if (score >= 2.5) {
        doctorQuestions.push(
          `Based on my Fasting Glucose (${fg}) and Fasting Insulin (${fi}), my HOMA-IR calculates to ${score} — what metabolic steps do you recommend?`
        );
      }
    }
  }

  return {
    results,
    homaIr,
    doctorQuestions,
    flaggedCount: results.filter((r) => r.status !== 'within_range').length
  };
}

// Smart Paste Parser for Indian Pathology Report Snippets (Lal PathLabs, 1mg, Thyrocare, SMS)
export function parseLabReportText(rawText) {
  const text = String(rawText || '');
  const extracted = {};

  const patterns = [
    { key: 'hemoglobin', rx: /(?:ha?emoglobin|\bhb\b)\s*[:\-=]?\s*(\d{1,2}(?:\.\d{1,2})?)/i },
    { key: 'ferritin', rx: /ferritin\s*[:\-=]?\s*(\d{1,3}(?:\.\d{1,2})?)/i },
    { key: 'tsh', rx: /\btsh\b[^0-9\n]{0,25}?(\d{1,2}(?:\.\d{1,3})?)/i },
    { key: 'hba1c', rx: /hba1c[^0-9\n]{0,20}?(\d{1,2}(?:\.\d{1,2})?)/i },
    { key: 'fasting_glucose', rx: /(?:fasting\s*(?:blood)?\s*(?:sugar|glucose)|\bfbs\b)\s*[:\-=]?\s*(\d{2,3}(?:\.\d)?)/i },
    { key: 'fasting_insulin', rx: /(?:fasting\s*insulin|\binsulin\s*\(?fasting\)?)\s*[:\-=]?\s*(\d{1,2}(?:\.\d{1,2})?)/i },
    { key: 'vit_d', rx: /(?:vitamin\s*d|25[\s\-]*oh\s*vit(?:amin)?\s*d)\s*[:\-=]?\s*(\d{1,3}(?:\.\d{1,2})?)/i },
    { key: 'vit_b12', rx: /(?:vitamin\s*b[\s\-]*12|\bb12\b)\s*[:\-=]?\s*(\d{2,4}(?:\.\d)?)/i },
    { key: 'ldl', rx: /\bldl\b(?:\s*cholesterol)?\s*[:\-=]?\s*(\d{2,3}(?:\.\d)?)/i },
    { key: 'tvs_et_mm', rx: /(?:endometrial\s*thickness|\bet\b\s*thickness|endometrium)\s*[:\-=]?\s*(\d{1,2}(?:\.\d)?)\s*(?:mm)?/i },
    { key: 'dexa_tscore', rx: /t[\s\-]*score\s*[:\-=]?\s*(-?\d(?:\.\d)?)/i }
  ];

  for (const p of patterns) {
    const m = text.match(p.rx);
    if (m && m[1] !== undefined) {
      extracted[p.key] = Number(m[1]);
    }
  }
  return extracted;
}
