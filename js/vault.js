// SwasthSakhi — Accessible Zero-Friction & 3-Word "Sakhi Key" Vault
// Supports:
// 1. Instant Login-Free Guest Mode (works immediately with starter Self + Maa profiles)
// 2. Smart 3-Word Sakhi Passphrase (e.g. "tulsi-pearl-sunrise") — memorable for elders & non-tech users
// 3. Optional Phone / Email local lookup tag + 1-tap JSON backup/restore

const STORAGE_INDEX_KEY = 'swasthsakhi_vault_index_v1';
const ACTIVE_VAULT_KEY = 'swasthsakhi_active_code_v1';
const PREFS_KEY = 'swasthsakhi_ui_prefs_v1';

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

export function createStarterProfiles() {
  return [
    {
      id: 'prof_maa',
      name: 'Maa (Mother)',
      relation: 'Mother',
      age: 56,
      heightCm: 156,
      weightKg: 64,
      phase: 'post_menopause',
      conditions: ['endometrial_pmb', 'bone_joint', 'vegetarian'],
      completedTests: {
        cbc_ferritin: '2026-09-12',
        pelvic_tvs_usg: '2026-10-04'
      },
      labReports: [
        {
          id: 'rep_maa_1',
          date: '2026-10-04',
          note: 'Post-spotting checkup (benign endometrial thickening follow-up)',
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
      id: 'prof_self',
      name: 'Ananya (Self)',
      relation: 'Self',
      age: 31,
      heightCm: 161,
      weightKg: 61,
      phase: 'pre_menopausal',
      conditions: ['pcos', 'thyroid'],
      completedTests: {
        tsh_screen: '2026-08-18'
      },
      labReports: [
        {
          id: 'rep_self_1',
          date: '2026-08-18',
          note: 'Annual morning fasting wellness draw',
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

export function loadActiveVault() {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const activeCode = safeGet(ACTIVE_VAULT_KEY) || 'guest-local';

  if (index[activeCode]) {
    return index[activeCode];
  }

  // Create immediate login-free guest vault so anyone can use the app right away
  const guestVault = {
    vaultCode: 'guest-local',
    isGuest: true,
    contactAlias: '',
    createdAt: new Date().toISOString().slice(0, 10),
    activeProfileId: 'prof_maa',
    profiles: createStarterProfiles()
  };
  index['guest-local'] = guestVault;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, 'guest-local');
  return guestVault;
}

export function saveVault(vault) {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  index[vault.vaultCode] = vault;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, vault.vaultCode);
}

// Upgrade Guest Mode or create a Smart 3-Word Sakhi Key (+ optional email/phone alias)
export function registerOrSwitchVault({ threeWordCode, contactAlias, keepCurrentProfiles = true }) {
  const index = safeGet(STORAGE_INDEX_KEY) || {};
  const cleanCode = normalizeThreeWordKey(threeWordCode);
  const cleanAlias = String(contactAlias || '').trim().toLowerCase();

  // Check if user entered an existing 3-word code OR matching phone/email alias
  if (cleanCode && index[cleanCode]) {
    safeSet(ACTIVE_VAULT_KEY, cleanCode);
    return { vault: index[cleanCode], mode: 'restored' };
  }

  if (cleanAlias) {
    const matched = Object.values(index).find(
      (v) => v.contactAlias && v.contactAlias.toLowerCase() === cleanAlias
    );
    if (matched) {
      safeSet(ACTIVE_VAULT_KEY, matched.vaultCode);
      return { vault: matched, mode: 'restored' };
    }
  }

  const current = loadActiveVault();
  const assignedCode = cleanCode || generateThreeWordKey();
  const newVault = {
    vaultCode: assignedCode,
    isGuest: false,
    contactAlias: cleanAlias,
    createdAt: new Date().toISOString().slice(0, 10),
    activeProfileId: keepCurrentProfiles ? current.activeProfileId : 'prof_1',
    profiles: keepCurrentProfiles
      ? JSON.parse(JSON.stringify(current.profiles))
      : [
          {
            id: 'prof_1',
            name: 'My Health Profile',
            relation: 'Self',
            age: 35,
            heightCm: 158,
            weightKg: 58,
            phase: 'pre_menopausal',
            conditions: [],
            completedTests: {},
            labReports: []
          }
        ]
  };

  index[assignedCode] = newVault;
  safeSet(STORAGE_INDEX_KEY, index);
  safeSet(ACTIVE_VAULT_KEY, assignedCode);
  return { vault: newVault, mode: 'created' };
}

export function switchToGuestExplore() {
  safeSet(ACTIVE_VAULT_KEY, 'guest-local');
  return loadActiveVault();
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
