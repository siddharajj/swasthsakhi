// SwasthSakhi — India-Focused Life-Stage Preventive Screening & Condition Engine
// Grounded in FOGSI, ICMR, NP-NCD (MoHFW), Indian Menopause Society (IMS) & WHO educational frameworks.
// Strictly non-medical educational health literacy — not a substitute for clinical diagnosis.

export const LIFE_PHASES = [
  {
    id: 'teen',
    label: 'Teenage / Adolescence',
    ageHint: '13–19 yrs',
    shortLabel: 'Teen (13–19)',
    icon: '🌱',
    summary: 'Growth spurt, menarche & cycle establishment, iron/B12 stores, and primary HPV cancer prevention.',
    indiaInsight: '59.1% of Indian teen girls (15–19) have anemia (NFHS-5), often mistaken for exam fatigue or laziness. Ages 9–14 (and catch-up 15–26) is the golden window for India’s Cervavac HPV vaccine.',
    baselineTests: ['cbc_ferritin', 'vit_d', 'vit_b12', 'hpv_vaccine', 'tsh_screen'],
    redFlags: [
      {
        symptom: 'Periods soaking a pad/tampon every 1–2 hours or lasting >7–8 days',
        why: 'Pubertal menorrhagia can cause severe iron depletion or signal a bleeding/thyroid disorder.',
        action: 'Visit a Gynecologist; ask about CBC, Serum Ferritin, TSH, and coagulation baseline.'
      },
      {
        symptom: 'No first period by age 15–16, or cycles >90 days apart 2+ years after menarche',
        why: 'May reflect early PCOS, thyroid imbalance, hypothalamic stress, or anatomical factors.',
        action: 'Schedule an adolescent gynecology consult with hormonal & pelvic ultrasound (transabdominal) evaluation.'
      }
    ]
  },
  {
    id: 'pre_menopausal',
    label: 'Pre-Menopausal Adult',
    ageHint: '20–39 yrs',
    shortLabel: 'Pre-Menopause (20–39)',
    icon: '🌸',
    summary: 'Reproductive & metabolic wellness, PCOS/thyroid balance, breast awareness, and cervical screening initiation.',
    indiaInsight: 'India’s NP-NCD guidelines start annual diabetes & BP screening at age 30 (Asian-Indian BMI risk starts at 23.0 kg/m²). Yet 98.1% of women 30–49 have never had cervical screening.',
    baselineTests: ['cbc_ferritin', 'tsh_screen', 'hba1c_fbs', 'lipid_profile', 'vit_d', 'vit_b12', 'cervical_screen', 'cbe_breast', 'hpv_vaccine'],
    redFlags: [
      {
        symptom: 'Bleeding after intercourse (post-coital spotting) or bleeding between periods',
        why: 'Can arise from cervical polyps, infection, ectropion, or early cervical dysplasia.',
        action: 'Do not wait for your next routine check — see a Gynecologist for a speculum exam & Pap/HPV test.'
      },
      {
        symptom: 'New painless breast lump, skin dimpling, or bloody/clear unilateral nipple discharge',
        why: 'While many lumps in your 20s–30s are benign fibroadenomas, clinical imaging is essential.',
        action: 'Book a Clinical Breast Exam + Sono-mammography (Breast Ultrasound, preferred for dense breasts under 40).'
      },
      {
        symptom: 'Fewer than 4 periods a year (not on hormonal birth control)',
        why: 'Prolonged unopposed estrogen (common in unmanaged PCOS) thickens the uterine lining over time.',
        action: 'Consult a Gynecologist to protect endometrial health and evaluate insulin/thyroid balance.'
      }
    ]
  },
  {
    id: 'pre_pregnancy',
    label: 'Pre-Pregnancy Planning',
    ageHint: '3–6 mos before conception',
    shortLabel: 'Pre-Pregnancy',
    icon: '🕊️',
    summary: 'Optimising iron, folate, thyroid, immunity (Rubella), and genetic carrier screening before conception.',
    indiaInsight: 'India has high carrier rates for Beta-Thalassemia trait (3–4% nationally) and subclinical hypothyroidism — checking both BEFORE pregnancy prevents avoidable complications.',
    baselineTests: ['cbc_ferritin', 'hplc_thalassemia', 'rubella_igg', 'blood_group_rh', 'tsh_screen', 'hba1c_fbs', 'vit_d', 'vit_b12', 'sti_viral_panel', 'folate_prep'],
    redFlags: [
      {
        symptom: 'Trying to conceive >12 months (under age 35) or >6 months (age 35+)',
        why: 'Timely evaluation checks ovulation, tubal patency, thyroid/prolactin, and partner semen parameters together.',
        action: 'Book a joint fertility-readiness consult with an OB-GYN rather than repeating random blood tests alone.'
      },
      {
        symptom: 'History of 2 or more consecutive early pregnancy losses',
        why: 'Warrants targeted thyroid autoantibody (Anti-TPO), glycemic, anatomical, and antiphospholipid workup.',
        action: 'Consult an OB-GYN / Maternal-Fetal specialist before next conception.'
      }
    ]
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy (Antenatal Care)',
    ageHint: 'Trimesters 1, 2 & 3',
    shortLabel: 'Pregnancy',
    icon: '🤰',
    summary: 'Structured FOGSI/ICMR antenatal checks: anemia prevention, gestational diabetes (DIPSI/OGTT), thyroid, BP & fetal scans.',
    indiaInsight: '52.2% of pregnant women in India are anemic, and South Asian women have one of the world’s highest rates of Gestational Diabetes (GDM). All pregnancy ultrasounds legally require an OB-GYN Rx + Form F (PC-PNDT Act).',
    baselineTests: ['cbc_ferritin', 'blood_group_rh', 'tsh_screen', 'gdm_ogtt', 'sti_viral_panel', 'urine_routine', 'anc_ultrasounds', 'bp_preeclampsia', 'anc_vaccines'],
    redFlags: [
      {
        symptom: 'Severe headache, blurred vision/spots, sudden facial/hand swelling, or BP ≥ 140/90 mmHg',
        why: 'Key warning signs of Pre-eclampsia / Hypertensive Disorders of Pregnancy.',
        action: 'Contact your OB-GYN or maternity emergency unit the SAME DAY.'
      },
      {
        symptom: 'Any vaginal bleeding, fluid leaking, or noticeable drop in baby’s movements (after 24–28 wks)',
        why: 'Requires immediate fetal heart rate and placental evaluation.',
        action: 'Go directly to your maternity hospital — never wait overnight.'
      }
    ]
  },
  {
    id: 'post_partum',
    label: 'Postpartum (4th Trimester)',
    ageHint: '0–12 mos post-delivery',
    shortLabel: 'Postpartum',
    icon: '🤱',
    summary: 'Maternal recovery, iron & bone store rebuilding during lactation, post-GDM diabetes check, thyroid & emotional wellbeing.',
    indiaInsight: 'Once the baby arrives, mothers’ follow-ups drop sharply in India. Yet up to 50% of women with Gestational Diabetes develop Type 2 Diabetes within 5–10 years if unmonitored, and postpartum thyroiditis peaks at 2–6 months.',
    baselineTests: ['cbc_ferritin', 'postpartum_ogtt', 'tsh_screen', 'vit_d', 'vit_b12', 'ppd_wellbeing', 'pelvic_floor_check'],
    redFlags: [
      {
        symptom: 'Heavy bright-red bleeding soaking ≥1 pad/hour, large clots, or foul-smelling discharge + fever',
        why: 'Possible secondary postpartum hemorrhage or uterine/C-section infection.',
        action: 'Seek urgent OB-GYN / hospital care immediately.'
      },
      {
        symptom: 'Persistent tearfulness, severe anxiety, inability to sleep even when baby sleeps, or feeling detached >2 weeks',
        why: 'Baby blues fade within 10–14 days; lasting symptoms point to Postpartum Depression/Anxiety (~22% prevalence in Indian studies).',
        action: 'Speak openly with your OB-GYN or a maternal mental health counselor — it is biological and highly treatable.'
      }
    ]
  },
  {
    id: 'peri_menopausal',
    label: 'Perimenopause Transition',
    ageHint: 'Typically 40–47 yrs in India',
    shortLabel: 'Perimenopause',
    icon: '🌗',
    summary: 'Navigating fluctuating estrogen, changing cycle lengths, hidden iron loss, rising cholesterol, breast & cervical checks.',
    indiaInsight: 'Because average Indian menopause is ~46.2 years (4–5 years earlier than Western charts), perimenopause often begins in the late 30s or early 40s — frequently mislabelled as "stress" or ignored.',
    baselineTests: ['cbc_ferritin', 'tsh_screen', 'hba1c_fbs', 'lipid_profile', 'lft_kft', 'vit_d', 'vit_b12', 'mammogram_breast', 'cervical_screen', 'pelvic_tvs_usg'],
    redFlags: [
      {
        symptom: 'Flooding periods, cycles closer than 21 days, bleeding >7 days, or spotting between cycles',
        why: 'Not all erratic perimenopausal bleeding is "normal transition" — fibroids, adenomyosis, polyps, or endometrial hyperplasia must be ruled out.',
        action: 'See a Gynecologist for a Transvaginal Ultrasound (TVS) & CBC/Ferritin check before taking over-the-counter remedies.'
      },
      {
        symptom: 'Persistent abdominal bloating, early fullness when eating, or pelvic pressure lasting >2–3 weeks',
        why: 'Often dismissed as "gas/acidity" in India, persistent new bloating warrants ovarian & pelvic evaluation.',
        action: 'Request a Pelvic/Transvaginal Ultrasound and gynecological exam.'
      }
    ]
  },
  {
    id: 'menopause',
    label: 'Menopause Milestone',
    ageHint: '12 mos period-free (~46–51 yrs)',
    shortLabel: 'Menopause',
    icon: '🌕',
    summary: 'Marking 12 consecutive months without a period: establishing bone density (DEXA), heart, lipid, and cancer baselines.',
    indiaInsight: 'Estrogen loss accelerates bone loss by up to 2–3% per year in the first 5 years of menopause, while LDL cholesterol and visceral insulin resistance climb sharply.',
    baselineTests: ['dexa_bone', 'lipid_profile', 'hba1c_fbs', 'tsh_screen', 'lft_kft', 'vit_d', 'vit_b12', 'mammogram_breast', 'cervical_screen', 'bp_cardiac'],
    redFlags: [
      {
        symptom: 'ANY vaginal bleeding, brown discharge, or pink spotting ≥12 months after your last period',
        why: 'Post-Menopausal Bleeding (PMB) is NEVER a "leftover period". 75–90% of cases are benign (atrophy, polyps, simple endometrial thickening), but 10–25% require ruling out endometrial or cervical cancer.',
        action: 'Book a Gynecologist visit + Transvaginal Ultrasound (measuring Endometrial Thickness in mm) promptly within 1–2 weeks.'
      }
    ]
  },
  {
    id: 'post_menopause',
    label: 'Post-Menopause',
    ageHint: '50–64 yrs',
    shortLabel: 'Post-Menopause (50–64)',
    icon: '🌺',
    summary: 'Protecting bone strength (osteoporosis prevention), heart & metabolic health, breast/cervical screening, and endometrial vigilance.',
    indiaInsight: '30–60% of post-menopausal Indian women have osteoporosis (and ~42% osteopenia), experiencing fractures 10–20 years earlier than Western women. Heart disease also overtakes pre-menopausal rates.',
    baselineTests: ['dexa_bone', 'lipid_profile', 'hba1c_fbs', 'bp_cardiac', 'lft_kft', 'tsh_screen', 'vit_d', 'vit_b12', 'urine_routine', 'mammogram_breast', 'cervical_screen', 'eye_dental'],
    redFlags: [
      {
        symptom: 'Even a single drop of post-menopausal spotting, pinkish wipe, or watery blood-tinged discharge',
        why: 'Can indicate endometrial thickening/hyperplasia, benign polyps, vaginal atrophy, or early endometrial/cervical malignancy.',
        action: 'Prompt Gynecologist evaluation + Transvaginal Ultrasound (TVS checking ≤4 mm endometrial cutoff) — early evaluation brings huge peace of mind.'
      },
      {
        symptom: 'Jaw/back/upper-stomach discomfort, unusual breathlessness on stairs, or sudden sweating',
        why: 'Women’s cardiac symptoms after menopause are often atypical (not classic crushing left chest pain) and misattributed to gastritis.',
        action: 'Seek immediate ECG & cardiac evaluation — never self-treat new exertional discomfort as acidity.'
      },
      {
        symptom: 'Recurrent burning urination or frequent UTIs (>2 in 6 months)',
        why: 'Often linked to Genitourinary Syndrome of Menopause (low local estrogen thinning urinary/vaginal tissue) or high blood sugar.',
        action: 'Check Urine Routine/Culture + HbA1c, and ask your Gynecologist about targeted local menopausal care.'
      }
    ]
  },
  {
    id: 'senior',
    label: 'Senior / Golden Years',
    ageHint: '65+ yrs',
    shortLabel: 'Senior (65+)',
    icon: '👑',
    summary: 'Mobility & fracture prevention, cardiovascular & kidney preservation, vision/hearing clarity, pelvic support & continued PMB awareness.',
    indiaInsight: 'Hip and spine fragility fractures in Indian elders frequently occur from minor indoor slips due to undiagnosed osteoporosis + Vitamin D/B12 deficiency affecting balance.',
    baselineTests: ['dexa_bone', 'cbc_ferritin', 'hba1c_fbs', 'lipid_profile', 'lft_kft', 'vit_d', 'vit_b12', 'tsh_screen', 'bp_cardiac', 'mammogram_breast', 'urine_routine', 'eye_dental'],
    redFlags: [
      {
        symptom: 'Any post-menopausal bleeding or spotting at ANY age (60s, 70s, 80s)',
        why: 'Age never makes vaginal bleeding normal; benign polyps/atrophy vs. endometrial thickening must always be checked.',
        action: 'Schedule a gentle Gynecologist check + Transvaginal/Pelvic Ultrasound promptly.'
      },
      {
        symptom: 'Height loss (>2–3 cm), stooped posture, sudden mid-back pain, or unsteadiness/tingling feet',
        why: 'Signals silent vertebral compression fractures (osteoporosis) or severe B12/diabetic neuropathy.',
        action: 'Request DEXA Bone Scan, Spine evaluation, Vitamin D, B12, and home fall-safety review.'
      }
    ]
  }
];

