# 🌸 SwasthSakhi — Women's Preventive Health, Screening Plan & Awareness App (India)

A phone-first, offline-capable Progressive Web App (PWA) designed to close the preventive health and cancer screening gap for women in India — from **adolescence (13–19)** through **reproductive years, pregnancy, postpartum, perimenopause, menopause, post-menopause, and senior years (65+)**.

## Why SwasthSakhi?
- **98.1%** of Indian women aged 30–49 have *never* had cervical cancer screening, and **99.1%** have never had a clinical breast exam (*NFHS-5, MoHFW India*).
- **57.0%** of women (15–49) and **59.1%** of teenage girls in India live with anemia.
- Indian women reach natural menopause **4–5 years earlier** (~46.2 years) than Western clinical defaults (51–52 years), requiring earlier bone density (DEXA), cardiometabolic, and endometrial awareness.

## Key Features
1. **Life-Stage + Pre-Existing Condition Care Plan (`Care Plan` Tab)**
   - Covers 9 life stages (*Teenage, Pre-Menopausal, Pre-Pregnancy, Pregnancy, Postpartum, Perimenopause, Menopause, Post-Menopause, Senior 65+*) and 10 condition overlays (*PCOS, Thyroid, Anemia, Fibroids/Endometriosis, Past Post-Menopausal Bleeding/Endometrial Thickening, Diabetes/GDM, Hypertension, Osteopenia/Osteoporosis, Familial Cancer Risk, Vegetarian B12 focus*).
   - **Never-Ignore Red-Flag Watchlist** per life stage (e.g., immediate Transvaginal Ultrasound & Gynecologist check for any post-menopausal spotting).
   - **India Lab & Legal Access Badges**:
     - `🏠 Home / Walk-In Lab` — Direct NABL pathology lab or home phlebotomy without needing a GP prescription (*Lal PathLabs, Metropolis, Thyrocare, Tata 1mg, Apollo, Redcliffe*).
     - `🏥 Clinic / Imaging Center` — Mammogram/Sono-mammography, DEXA scan, Pap/HPV DNA test, Pelvic/TVS Ultrasound.
     - `📋 Doctor Rx Mandatory` — Specialist care & legally regulated scans (including **PC-PNDT Act Form F + ID** requirement for all pregnancy ultrasounds).
   - **Smart Batching & Cost Estimator** — Groups annual blood tests into *1 Morning Fasting Home Draw* + *1 Half-Day Clinic/Imaging Visit* with realistic ₹ INR combo estimates.

2. **Interactive Yearly Checklist & 12-Month Timeline (`Checklist` Tab)**
   - Check off completed tests with date stamps, inspect preparation tips (fasting hours, cycle-day timing), and generate a **Doctor Visit Summary Sheet**.

3. **Non-Medical Test Result Literacy Analyser (`Lab Check` Tab)**
   - Strictly educational, non-diagnostic interpretation across **11 blood & imaging markers** (*Hemoglobin, Serum Ferritin, TSH, HbA1c, Fasting Glucose, Fasting Insulin + HOMA-IR, Vitamin D, Vitamin B12, LDL Cholesterol, TVS Endometrial Thickness in mm, and DEXA T-score*).
   - **Smart Paste Parser**: Paste text from Indian lab reports/SMS to auto-fill numbers.
   - Generates polite, structured **"Questions to Ask Your Gynecologist / Doctor"**.

4. **India Data & Stats Awareness Hub (`Data & Gap` Tab)**
   - Visualizes NFHS-5, ICMR, FOGSI & Indian Menopause Society statistics, state-level disparities, the Post-Menopausal Bleeding spotlight, *Cervavac* indigenous HPV vaccine & HPV self-sampling breakthroughs, and **1-tap WhatsApp Share Cards**.

5. **Inclusive Access & All 22 Indian Languages (`Family` Tab + Header)**
   - **Login-Free Instant Mode** out of the box + memorable **3-Word Sakhi Key** (`tulsi-pearl-sunrise`) + optional Phone/Email lookup + Family Circle multi-profile switcher (*Maa, Self, Sister, Mother-in-Law*) + Elder-friendly `A+` large text mode + **22 Scheduled Indian Languages**.

## Run Locally (Zero Dependencies Needed)
```bash
cd /Users/sid/Documents/Dev/swasthsakhi
python3 -m http.server 8090
```
Open `http://localhost:8090` on your browser or phone.

## Run Automated Unit Tests
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m tests/run-tests.js
```
