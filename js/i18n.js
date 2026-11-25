// SwasthSakhi — Multilingual Support Across Indian Languages
// Combines instant offline UI translations for major scripts + Google Translate Web Bridge
// for full-document translation across India's scheduled languages.

export const INDIAN_LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { code: 'ur', native: 'اردو', english: 'Urdu' },
  { code: 'mai', native: 'मैथिली', english: 'Maithili' },
  { code: 'ne', native: 'नेपाली', english: 'Nepali' },
  { code: 'kok', native: 'कोंकणी', english: 'Konkani' },
  { code: 'sd', native: 'सिन्धी / سنڌي', english: 'Sindhi' },
  { code: 'doi', native: 'डोगरी', english: 'Dogri' },
  { code: 'mni', native: 'মৈতৈলোন্', english: 'Manipuri' },
  { code: 'sat', native: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali' },
  { code: 'ks', native: 'कॉशुर / کٲشُر', english: 'Kashmiri' },
  { code: 'sa', native: 'संस्कृतम्', english: 'Sanskrit' }
];

const UI_STRINGS = {
  en: {
    appTagline: 'India Women’s Preventive Health & Care Plan',
    safetyNotice: 'Educational wellness guide — not medical diagnosis or prescription.',
    navPlan: 'Care Plan',
    navChecklist: 'Checklist',
    navAnalyzer: 'Lab Check',
    navStats: 'Data & Gap',
    navProfiles: 'Family',
    langBtn: 'अ/A'
  },
  hi: {
    appTagline: 'भारतीय महिलाओं का स्वास्थ्य व जांच प्लान',
    safetyNotice: 'केवल स्वास्थ्य जागरूकता — यह डॉक्टरी सलाह या इलाज नहीं है।',
    navPlan: 'हेल्थ प्लान',
    navChecklist: 'चेकलिस्ट',
    navAnalyzer: 'रिपोर्ट समझें',
    navStats: 'आंकड़े',
    navProfiles: 'परिवार',
    langBtn: 'हिन्दी'
  },
  bn: {
    appTagline: 'ভারতীয় নারীদের স্বাস্থ্য ও স্ক্রিনিং প্ল্যান',
    safetyNotice: 'স্বাস্থ্য সচেতনতা গাইড — এটি ডাক্তারি পরামর্শ নয়।',
    navPlan: 'হেলথ প্ল্যান',
    navChecklist: 'চেকলিস্ট',
    navAnalyzer: 'রিপোর্ট বুঝুন',
    navStats: 'তথ্য ও পরিসংখ্যান',
    navProfiles: 'পরিবার',
    langBtn: 'বাংলা'
  },
  te: {
    appTagline: 'భారతీయ మహిళల ఆరోగ్య & స్క్రీనింగ్ ప్లాన్',
    safetyNotice: 'ఆరోగ్య అవగాహన మాత్రమే — వైద్య నిర్ధారణ కాదు.',
    navPlan: 'హెల్త్ ప్లాన్',
    navChecklist: 'చెక్‌లిస్ట్',
    navAnalyzer: 'రిపోర్ట్ విశ్లేషణ',
    navStats: 'గణాంకాలు',
    navProfiles: 'కుటుంబం',
    langBtn: 'తెలుగు'
  },
  mr: {
    appTagline: 'भारतीय महिलांसाठी आरोग्य व तपासणी प्लॅन',
    safetyNotice: 'केवळ आरोग्य जनजागृती — हा वैद्यकीय सल्ला नाही.',
    navPlan: 'हेल्थ प्लॅन',
    navChecklist: 'चेकलिस्ट',
    navAnalyzer: 'रिपोर्ट समजून घ्या',
    navStats: 'आकडेवारी',
    navProfiles: 'कुटुंब',
    langBtn: 'मराठी'
  },
  ta: {
    appTagline: 'இந்திய பெண்களுக்கான ஆரோக்கிய பரிசோதனை திட்டம்',
    safetyNotice: 'விழிப்புணர்வு வழிகாட்டி மட்டுமே — மருத்துவ ஆலோசனை அல்ல.',
    navPlan: 'நலத் திட்டம்',
    navChecklist: 'பட்டியல்',
    navAnalyzer: 'ரிப்போர்ட்',
    navStats: 'புள்ளிவிவரம்',
    navProfiles: 'குடும்பம்',
    langBtn: 'தமிழ்'
  },
  gu: {
    appTagline: 'ભારતીય મહિલાઓ માટે આરોગ્ય અને તપાસ પ્લાન',
    safetyNotice: 'માત્ર આરોગ્ય જાગૃતિ — આ તબીબી સલાહ નથી.',
    navPlan: 'હેલ્થ પ્લાન',
    navChecklist: 'ચેકલિસ્ટ',
    navAnalyzer: 'રિપોર્ટ સમજો',
    navStats: 'આંકડા',
    navProfiles: 'પરિવાર',
    langBtn: 'ગુજરાતી'
  },
  kn: {
    appTagline: 'ಭಾರತೀಯ ಮಹಿಳೆಯರ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಯೋಜನೆ',
    safetyNotice: 'ಆರೋಗ್ಯ ಜಾಗೃತಿ ಮಾತ್ರ — ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ.',
    navPlan: 'ಆರೋಗ್ಯ ಯೋಜನೆ',
    navChecklist: 'ಪಟ್ಟಿ',
    navAnalyzer: 'ವರದಿ ತಿಳಿಯಿರಿ',
    navStats: 'ಅಂಕಿಅಂಶ',
    navProfiles: 'ಕುಟುಂಬ',
    langBtn: 'ಕನ್ನಡ'
  },
  ml: {
    appTagline: 'ഇന്ത്യൻ സ്ത്രീകൾക്കായുള്ള ആരോഗ്യ പരിശോധനാ പ്ലാൻ',
    safetyNotice: 'ആരോഗ്യ അവബോധം മാത്രം — വൈദ്യോപദേശമല്ല.',
    navPlan: 'ഹെൽത്ത് പ്ലാൻ',
    navChecklist: 'ചെക്ക്‌ലിസ്റ്റ്',
    navAnalyzer: 'റിപ്പോർട്ട്',
    navStats: 'കണക്കുകൾ',
    navProfiles: 'കുടുംബം',
    langBtn: 'മലയാളം'
  },
  pa: {
    appTagline: 'ਭਾਰਤੀ ਮਹਿਲਾਵਾਂ ਲਈ ਸਿਹਤ ਅਤੇ ਜਾਂਚ ਪਲਾਨ',
    safetyNotice: 'ਸਿਰਫ਼ ਸਿਹਤ ਜਾਗਰੂਕਤਾ — ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ।',
    navPlan: 'ਹੈਲਥ ਪਲਾਨ',
    navChecklist: 'ਚੈੱਕਲਿਸਟ',
    navAnalyzer: 'ਰਿਪੋਰਟ ਸਮਝੋ',
    navStats: 'ਅੰਕੜੇ',
    navProfiles: 'ਪਰਿਵਾਰ',
    langBtn: 'ਪੰਜਾਬੀ'
  }
};

export function tUI(langCode, key) {
  const dict = UI_STRINGS[langCode] || UI_STRINGS.en;
  return dict[key] || UI_STRINGS.en[key] || key;
}

export function applyLanguagePreference(langCode) {
  if (typeof document === 'undefined') return;
  const target = langCode || 'en';
  document.documentElement.lang = target;

  // Drive Google Translate Web Element for full-page translation across all 22 Indian languages
  try {
    if (target === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      const isTranslatedDom =
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl');
      if (isTranslatedDom) {
        window.location.reload();
        return;
      }
    } else {
      document.cookie = `googtrans=/en/${target}; path=/; SameSite=Lax`;
      const combo = document.querySelector('#google_translate_element select.goog-te-combo');
      if (combo && combo.value !== target) {
        combo.value = target;
        combo.dispatchEvent(new Event('change'));
      }
    }
  } catch (_) {
    // Graceful no-op when offline or running in headless unit tests
  }
}