export const CONDITIONS_CATALOG = [
  {
    id: 'pcos',
    label: 'PCOS / Irregular Periods',
    localHint: 'हॉर्मोनल असंतुलन / अनियमित पीरियड्स',
    addedTests: ['fasting_insulin', 'hormone_panel_pcos', 'hba1c_fbs', 'lipid_profile', 'pelvic_tvs_usg'],
    careNote: 'South Asian PCOS carries strong insulin-resistance risk — tracking Fasting Insulin + HbA1c + Lipids matters just as much as ovarian ultrasound.'
  },
  {
    id: 'thyroid',
    label: 'Thyroid (Hypo / Hyper / Hashimoto’s)',
    localHint: 'थायरॉइड',
    addedTests: ['thyroid_full_tpo', 'lipid_profile', 'vit_d'],
    careNote: 'Check TSH every 6 months (or 6 weeks after any thyroxine dose change). Take morning thyroid tablet on an empty stomach, 4 hours apart from iron/calcium.'
  },
  {
    id: 'anemia',
    label: 'Anemia / Low Hb / Hair Fall & Fatigue',
    localHint: 'खून और आयरन की कमी',
    addedTests: ['cbc_ferritin', 'vit_b12'],
    careNote: 'Hemoglobin alone drops LAST. Checking Serum Ferritin (stored iron) + Vitamin B12 catches depletion months earlier.'
  },
  {
    id: 'endometriosis_fibroids',
    label: 'Fibroids / Endometriosis / Heavy Bleeding',
    localHint: 'रसौली (फाइब्रॉइड) / हैवी ब्लीडिंग',
    addedTests: ['cbc_ferritin', 'pelvic_tvs_usg'],
    careNote: 'Track cycle volume and pelvic scan dimensions every 6–12 months with your Gynecologist so chronic blood loss doesn’t silently drain iron.'
  },
  {
    id: 'endometrial_pmb',
    label: 'Past Post-Menopausal Spotting / Endometrial Thickening',
    localHint: 'मेनोपॉज़ के बाद ब्लीडिंग / बच्चेदानी की परत मोटी होना',
    addedTests: ['pelvic_tvs_usg', 'gynec_endometrial_review', 'hba1c_fbs'],
    careNote: 'Even when an initial biopsy/scan turns out benign (hyperplasia/polyp/atrophy), keep a scheduled Gynecologist + TVS follow-up log and report any recurrent spotting immediately.'
  },
  {
    id: 'diabetes_prediabetes',
    label: 'Diabetes / Pre-Diabetes / Past GDM',
    localHint: 'शुगर / गर्भावस्था की शुगर का इतिहास',
    addedTests: ['hba1c_fbs', 'urine_microalbumin', 'lipid_profile', 'eye_dental'],
    careNote: 'HbA1c every 3–6 months plus an annual Urine Microalbumin-Creatinine Ratio (ACR) protects kidney micro-vessels early.'
  },
  {
    id: 'hypertension_heart',
    label: 'High BP / Cholesterol / Heart History',
    localHint: 'हाई बीपी / कोलेस्ट्रॉल',
    addedTests: ['bp_cardiac', 'lipid_profile', 'lft_kft', 'urine_microalbumin'],
    careNote: 'Combine home upper-arm BP logging with annual Kidney/Electrolyte, Lipid Profile, and baseline ECG.'
  },
  {
    id: 'bone_joint',
    label: 'Osteopenia / Osteoporosis / Joint Pain',
    localHint: 'हड्डियों की कमज़ोरी / जोड़ों का दर्द',
    addedTests: ['dexa_bone', 'vit_d', 'calcium_phos_pth'],
    careNote: 'Calcium supplements cannot absorb well when Vitamin D is <30 ng/mL. Resistance/weight-bearing movement + DEXA tracking prevent fractures.'
  },
  {
    id: 'family_cancer',
    label: 'Family History: Breast / Ovarian / Uterine Cancer',
    localHint: 'परिवार में ब्रेस्ट / ओवेरियन / यूटेरस कैंसर का इतिहास',
    addedTests: ['mammogram_breast', 'cervical_screen', 'pelvic_tvs_usg', 'genetic_risk_consult'],
    careNote: 'Screening often starts 5–10 years earlier than the youngest affected relative’s diagnosis age. Discuss genetic counseling (BRCA/Lynch) with an oncologist/gynecologist.'
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian / Plant-Based Diet',
    localHint: 'शाकाहारी आहार (B12 व आयरन ध्यान)',
    addedTests: ['vit_b12', 'cbc_ferritin', 'vit_d'],
    careNote: '40–70% of Indian vegetarians develop low Vitamin B12, causing fatigue, brain fog, and tingling fingers/toes.'
  }
];

