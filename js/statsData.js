// SwasthSakhi — India Women's Health Gap: Data, Epidemiology & Awareness Hub
// Sources: NFHS-5 (2019–21, Ministry of Health & Family Welfare, Govt of India),
// ICMR, FOGSI, Indian Menopause Society (IMS), GLOBOCAN India & Peer-Reviewed Tertiary Studies.

export const HERO_STATS = [
  {
    value: '1.9%',
    label: 'Indian women (30–49) ever screened for Cervical Cancer',
    sub: '98.1% unscreened • Urban 2.2% vs Rural 1.7%',
    source: 'NFHS-5, MoHFW India'
  },
  {
    value: '0.9%',
    label: 'Ever received a Clinical Breast Examination',
    sub: '>60% of cases present late at Stage III or IV',
    source: 'NFHS-5 & ICMR Registry'
  },
  {
    value: '57.0%',
    label: 'Women aged 15–49 in India are Anemic',
    sub: '59.1% of teen girls • 52.2% of pregnant women',
    source: 'NFHS-5 National Report'
  },
  {
    value: '46.2 yrs',
    label: 'Average age of natural Menopause in India',
    sub: '4–5 years earlier than Western 51–52 yr guidelines',
    source: 'Indian Menopause Society'
  }
];

export const SCREENING_GAP_BARS = [
  {
    label: 'Cervical Screening (Pap / VIA / HPV)',
    screenedPct: 1.9,
    targetPct: 70,
    note: 'WHO 2030 elimination target is 70% coverage; India stands at 1.9% nationally.'
  },
  {
    label: 'Clinical Breast Exam (Age 30–49)',
    screenedPct: 0.9,
    targetPct: 70,
    note: 'Breast cancer is now the #1 cancer in urban Indian women, yet <1% have had a clinical exam.'
  },
  {
    label: 'Oral Cavity Cancer Exam (Age 30–49)',
    screenedPct: 0.9,
    targetPct: 60,
    note: 'Included in India’s NP-NCD population screening from age 30, but uptake remains <1%.'
  },
  {
    label: 'Post-Menopausal DEXA Bone Check (Est.)',
    screenedPct: 4.5,
    targetPct: 65,
    note: 'Despite 30–60% post-menopausal osteoporosis prevalence, most women get scanned only AFTER a fracture.'
  }
];

export const STATE_CERVICAL_CONTRAST = [
  { region: 'Mizoram', pct: 10.1, tag: 'Highest North-East' },
  { region: 'Tamil Nadu', pct: 9.8, tag: 'Strong Public NCD Program' },
  { region: 'Kerala', pct: 4.7, tag: 'High Health Literacy' },
  { region: 'Maharashtra', pct: 2.3, tag: 'Above National Avg' },
  { region: 'All-India Average', pct: 1.9, tag: 'NFHS-5 Baseline', highlight: true },
  { region: 'Uttar Pradesh', pct: 1.5, tag: 'Large Population Gap' },
  { region: 'Gujarat', pct: 0.2, tag: 'Critical Screening Deficit' },
  { region: 'West Bengal', pct: 0.2, tag: 'Critical Screening Deficit' },
  { region: 'Assam', pct: 0.2, tag: 'Critical Screening Deficit' }
];

export const SILENT_DEFICIENCIES = [
  {
    name: 'Vitamin D Deficiency',
    rangePct: 82,
    display: '70% – 90%',
    impact: 'Blocks dietary calcium absorption, causing chronic back/leg aches and early osteopenia.'
  },
  {
    name: 'Anemia in Teenage Girls (15–19)',
    rangePct: 59.1,
    display: '59.1%',
    impact: 'Starts girls into adulthood and future pregnancies with depleted iron reserves.'
  },
  {
    name: 'Vitamin B12 Insufficiency',
    rangePct: 55,
    display: '40% – 70%',
    impact: 'Particularly widespread in vegetarian households; causes fatigue, brain fog & tingling nerves.'
  },
  {
    name: 'Post-Menopausal Osteoporosis',
    rangePct: 45,
    display: '30% – 60%',
    impact: '~80% of India’s 50–60M osteoporosis patients are women; fractures hit 10–20 yrs earlier than the West.'
  },
  {
    name: 'PCOS in Young Urban Women',
    rangePct: 16,
    display: '3.7% – 22.5%',
    impact: 'Tightly linked to South Asian insulin resistance and 4× higher future Type 2 Diabetes risk.'
  },
  {
    name: 'Thyroid Disorders (Mostly Hypothyroid)',
    rangePct: 11,
    display: '10% – 12%',
    impact: 'Affects women 4–5× more than men; mimics both PCOS in youth and perimenopause in midlife.'
  }
];

