/**
 * Who is asking.
 *
 * Every question sent to the backend carries this envelope so the owner's log
 * shows a person rather than an anonymous row. Two halves:
 *
 *   - ambient   — id, session, page, referrer, timezone, screen. Free, and
 *                 always sent.
 *   - declared  — name and email (required before the first question) plus an
 *                 optional company, typed into the "who's asking" card and
 *                 remembered, so it is asked exactly once per browser.
 *
 * Nothing here is a login: the ids are random local labels that make repeat
 * visits recognisable, and the name/email are self-declared, not verified.
 */

const VISITOR_KEY = 'ai-portfolio-visitor-v1';
const IDENTITY_KEY = 'ai-portfolio-identity-v1';
const SESSION_KEY = 'ai-portfolio-session-v1';
const RESET_KEY = 'ai-portfolio-identity-reset-v1';

const randomId = (prefix) => {
    const raw =
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${prefix}-${raw.replace(/-/g, '').slice(0, 16)}`;
};

/** Read a key, tolerating private mode / disabled storage. */
function read(storage, key) {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
}

function write(storage, key, value) {
    try {
        storage.setItem(key, value);
    } catch {
        /* private mode — the id simply won't survive the reload */
    }
}

/** Stable across visits: the same browser is the same visitor id. */
function visitorId() {
    if (typeof localStorage === 'undefined') return '';
    let id = read(localStorage, VISITOR_KEY);
    if (!id) {
        id = randomId('v');
        write(localStorage, VISITOR_KEY, id);
    }
    return id;
}

/** Resets when the tab closes — one browsing session. */
function sessionId() {
    if (typeof sessionStorage === 'undefined') return '';
    let id = read(sessionStorage, SESSION_KEY);
    if (!id) {
        id = randomId('s');
        write(sessionStorage, SESSION_KEY, id);
    }
    return id;
}

const EMPTY_IDENTITY = { name: '', email: '', company: '' };

/** What the visitor chose to tell us about themselves, if anything. */
export function loadIdentity() {
    if (typeof localStorage === 'undefined') return { ...EMPTY_IDENTITY };
    try {
        const stored = JSON.parse(read(localStorage, IDENTITY_KEY) || '{}');
        return {
            name: String(stored.name || '').slice(0, 120),
            email: String(stored.email || '').slice(0, 180),
            company: String(stored.company || '').slice(0, 180),
        };
    } catch {
        return { ...EMPTY_IDENTITY };
    }
}

export function saveIdentity(identity) {
    const clean = {
        name: (identity.name || '').trim().slice(0, 120),
        email: (identity.email || '').trim().slice(0, 180),
        company: (identity.company || '').trim().slice(0, 180),
    };
    if (typeof localStorage !== 'undefined') {
        write(localStorage, IDENTITY_KEY, JSON.stringify(clean));
    }
    return clean;
}

/**
 * The owner wiped the log — so forget who this visitor said they were.
 *
 * Their details live here in the browser, out of the server's reach, so the
 * server publishes the timestamp of its last wipe and we compare. Only a
 * *newer* stamp clears anything: the backend's marker file lives on an
 * ephemeral disk, and a restart that loses it must not log everyone out.
 *
 * @param   {number}  serverResetAt Unix seconds from `/api/health` or the SSE
 *                                  `done` event. 0 = never wiped.
 * @returns {boolean} true if the stored identity was just discarded.
 */
export function syncIdentityReset(serverResetAt) {
    const stamp = Number(serverResetAt) || 0;
    if (!stamp || typeof localStorage === 'undefined') return false;

    const seen = Number(read(localStorage, RESET_KEY)) || 0;
    if (stamp <= seen) return false;

    write(localStorage, RESET_KEY, String(stamp));
    const hadIdentity = hasAnyIdentity();
    try {
        localStorage.removeItem(IDENTITY_KEY);
    } catch {
        /* nothing stored to begin with */
    }
    return hadIdentity;
}

function hasAnyIdentity() {
    const identity = loadIdentity();
    return Boolean(identity.name || identity.email || identity.company);
}

/** Loose on purpose: catches typos, not exotic-but-valid addresses. */
export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value || '').trim());
}

/**
 * Name and email are required before the first question goes through; the
 * company field is a nice-to-have. Anything less and the chat asks once.
 */
export function isIdentityComplete(identity) {
    return Boolean((identity?.name || '').trim().length >= 2 && isValidEmail(identity?.email));
}

/**
 * The full envelope sent with a question.
 *
 * @param {object} [extra] Per-message context: conversationId, turn.
 */
export function visitorContext({ conversationId = '', turn = null } = {}) {
    const identity = loadIdentity();

    let timezone = '';
    try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
        /* very old browser */
    }

    return {
        visitor_id: visitorId(),
        session_id: sessionId(),
        conversation_id: conversationId,
        turn,
        name: identity.name,
        email: identity.email,
        company: identity.company,
        page: typeof location !== 'undefined' ? location.href.slice(0, 500) : '',
        referrer: typeof document !== 'undefined' ? document.referrer.slice(0, 500) : '',
        timezone,
        screen:
            typeof window !== 'undefined' && window.screen
                ? `${window.screen.width}x${window.screen.height}`
                : '',
        browser_language: typeof navigator !== 'undefined' ? navigator.language || '' : '',
    };
}