// Master Test Dictionary with India Path-Lab & Legal Rules
export const TESTS_MASTER = {
  cbc_ferritin: {
    id: 'cbc_ferritin',
    name: 'Complete Blood Count (CBC) + Serum Ferritin',
    hindiHint: 'खून की जांच (Hb) और आयरन स्टोर (Ferritin)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months (every 6 mos if heavy periods/anemic)',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹650 – ₹1,100',
    whereInIndia: 'Direct walk-in or home sample collection via NABL labs (Dr. Lal PathLabs, Metropolis, Thyrocare, Tata 1mg, Apollo, Agilus/SRL, Redcliffe). No GP prescription needed.',
    whyItMatters: '57% of Indian women are anemic. CBC checks Hemoglobin, while Ferritin reveals your actual iron reserve bank before Hemoglobin crashes.',
    prepNote: 'Can be clubbed with morning fasting blood draw; avoid iron tablets for 24 hrs prior for accurate iron studies.'
  },
  tsh_screen: {
    id: 'tsh_screen',
    name: 'Thyroid Profile (TSH, Free T3, Free T4)',
    hindiHint: 'थायरॉइड जांच (TSH, FT3, FT4)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months (every trimester in pregnancy)',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹400 – ₹750',
    whereInIndia: 'Direct home phlebotomy or any NABL pathology lab without a doctor prescription.',
    whyItMatters: 'Women in India are 4–5× more prone to hypothyroidism, which drives irregular periods, weight shifts, hair fall, subfertility, and high cholesterol.',
    prepNote: 'Best drawn between 7–9 AM before breakfast (TSH has a natural daily rhythm). If on thyroid medication, ask your doctor whether to draw before morning dose.'
  },
  thyroid_full_tpo: {
    id: 'thyroid_full_tpo',
    name: 'Full Thyroid Panel + Anti-TPO Antibodies',
    hindiHint: 'विस्तृत थायरॉइड और एंटी-TPO जांच',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 6–12 months (Anti-TPO once as baseline)',
    timelineSlot: 'Month 1 & Month 7 • Thyroid Follow-up',
    inrRange: '₹1,100 – ₹1,800',
    whereInIndia: 'Direct home collection or walk-in NABL pathology lab.',
    whyItMatters: 'Identifies autoimmune Hashimoto’s thyroiditis and tracks whether current thyroxine replacement keeps TSH in your life-stage range.',
    prepNote: 'Morning sample preferred; keep lab timing consistent across checkups.'
  },
  hba1c_fbs: {
    id: 'hba1c_fbs',
    name: 'HbA1c (3-Month Average Sugar) + Fasting Blood Glucose',
    hindiHint: '3 महीने की औसत शुगर (HbA1c) व खाली पेट शुगर',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months from age 30 (every 3–6 mos if pre-diabetic/PCOS)',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹450 – ₹750',
    whereInIndia: 'Direct home collection or walk-in pathology lab — no prescription required.',
    whyItMatters: 'South Asian women develop insulin resistance at lower body weights (BMI ≥ 23), surging sharply in PCOS, post-GDM, and post-menopause.',
    prepNote: '8–10 hours overnight water-only fast required for Fasting Glucose (HbA1c itself is unaffected by one meal, so bundling in the morning covers both).'
  },
  fasting_insulin: {
    id: 'fasting_insulin',
    name: 'Fasting Serum Insulin (HOMA-IR Context)',
    hindiHint: 'खाली पेट इंसुलिन जांच (PCOS / मेटाबोलिक)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months if PCOS / central weight gain',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹650 – ₹950',
    whereInIndia: 'Direct walk-in or home sample collection via major NABL path labs.',
    whyItMatters: 'Catches elevated insulin years before blood sugar or HbA1c turns abnormal — very common in Indian PCOS phenotypes.',
    prepNote: 'Strict 10–12 hour overnight water-only fast.'
  },
  lipid_profile: {
    id: 'lipid_profile',
    name: 'Lipid Profile (LDL, HDL, Triglycerides, Non-HDL)',
    hindiHint: 'कोलेस्ट्रॉल व ट्राइग्लिसराइड्स (लिपिड प्रोफाइल)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months (essential from perimenopause onwards)',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹450 – ₹800',
    whereInIndia: 'Direct home sample collection or walk-in path lab — no GP note needed.',
    whyItMatters: 'South Asians often have high Triglycerides + low protective HDL, and LDL cholesterol rises steeply when estrogen drops in the 40s.',
    prepNote: '10–12 hour overnight water-only fast gives the cleanest Triglyceride reading.'
  },
  vit_d: {
    id: 'vit_d',
    name: '25-Hydroxy Vitamin D',
    hindiHint: 'विटामिन डी जांच (हड्डियां व इम्युनिटी)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹700 – ₹1,200 (cheaper inside wellness combo)',
    whereInIndia: 'Direct home phlebotomy or walk-in path lab (tip: bundled wellness packages cut Vit D + B12 cost in half).',
    whyItMatters: '70–90% of Indian women are Vitamin D deficient, preventing dietary calcium from entering bones and triggering early osteopenia.',
    prepNote: 'No special prep; bundle with morning blood panel.'
  },
  vit_b12: {
    id: 'vit_b12',
    name: 'Serum Vitamin B12',
    hindiHint: 'विटामिन बी-12 जांच (नसें व ऊर्जा)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹600 – ₹1,000 (cheaper inside wellness combo)',
    whereInIndia: 'Direct home phlebotomy or walk-in path lab.',
    whyItMatters: '40–70% deficiency in India (especially vegetarian diets); low B12 causes exhaustion, mouth ulcers, memory fog, and tingling hands/feet.',
    prepNote: 'Morning draw alongside annual blood panel.'
  },
  lft_kft: {
    id: 'lft_kft',
    name: 'Liver & Kidney Function Panel (LFT, KFT, Uric Acid, eGFR)',
    hindiHint: 'लिवर और किडनी कार्यक्षमता जांच',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months from age 40 (or if on regular meds)',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹700 – ₹1,200',
    whereInIndia: 'Direct home sample collection or walk-in NABL lab.',
    whyItMatters: 'Screens for silent fatty liver (MASLD, rising rapidly in Indian midlife women), creatinine/eGFR kidney filtration, and post-menopausal uric acid shifts.',
    prepNote: 'Morning fasting draw; stay normally hydrated with plain water.'
  },
  calcium_phos_pth: {
    id: 'calcium_phos_pth',
    name: 'Serum Calcium, Phosphorus & Alkaline Phosphatase',
    hindiHint: 'कैल्शियम व हड्डी मिनरल पैनल',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months',
    timelineSlot: 'Month 1 • Morning Home Blood Draw',
    inrRange: '₹350 – ₹650',
    whereInIndia: 'Direct home sample collection or walk-in path lab.',
    whyItMatters: 'Monitors bone mineral turnover alongside Vitamin D and DEXA bone density scans.',
    prepNote: 'Bundle with morning fasting blood panel.'
  },
  urine_routine: {
    id: 'urine_routine',
    name: 'Urine Routine & Microscopy',
    hindiHint: 'यूरीन रूटीन जांच',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months (each trimester in pregnancy)',
    timelineSlot: 'Month 1 • Morning Home Sample',
    inrRange: '₹150 – ₹250',
    whereInIndia: 'Collect sterile mid-stream morning sample at home for phlebotomist pickup or lab drop-off.',
    whyItMatters: 'Detects silent asymptomatic UTIs (crucial in pregnancy and post-menopause), urine protein, and sugar spill.',
    prepNote: 'Mid-stream first morning clean-catch urine in a sterile container; avoid active menstrual bleeding days.'
  },
  urine_microalbumin: {
    id: 'urine_microalbumin',
    name: 'Spot Urine Microalbumin-to-Creatinine Ratio (uACR)',
    hindiHint: 'यूरीन माइक्रोएल्ब्यूमिन (किडनी सुरक्षा जांच)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Every 12 months if Diabetic / Hypertensive',
    timelineSlot: 'Month 1 • Morning Home Sample',
    inrRange: '₹550 – ₹850',
    whereInIndia: 'Direct home sample pickup or walk-in path lab.',
    whyItMatters: 'Catches earliest microscopic kidney stress years before serum creatinine rises.',
    prepNote: 'First morning spot urine sample.'
  },
  hormone_panel_pcos: {
    id: 'hormone_panel_pcos',
    name: 'Reproductive Hormone Check (LH, FSH, Prolactin, Total/Free Testosterone)',
    hindiHint: 'हॉर्मोन प्रोफाइल (LH, FSH, प्रोलैक्टिन)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Baseline or when investigating irregular cycles/acne/hirsutism',
    timelineSlot: 'Cycle Day 2 or 3 • Morning Draw',
    inrRange: '₹1,400 – ₹2,400',
    whereInIndia: 'Direct home collection or NABL path lab (share results with your Gynecologist for clinical interpretation).',
    whyItMatters: 'Helps differentiate PCOS from high prolactin or ovarian reserve changes.',
    prepNote: 'Cycle-sensitive: typically drawn on Day 2 or Day 3 of menstrual bleeding, morning waking rest state.'
  },
  hplc_thalassemia: {
    id: 'hplc_thalassemia',
    name: 'Hb Electrophoresis / HPLC (Thalassemia & Hemoglobinopathy Screen)',
    hindiHint: 'थैलेसीमिया कैरियर जांच (HPLC)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Once in a lifetime (essential before or early in first pregnancy)',
    timelineSlot: 'Pre-Conception Baseline',
    inrRange: '₹800 – ₹1,200',
    whereInIndia: 'Direct home collection or walk-in NABL path lab.',
    whyItMatters: 'Identifies silent Beta-Thalassemia minor/trait (which looks like mild anemia on CBC) so partner screening can protect future babies.',
    prepNote: 'No fasting required.'
  },
  rubella_igg: {
    id: 'rubella_igg',
    name: 'Rubella IgG Immunity Titer',
    hindiHint: 'रूबेला इम्युनिटी जांच (गर्भावस्था से पहले)',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Once during pre-pregnancy planning',
    timelineSlot: '3 Months Pre-Conception',
    inrRange: '₹550 – ₹850',
    whereInIndia: 'Direct home collection or walk-in path lab.',
    whyItMatters: 'If non-immune, taking the MMR vaccine at least 1 month BEFORE pregnancy prevents Congenital Rubella Syndrome (vaccine cannot be given once pregnant).',
    prepNote: 'No fasting needed.'
  },
  blood_group_rh: {
    id: 'blood_group_rh',
    name: 'ABO Blood Grouping & Rh Factor Typing',
    hindiHint: 'ब्लड ग्रुप और Rh फैक्टर जांच',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'Once (confirm documented copy for pregnancy)',
    timelineSlot: 'Baseline / First Antenatal Visit',
    inrRange: '₹150 – ₹300',
    whereInIndia: 'Any pathology lab or home collection.',
    whyItMatters: 'Identifies Rh-negative mothers early so timely Anti-D prophylaxis can protect current and future pregnancies.',
    prepNote: 'No fasting required.'
  },
  sti_viral_panel: {
    id: 'sti_viral_panel',
    name: 'Antenatal / Pre-Conception Viral Screen (HBsAg, HCV, VDRL, HIV)',
    hindiHint: 'हेपेटाइटिस बी, VDRL व वायरल सुरक्षा जांच',
    category: 'blood',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Pre-conception / First Trimester booking',
    timelineSlot: 'Booking Checkup',
    inrRange: '₹900 – ₹1,600',
    whereInIndia: 'NABL lab center or hospital clinic (HIV testing in India follows NACO pre/post-test counseling & photo ID norms).',
    whyItMatters: 'Protects both mother and baby by preventing vertical transmission of Hepatitis B, Syphilis, or HIV.',
    prepNote: 'Carry a valid Government ID for lab documentation.'
  },
  gdm_ogtt: {
    id: 'gdm_ogtt',
    name: '75g Oral Glucose Challenge (DIPSI / OGTT for Gestational Diabetes)',
    hindiHint: 'गर्भावस्था शुगर जांच (75 ग्राम ग्लूकोज टेस्ट)',
    category: 'blood',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'First booking visit + repeat at 24–28 weeks of pregnancy',
    timelineSlot: 'Trimester 1 & Weeks 24–28',
    inrRange: '₹250 – ₹550',
    whereInIndia: 'Pathology lab center or maternity hospital (FOGSI/DIPSI protocol uses 75g oral glucose with 2-hour venous blood check).',
    whyItMatters: 'Indian women have high genetic susceptibility to Gestational Diabetes; early dietary/medical balance keeps baby’s birth weight and delivery safe.',
    prepNote: 'Requires sitting quietly at the lab for 2 hours after drinking measured 75g glucose solution.'
  },
  postpartum_ogtt: {
    id: 'postpartum_ogtt',
    name: 'Postpartum 75g 2-Hour OGTT + HbA1c',
    hindiHint: 'डिलीवरी के 6–12 हफ्ते बाद शुगर जांच',
    category: 'blood',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'At 6–12 weeks post-delivery (then annual HbA1c)',
    timelineSlot: 'Week 6–12 Postpartum',
    inrRange: '₹450 – ₹750',
    whereInIndia: 'Pathology lab walk-in or scheduled 2-sample home collection.',
    whyItMatters: 'Ensures pregnancy sugar changes have resolved and catches early pre-diabetes while reversible.',
    prepNote: 'Overnight fast before first sample.'
  },
  cervical_screen: {
    id: 'cervical_screen',
    name: 'Cervical Screening: Liquid-Based Pap Smear / HPV DNA Test',
    hindiHint: 'सर्वाइकल कैंसर बचाव जांच (पैप स्मीयर / HPV स्वैब)',
    category: 'cervical_gynec',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Pap every 3 yrs (age 21–29); HPV DNA or Co-test every 5 yrs (age 30–65)',
    timelineSlot: 'Month 2 • Women’s Clinic / Self-Sample',
    inrRange: '₹800 – ₹1,500 (Pap) • ₹1,800 – ₹2,800 (HPV DNA)',
    whereInIndia: 'Option 1: Any Gynecologist clinic or diagnostic flagship center (Lal PathLabs/Metropolis/Apollo women’s centers) — no prior referral needed at clinic. Option 2: Private At-Home HPV DNA Self-Sampling vaginal swab kits now available in India for women hesitant about pelvic exams!',
    whyItMatters: 'Only 1.9% of Indian women are screened, yet catching pre-cancerous cervical cell changes makes cervical cancer nearly 100% preventable.',
    prepNote: 'Schedule 5+ days after your period ends; avoid vaginal creams, douching, or intercourse for 48 hours prior.'
  },
  cbe_breast: {
    id: 'cbe_breast',
    name: 'Clinical Breast Exam (CBE) + Monthly Breast Self-Awareness',
    hindiHint: 'स्तन स्वास्थ्य जांच (डॉक्टर द्वारा जांच व मासिक स्वयं-जांच)',
    category: 'clinical_exam',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Clinical exam every 1–3 yrs (20s–30s), annually from 40; Self-check monthly',
    timelineSlot: 'Monthly (Day 7–10 of cycle) + Annual Gynec Visit',
    inrRange: '₹0 (Self-check) • ₹500 – ₹1,000 (Clinic consult)',
    whereInIndia: 'Performed during any routine Gynecologist / Women’s Wellness OPD visit or government Ayushman Arogya Mandir NCD clinic.',
    whyItMatters: 'Less than 1% of women in India get clinical breast checks, leading to late-stage diagnoses. Knowing your normal baseline catches subtle changes early.',
    prepNote: 'Best done 3–5 days after period ends when hormonal breast tenderness subsides (or same date each month post-menopause).'
  },
  mammogram_breast: {
    id: 'mammogram_breast',
    name: 'Screening Mammogram + Sono-Mammography (Breast Ultrasound)',
    hindiHint: 'मैमोग्राफी और ब्रेस्ट अल्ट्रासाउंड (सोनो-मैमोग्राफी)',
    category: 'imaging',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Every 1–2 years starting age 40 (earlier if family history)',
    timelineSlot: 'Month 2 • Half-Day Imaging Center Visit',
    inrRange: '₹1,800 – ₹3,500',
    whereInIndia: 'Diagnostic radiology/imaging centers or hospital preventive health wings (most centers accept preventive walk-ins over age 40 or offer quick in-house doctor requisition).',
    whyItMatters: 'Indian women frequently have denser breast tissue and an earlier breast cancer peak (40–50 yrs), so radiologists often pair X-ray Mammography with Ultrasound (Sono-mammography).',
    prepNote: 'Do not wear deodorant, talcum powder, or lotion under arms/chest on scan day (shows up as tiny white spots on film).'
  },
  dexa_bone: {
    id: 'dexa_bone',
    name: 'DEXA Bone Mineral Density Scan (Lumbar Spine & Hip)',
    hindiHint: 'हड्डियों की मज़बूती की जांच (DEXA बोन स्कैन)',
    category: 'imaging',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Baseline at Menopause (~46–50 in India) or age 50+, repeat every 2–3 yrs',
    timelineSlot: 'Month 2 • Half-Day Imaging Center Visit',
    inrRange: '₹2,000 – ₹3,800',
    whereInIndia: 'Radiology / Diagnostic imaging centers (note: pick real Central Hip & Spine DEXA, not free pharmacy heel-ultrasound camps which are less accurate).',
    whyItMatters: 'Osteoporosis is painless until a fracture happens. Indian Menopause Society guidelines recommend earlier baseline DEXA than Western age-65 rules.',
    prepNote: 'Avoid taking calcium tablets for 24 hours before the scan; painless 10-minute table scan.'
  },
  pelvic_tvs_usg: {
    id: 'pelvic_tvs_usg',
    name: 'Pelvic / Transvaginal Ultrasound (Uterus, Ovaries & Endometrial Thickness)',
    hindiHint: 'पेल्विक / टीवीएस अल्ट्रासाउंड (बच्चेदानी की परत व ओवरी जांच)',
    category: 'imaging',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'As indicated by life-phase symptoms, PCOS/fibroids, or immediately if any post-menopausal bleeding',
    timelineSlot: 'Diagnostic Imaging / Gynec Check',
    inrRange: '₹1,000 – ₹2,200',
    whereInIndia: 'NABL Imaging Center or Gynecologist Clinic. Bring a doctor’s note requesting "Pelvic/TVS USG with Endometrial Thickness (ET in mm) & bilateral adnexa" + Government ID.',
    whyItMatters: 'Directly visualizes fibroids, ovarian cysts, PCOS morphology, and measures Endometrial Thickness (crucial for catching benign hyperplasia vs. malignancy in abnormal or post-menopausal bleeding).',
    prepNote: 'Transabdominal scan needs a full bladder; Transvaginal (TVS) scan needs an empty bladder and gives much sharper endometrial thickness clarity.'
  },
  gynec_endometrial_review: {
    id: 'gynec_endometrial_review',
    name: 'Targeted Gynecologist Endometrial Surveillance Review',
    hindiHint: 'स्त्री रोग विशेषज्ञ द्वारा बच्चेदानी की परत की फॉलो-अप जांच',
    category: 'cervical_gynec',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: 'Every 6–12 months after past endometrial thickening/polyp (or immediately if spotting recurs)',
    timelineSlot: 'Scheduled Specialist Follow-Up',
    inrRange: '₹700 – ₹1,500 (Consult)',
    whereInIndia: 'Registered Gynecologist OPD / Women’s Hospital.',
    whyItMatters: 'Ensures benign endometrial thickening/hyperplasia stays stable and decides if office Pipelle sampling or hysteroscopy is ever needed.',
    prepNote: 'Carry previous TVS ultrasound reports showing exact mm thickness and any past histopathology report.'
  },
  anc_ultrasounds: {
    id: 'anc_ultrasounds',
    name: 'Scheduled Pregnancy Ultrasounds (Dating, NT/NB, TIFFA Anomaly, Growth)',
    hindiHint: 'गर्भावस्था के चरणबद्ध अल्ट्रासाउंड स्कैन',
    category: 'imaging',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: '6–8 wks (Dating), 11–13+6 wks (NT/NB), 18–20 wks (TIFFA), 32–36 wks (Growth)',
    timelineSlot: 'Trimester Milestones',
    inrRange: '₹1,200 – ₹3,800 per scan',
    whereInIndia: 'Strictly PC-PNDT registered ultrasound center ONLY. Legally requires written OB-GYN prescription, signed Form F, and Mother’s Government Photo ID.',
    whyItMatters: 'Tracks fetal organ development, placental position, amniotic fluid, and blood flow safely.',
    prepNote: 'Mandatory: Carry original Aadhaar/Voter/Passport ID + signed OB-GYN prescription (required by Indian law under the PC-PNDT Act).'
  },
  bp_preeclampsia: {
    id: 'bp_preeclampsia',
    name: 'Antenatal Blood Pressure & Urine Dipstick Monitoring',
    hindiHint: 'गर्भावस्था बीपी और यूरीन प्रोटीन निगरानी',
    category: 'clinical_exam',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: 'Every Antenatal Visit (monthly → biweekly → weekly)',
    timelineSlot: 'Every ANC Visit',
    inrRange: 'Included in ANC visit (or ₹1,500 home cuff)',
    whereInIndia: 'OB-GYN clinic / ANM center + optional validated upper-arm home BP monitor.',
    whyItMatters: 'Catches Pregnancy-Induced Hypertension / Pre-eclampsia before symptoms escalate.',
    prepNote: 'Rest seated with feet flat for 5 minutes before BP reading.'
  },
  bp_cardiac: {
    id: 'bp_cardiac',
    name: 'Blood Pressure Log + Resting 12-Lead ECG',
    hindiHint: 'ब्लड प्रेशर और ईसीजी (हृदय सुरक्षा)',
    category: 'clinical_exam',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'BP quarterly; Resting ECG every 12 months from age 45+',
    timelineSlot: 'Month 2 • Clinic / Diagnostic Visit',
    inrRange: '₹250 – ₹500 (ECG)',
    whereInIndia: 'Walk-in diagnostic center or physician clinic (no prescription required for resting ECG; ask for female technician).',
    whyItMatters: 'Heart disease is the #1 cause of mortality in post-menopausal Indian women once natural estrogen protection declines.',
    prepNote: 'Wear a convenient two-piece outfit (kurta/top) for easy chest lead placement.'
  },
  hpv_vaccine: {
    id: 'hpv_vaccine',
    name: 'HPV Cervical Cancer Vaccine (Cervavac / Gardasil)',
    hindiHint: 'सर्वाइकल कैंसर बचाव टीका (Cervavac / HPV वैक्सीन)',
    category: 'vaccine',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: '2 doses (ages 9–14) or 3-dose catch-up series (ages 15–26; shared decision 27–45)',
    timelineSlot: 'One-Time Series (0, 2, 6 mos)',
    inrRange: '₹2,000/dose (Indigenous Cervavac) • ₹3,900–₹10,800/dose (Gardasil 4/9)',
    whereInIndia: 'Gynecologist / Pediatrician clinic or hospital immunization wing. India’s WHO-prequalified Cervavac cut vaccine cost by ~50%.',
    whyItMatters: 'Prevents high-risk HPV strains (16 & 18) responsible for >80% of cervical cancer cases in India. (Note: Vaccinated women still continue routine Pap/HPV screening!).',
    prepNote: 'Not given during pregnancy; complete remaining doses post-delivery if pregnancy starts mid-series.'
  },
  anc_vaccines: {
    id: 'anc_vaccines',
    name: 'Maternal Immunization (Td/Tdap + Inactivated Flu Shot)',
    hindiHint: 'गर्भावस्था टीकाकरण (टिटनस/Tdap व फ्लू)',
    category: 'vaccine',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: 'Per pregnancy per FOGSI immunization schedule (Tdap at 27–36 wks)',
    timelineSlot: '2nd / 3rd Trimester',
    inrRange: '₹0 (Govt Td) • ₹1,500 – ₹2,500 (Private Tdap/Flu)',
    whereInIndia: 'OB-GYN clinic or Government Maternal Health / Anganwadi immunization session.',
    whyItMatters: 'Passes protective maternal antibodies across the placenta to shield your newborn against pertussis (whooping cough), tetanus, and flu in the first months of life.',
    prepNote: 'Administered per your OB-GYN’s trimester schedule.'
  },
  folate_prep: {
    id: 'folate_prep',
    name: 'Pre-Conception Folic Acid & Dental/Medication Review',
    hindiHint: 'गर्भधारण से 3 माह पूर्व फोलिक एसिड व दवा समीक्षा',
    category: 'clinical_exam',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: 'Start 3 months prior to conception',
    timelineSlot: '3 Months Pre-Conception',
    inrRange: '₹500 – ₹1,000 (Pre-conception consult)',
    whereInIndia: 'OB-GYN clinic (also review any acne retinoids, BP, or thyroid meds for pregnancy safety).',
    whyItMatters: 'Neural tube closes in the first 28 days of pregnancy — often before a missed period test turns positive.',
    prepNote: 'Bring a list of all current supplements, skin creams, and prescription medicines.'
  },
  ppd_wellbeing: {
    id: 'ppd_wellbeing',
    name: 'Postpartum Mood, Sleep & Emotional Wellbeing Check (EPDS)',
    hindiHint: 'प्रसवोत्तर मानसिक स्वास्थ्य व नींद चेक-इन',
    category: 'clinical_exam',
    accessTier: 'direct_home',
    batchGroup: 'morning_fasting_home',
    frequency: 'At 2 weeks, 6 weeks, and 3–6 months post-delivery',
    timelineSlot: 'Weeks 2, 6 & Month 4 Postpartum',
    inrRange: '₹0 (Self-reflection + OB-GYN discussion)',
    whereInIndia: 'At home + discuss openly at 6-week OB-GYN or pediatrician visit (Tele-MANAS 14416 is also free 24×7 across India).',
    whyItMatters: 'Around 1 in 5 new mothers in India experience postpartum depression or anxiety, often hidden behind family pressure.',
    prepNote: 'Share honestly how *you* are feeling, sleeping, and coping — maternal health includes mind and body.'
  },
  pelvic_floor_check: {
    id: 'pelvic_floor_check',
    name: 'Postpartum Pelvic Floor & Core (Diastasis Recti) Assessment',
    hindiHint: 'पेल्विक फ्लोर और पेट की मांसपेशियों की रिकवरी जांच',
    category: 'clinical_exam',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Once at 6–10 weeks post-delivery (vaginal or C-section)',
    timelineSlot: 'Week 6–10 Postpartum',
    inrRange: '₹600 – ₹1,500',
    whereInIndia: 'OB-GYN 6-week checkup + Women’s Health Physiotherapist.',
    whyItMatters: 'Prevents chronic urine leak on coughing/sneezing, back pain, and later-life pelvic organ prolapse.',
    prepNote: 'Wait for 6-week surgical/perineal healing clearance before intensive abdominal workouts.'
  },
  eye_dental: {
    id: 'eye_dental',
    name: 'Comprehensive Eye (IOP Glaucoma/Retina) & Oral Cavity Check',
    hindiHint: 'आंखों (ग्लूकोमा/रेटिना) और दांत-मसूड़ों की जांच',
    category: 'clinical_exam',
    accessTier: 'diagnostic_center',
    batchGroup: 'imaging_clinic_visit',
    frequency: 'Every 12 months from age 45+ (or if diabetic)',
    timelineSlot: 'Month 6 • Mid-Year Wellness Check',
    inrRange: '₹500 – ₹1,200',
    whereInIndia: 'Ophthalmology & Dental clinic walk-in.',
    whyItMatters: 'Dry eyes, glaucoma pressure, cataract, and gum bone loss accelerate post-menopause; oral inspection is also part of India’s NP-NCD cancer screen.',
    prepNote: 'Carry current reading/distance spectacles.'
  },
  genetic_risk_consult: {
    id: 'genetic_risk_consult',
    name: 'Familial Cancer Risk & Genetic Counseling Discussion',
    hindiHint: 'पारिवारिक कैंसर जोखिम परामर्श (BRCA / Lynch)',
    category: 'clinical_exam',
    accessTier: 'rx_mandatory',
    batchGroup: 'specialist_obgyn',
    frequency: 'One-time specialist risk stratification',
    timelineSlot: 'Specialist Consult',
    inrRange: '₹1,000 – ₹2,000 (Counseling consult)',
    whereInIndia: 'Cancer genetics clinic at major hospitals (Tata Memorial, AIIMS, Apollo, Max, Manipal) before ordering any expensive gene panel.',
    whyItMatters: 'Clarifies whether family history warrants earlier breast MRI/mammography, ovarian ultrasound, or targeted BRCA/Lynch testing.',
    prepNote: 'Note down which blood relatives were affected and their approximate age at diagnosis.'
  }
};