export const PMB_SPOTLIGHT = {
  title: 'Why Post-Menopausal Bleeding (PMB) Must Never Be Brushed Off',
  storyContext:
    'Many mothers and elders in Indian homes hesitate to mention spotting years after periods stop — assuming it is "heat in the body" or a harmless leftover flush.',
  stats: [
    { figure: '1.8% – 3.5%', caption: 'Post-menopausal women who experience PMB' },
    { figure: '75% – 90%', caption: 'Turn out BENIGN (atrophy, benign polyps, simple endometrial thickening)' },
    { figure: '10% – 25%', caption: 'Of Indian hospital PMB cases involve endometrial or cervical malignancy' },
    { figure: '≤ 4 mm', caption: 'Typical normal post-menopausal endometrial thickness reference on TVS scan' }
  ],
  takeaway:
    'Most causes ARE benign and treatable — which is why fear shouldn’t delay a checkup. A quick, non-surgical Transvaginal Ultrasound (TVS) + Gynecologist visit catches benign endometrial thickening early and rules out cancer when it is >90% curable.'
};

export const INDIA_BREAKTHROUGHS = [
  {
    badge: 'Made-in-India Vaccine',
    title: 'Cervavac (Indigenous HPV Vaccine)',
    body: 'Developed by Serum Institute of India & DBT and prequalified by WHO, Cervavac targets HPV types 6, 11, 16 & 18 (responsible for >80% of Indian cervical cancers) at roughly half the cost of imported vaccines.'
  },
  {
    badge: 'Privacy Breakthrough',
    title: 'HPV DNA Self-Sampling Swabs',
    body: 'Studies across Indian communities show >80% of women who avoid clinic speculum exams due to modesty or lack of female doctors willingly complete a simple private vaginal swab for HPV DNA.'
  },
  {
    badge: 'Home Lab Ecosystem',
    title: 'Direct NABL Morning Home Phlebotomy',
    body: 'Unlike Western healthcare systems requiring a GP wait for basic bloodwork, women in Indian cities and towns can book fasting CBC, Ferritin, TSH, HbA1c, Lipids, Vit D & B12 at home in one ₹1,200–₹2,000 package.'
  }
];

export const SHAREABLE_CARDS = [
  {
    id: 'mom_menopause',
    audience: 'For Moms, Aunts & 45+ Family Groups',
    title: '3 Things Every Indian Woman Over 45 Should Know',
    whatsappText:
      '🌸 *Health Note for the Women We Love (45+)* 🌸\n\n1️⃣ *Earlier Menopause in India:* Average menopause in India is ~46 yrs (5 yrs earlier than Western charts) — meaning bone (DEXA scan) & heart/lipid checks matter earlier.\n2️⃣ *Never Ignore Spotting:* ANY bleeding/spotting 12+ months after periods stop needs a prompt Gynecologist + TVS Ultrasound check (75–90% are benign like simple lining thickening, and checking early keeps you safe!).\n3️⃣ *Vitamin D + Calcium:* ~80% of Indian women are low in Vitamin D, weakening bones silently.\n\nCreate a free, private screening checklist on *SwasthSakhi* (no login needed)!'
  },
  {
    id: 'cervical_gap',
    audience: 'For Sisters, Friends & Women 25–60',
    title: 'Closing India’s 98% Cervical & Breast Screening Gap',
    whatsappText:
      '💡 *Did You Know? (NFHS-5 India Data)*\n\n• *98.1%* of Indian women aged 30–49 have NEVER had a cervical screening test.\n• *99.1%* have never had a clinical breast exam.\n• *57%* live with anemia, normalizing constant tiredness.\n\nCervical cancer is almost 100% preventable with timely Pap / HPV DNA screening ( every 3–5 yrs) + HPV vaccination (*Cervavac* for ages 9–26).\n\nCheck your personalised age-wise India health plan on *SwasthSakhi*!'
  },
  {
    id: 'young_women',
    audience: 'For Teens & Young Women (15–35)',
    title: 'Tiredness & Irregular Cycles Aren’t "Just Stress"',
    whatsappText:
      '🌱 *Quick Women’s Wellness Check (India)*\n\n• *59.1%* of teen girls in India have anemia — check *Serum Ferritin* + *Vitamin B12*, not just Hemoglobin!\n• Women are *4–5×* more likely to have Thyroid shifts.\n• Planning a baby soon? Check *Rubella IgG*, *Thalassemia HPLC*, *TSH*, and start *Folic Acid* 3 months ahead.\n\nExplore your free, private checklist on *SwasthSakhi*!'
  }
];
