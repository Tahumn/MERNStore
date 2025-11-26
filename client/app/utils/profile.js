const PROFILE_QUERY_KEY = 'profile';
const PROFILE_SESSION_KEY = 'mern_profile_id';
const DEFAULT_PROFILE = 'default';
const ADMIN_PROFILE = 'admin';
const MERCHANT_PROFILE = 'merchant';
const TOKEN_PREFIX = 'token:';
const LEGACY_TOKEN_KEY = 'token';

export const PROFILE_KEYS = {
  Default: DEFAULT_PROFILE,
  Admin: ADMIN_PROFILE,
  Merchant: MERCHANT_PROFILE
};

const sanitizeProfile = value => {
  if (!value) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
};

const resolveProfile = value => sanitizeProfile(value) || null;

const getTokenKey = profile => `${TOKEN_PREFIX}${profile}`;

export const setActiveProfile = profile => {
  const resolvedProfile = resolveProfile(profile) || DEFAULT_PROFILE;
  sessionStorage.setItem(PROFILE_SESSION_KEY, resolvedProfile);
  return resolvedProfile;
};

export const getActiveProfile = () => {
  const params = new URLSearchParams(window.location.search);
  const queryProfile = resolveProfile(params.get(PROFILE_QUERY_KEY));

  if (queryProfile) {
    return setActiveProfile(queryProfile);
  }

  const cachedProfile = sessionStorage.getItem(PROFILE_SESSION_KEY);
  if (cachedProfile) {
    return cachedProfile;
  }

  return setActiveProfile(DEFAULT_PROFILE);
};

export const getProfileToken = () => {
  const profile = getActiveProfile();
  const storageKey = getTokenKey(profile);
  const token = localStorage.getItem(storageKey);

  if (token) {
    return token;
  }

  if (profile === DEFAULT_PROFILE) {
    const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);

    if (legacyToken) {
      localStorage.setItem(storageKey, legacyToken);
      return legacyToken;
    }
  }

  return null;
};

export const setProfileToken = token => {
  const profile = getActiveProfile();
  const storageKey = getTokenKey(profile);

  if (token) {
    localStorage.setItem(storageKey, token);

    if (profile === DEFAULT_PROFILE) {
      localStorage.setItem(LEGACY_TOKEN_KEY, token);
    }
    return;
  }

  localStorage.removeItem(storageKey);

  if (profile === DEFAULT_PROFILE) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
};

export const clearProfileToken = () => {
  setProfileToken(null);
};

export const getProfileQueryKey = () => PROFILE_QUERY_KEY;