export const ACCESS_TIERS_META = {
  direct_home: {
    label: 'Direct Path Lab / Home Sample (No GP Needed)',
    shortBadge: '🏠 Home / Walk-In Lab',
    badgeClass: 'badge-home',
    explain: 'In India, you can book a morning home phlebotomist or walk straight into NABL labs (Lal PathLabs, Metropolis, Thyrocare, Tata 1mg, Apollo, Redcliffe) without needing a doctor prescription first.'
  },
  diagnostic_center: {
    label: 'Diagnostic Center / Women’s Clinic Visit',
    shortBadge: '🏥 Clinic / Imaging Center',
    badgeClass: 'badge-clinic',
    explain: 'Performed in person at a radiology center or gynecologist clinic. Preventive walk-ins are widely accepted, though having a short doctor referral ensures exact parameters (like Endometrial Thickness in mm) are reported.'
  },
  rx_mandatory: {
    label: 'Doctor Prescription Mandatory (Legal / Specialist)',
    shortBadge: '📋 Doctor Rx Mandatory',
    badgeClass: 'badge-rx',
    explain: 'Requires a registered doctor/OB-GYN consultation or written prescription — including all pregnancy ultrasounds regulated under India’s PC-PNDT Act (Form F + Photo ID).'
  }
};

export const BATCH_GROUPS_META = {
  morning_fasting_home: {
    title: 'Batch 1: One Morning Fasting Home Draw',
    subtitle: '7:30–8:30 AM • 10–12 hr overnight water-only fast • Book together as a combo package to save 40–55%',
    icon: '🧪'
  },
  imaging_clinic_visit: {
    title: 'Batch 2: Half-Day Women’s Clinic & Imaging Visit',
    subtitle: 'Schedule 5–8 days after period ends (if menstruating) • Combine breast, cervical & scan checks in one trip',
    icon: '🏥'
  },
  specialist_obgyn: {
    title: 'Batch 3: Doctor-Guided / Prescription Milestones',
    subtitle: 'Reviewed directly with your Gynecologist / OB-GYN with your Batch 1 & 2 reports in hand',
    icon: '👩‍⚕️'
  }
};

