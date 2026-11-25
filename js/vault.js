// SwasthSakhi — User Journey Vault & Demo State Manager
// Ensures first-time visitors land on the Data & Story Hook page (NOT random demo profiles),
// can optionally try the interactive Demo (Maa & Ananya), or build their own clean profile.

const STORAGE_INDEX_KEY = 'swasthsakhi_vault_index_v2';
const ACTIVE_VAULT_KEY = 'swasthsakhi_active_code_v2';
const PREFS_KEY = 'swasthsakhi_ui_prefs_v2';

const WORD_BANK_1 = [
  'tulsi', 'lotus', 'jasmine', 'marigold', 'chandan', 'kesar', 'diya', 'peacock', 'amla', 'neem', 'gulab', 'mogra'
];
const WORD_BANK_2 = [
  'pearl', 'amber', 'silk', 'coral', 'silver', 'river', 'breeze', 'meadow', 'garden', 'cloud', 'star', 'crystal'
];
const WORD_BANK_3 = [
  'sunrise', 'dawn', 'asha', 'kiran', 'tara', 'shanti', 'jyoti', 'sakhi', 'light', 'spring', 'bloom', 'smile'
];

export function generateThreeWordKey() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(WORD_BANK_1)}-${pick(WORD_BANK_2)}-${pick(WORD_BANK_3)}`;
}

export function normalizeThreeWordKey(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-@.+]/g, '');
}

export function suggestPhaseForAge(age, relation = 'Self') {
  const n = Number(age) || 30;
  if (n < 20) return 'teen';
  if (n < 40) return 'pre_menopausal';
  if (n < 47) return 'peri_menopausal';
  if (n < 51) return 'menopause';
  if (n < 65) return 'post_menopause';
  return 'senior';
}

export function createDemoProfiles() {
  return [
    {
      id: 'demo_maa',
      name: 'Maa (Mother)',
      relation: 'Mother',
      age: 56,
      heightCm: 156,
      weightKg: 64,
      phase: 'post_menopause',
      conditions: ['endometrial_pmb', 'bone_joint', 'vegetarian'],
      completedTests: {
        cbc_ferritin: '2026-09-12',
        pelvic_tvs_usg: '2026-10-04',
        dexa_bone: '2026-10-18'
      },
      labReports: [
        {
          id: 'rep_maa_1',
          date: '2026-10-04',
          note: 'Post-spotting follow-up (benign lining thickening)',
          values: {
            hemoglobin: 11.4,
            ferritin: 19,
            hba1c: 5.9,
            tsh: 4.8,
            vit_d: 16,
            vit_b12: 195,
            ldl: 138,
            tvs_et_mm: 5.5,
            dexa_tscore: -1.8
          }
        }
      ]
    },
    {
      id: 'demo_ananya',
      name: 'Ananya',
      relation: 'Self',
      age: 31,
      heightCm: 161,
      weightKg: 61,
      phase: 'pre_menopausal',
      conditions: ['pcos', 'thyroid'],
      completedTests: {
        tsh_screen: '2026-08-18',
        cbc_ferritin: '2026-08-18'
      },
      labReports: [
        {
          id: 'rep_self_1',
          date: '2026-08-18',
          note: 'Annual morning fasting blood draw',
          values: {
            hemoglobin: 11.6,
            ferritin: 14,
            hba1c: 5.6,
            fasting_glucose: 96,
            fasting_insulin: 14.2,
            tsh: 3.9,
            vit_d: 18,
            vit_b12: 240,
            ldl: 112
          }
        }
      ]
    }
  ];
}

function safeGet(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function safeSet(key, val) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
  } catch (_) {}
}

export function loadUIPrefs() {
  return (
    safeGet(PREFS_KEY) || {
      lang: 'en',
      largeText: false
    }
  );
}

export function saveUIPrefs(prefs) {
  safeSet(PREFS_KEY, prefs);
}

// Returns null if the user has not created/signed into a personal vault yet (so we show Landing!)
export function loadUserVaultOrNull() {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const activeCode = safeGet(ACTIVE_VAULT_KEY);
  if (activeCode && index[activeCode] && Array.isArray(index[activeCode].profiles) && index[activeCode].profiles.length > 0) {
    return index[activeCode];
  }
  return null;
}

export function createDemoSessionVault() {
  return {
    vaultCode: 'demo-preview',
    isDemo: true,
    isGuest: true,
    contactAlias: '',
    createdAt: new Date().toISOString().slice(0, 10),
    activeProfileId: 'demo_maa',
    profiles: createDemoProfiles()
  };
}

export function saveVault(vault) {
  if (!vault || vault.isDemo) return; // Keep demo changes ephemeral in memory
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  index[vault.vaultCode] = vault;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, vault.vaultCode);
}

export function createPersonalVaultFromOnboarding(firstProfile, { threeWordCode = '', contactAlias = '' } = {}) {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const cleanCode = normalizeThreeWordKey(threeWordCode);
  const cleanAlias = String(contactAlias || '').trim().toLowerCase();
  const isNamedKey = Boolean(cleanCode);
  const vaultCode = cleanCode || 'local-personal';

  const newVault = {
    vaultCode,
    isDemo: false,
    isGuest: !isNamedKey,
    contactAlias: cleanAlias,
    createdAt: new Date().toISOString().slice(0, 10),
    activeProfileId: firstProfile.id,
    profiles: [firstProfile]
  };

  index[vaultCode] = newVault;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, vaultCode);
  return newVault;
}

export function signInExistingVault({ threeWordCode, contactAlias }) {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const cleanCode = normalizeThreeWordKey(threeWordCode);
  const cleanAlias = String(contactAlias || '').trim().toLowerCase();

  if (cleanCode && index[cleanCode]) {
    safeSet(ACTIVE_VAULT_KEY, cleanCode);
    return index[cleanCode];
  }

  if (cleanAlias) {
    const matched = Object.values(index).find(
      (v) => v.contactAlias && v.contactAlias.toLowerCase() === cleanAlias
    );
    if (matched) {
      safeSet(ACTIVE_VAULT_KEY, matched.vaultCode);
      return matched;
    }
  }
  return null;
}

export function upgradeVaultWithSakhiKey(currentVault, { threeWordCode, contactAlias }) {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const cleanCode = normalizeThreeWordKey(threeWordCode) || generateThreeWordKey();
  const cleanAlias = String(contactAlias || '').trim().toLowerCase();

  // Check if switching to another already-saved vault
  if (index[cleanCode] && cleanCode !== currentVault.vaultCode) {
    safeSet(ACTIVE_VAULT_KEY, cleanCode);
    return { vault: index[cleanCode], mode: 'switched' };
  }

  const updated = {
    ...JSON.parse(JSON.stringify(currentVault)),
    vaultCode: cleanCode,
    isDemo: false,
    isGuest: false,
    contactAlias: cleanAlias
  };

  index[cleanCode] = updated;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, cleanCode);
  return { vault: updated, mode: 'saved' };
}

export function clearActiveSessionToLanding() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ACTIVE_VAULT_KEY);
    }
  } catch (_) {}
}

export function listSavedVaultSummaries() {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  return Object.values(index).map((v) => ({
    vaultCode: v.vaultCode,
    isGuest: !!v.isGuest,
    contactAlias: v.contactAlias || '',
    profileCount: (v.profiles || []).length,
    names: (v.profiles || []).map((p) => p.name).join(', ')
  }));
}