// Build Personalized Care Plan for a Profile
export function buildPersonalizedPlan(profile) {
  const phaseObj = LIFE_PHASES.find((p) => p.id === profile.phase) || LIFE_PHASES[1];
  const testIds = new Set(phaseObj.baselineTests);

  const age = Number(profile.age) || 32;
  // Age-sensitive refinements aligned with Indian guidelines
  if (age < 21 && profile.phase === 'pre_menopausal') {
    testIds.delete('cervical_screen');
  }
  if (age < 30 && profile.phase === 'pre_menopausal' && !(profile.conditions || []).length) {
    // Keep baseline HbA1c/Lipids optional/recommended at 25+, always included 30+ per NP-NCD
    if (age < 25) {
      testIds.delete('lipid_profile');
    }
  }
  if (age >= 40 && (profile.phase === 'pre_menopausal' || profile.phase === 'peri_menopausal')) {
    testIds.add('mammogram_breast');
    testIds.add('lft_kft');
  }
  if (age > 26 && profile.phase !== 'teen') {
    // Above 26, HPV vaccine is shared clinical decision; keep focused on teen & 20-26 catch-up
    testIds.delete('hpv_vaccine');
  }
  if (age > 65 && profile.phase === 'senior') {
    // Cervical screening stops >65 if 3 prior negatives, keep optional note
    testIds.delete('cervical_screen');
  }

  // BMI Asian-Indian cutoff (>=23.0 overweight, >=25.0 obese)
  let bmi = null;
  if (profile.heightCm && profile.weightKg && profile.heightCm > 100 && profile.weightKg > 25) {
    const hM = Number(profile.heightCm) / 100;
    bmi = +(Number(profile.weightKg) / (hM * hM)).toFixed(1);
    if (bmi >= 23 && profile.phase !== 'pregnancy') {
      testIds.add('hba1c_fbs');
      testIds.add('lipid_profile');
    }
  }

  // Overlay Pre-existing Conditions
  const activeConditions = (profile.conditions || [])
    .map((cid) => CONDITIONS_CATALOG.find((c) => c.id === cid))
    .filter(Boolean);

  for (const cond of activeConditions) {
    for (const tid of cond.addedTests) {
      // Avoid non-pregnancy DEXA/mammogram during active pregnancy
      if (profile.phase === 'pregnancy' && (tid === 'dexa_bone' || tid === 'mammogram_breast')) continue;
      testIds.add(tid);
    }
  }

  const tests = Array.from(testIds)
    .map((id) => TESTS_MASTER[id])
    .filter(Boolean);

  // Estimate combined annual out-of-pocket range in INR (smart combo adjusted)
  let rawLow = 0;
  let rawHigh = 0;
  for (const t of tests) {
    const nums = (t.inrRange.match(/[\d,]+/g) || []).map((s) => Number(s.replace(/,/g, '')));
    if (nums.length >= 2) {
      rawLow += nums[0];
      rawHigh += nums[1];
    } else if (nums.length === 1) {
      rawLow += nums[0];
      rawHigh += nums[0];
    }
  }
  // Bundling blood tests in India typically saves ~35% vs individual MRP
  const bundledLow = Math.round((rawLow * 0.72) / 100) * 100;
  const bundledHigh = Math.round((rawHigh * 0.78) / 100) * 100;

  return {
    phase: phaseObj,
    bmi,
    bmiCategoryIndia:
      bmi === null
        ? null
        : bmi < 18.5
        ? 'Underweight (<18.5)'
        : bmi < 23.0
        ? 'Healthy Asian-Indian Range (18.5–22.9)'
        : bmi < 25.0
        ? 'Asian-Indian Overweight Alert (23.0–24.9)'
        : 'Asian-Indian Elevated Metabolic Risk (≥25.0)',
    activeConditions,
    tests,
    batches: {
      morning_fasting_home: tests.filter((t) => t.batchGroup === 'morning_fasting_home'),
      imaging_clinic_visit: tests.filter((t) => t.batchGroup === 'imaging_clinic_visit'),
      specialist_obgyn: tests.filter((t) => t.batchGroup === 'specialist_obgyn')
    },
    redFlags: phaseObj.redFlags,
    estimatedBundledInr: `₹${bundledLow.toLocaleString('en-IN')} – ₹${bundledHigh.toLocaleString('en-IN')}`
  };
}
