/**
 * Who is asking.
 *
 * Every question sent to the backend carries this envelope so the owner's log
 * shows a person rather than an anonymous row. Two halves:
 *
 *   - ambient   — id, session, page, referrer, timezone, screen. Free, and
 *                 always sent.
 *   - declared  — name, email, company, typed into the optional "who's asking"
 *                 card. Sent only once the visitor fills it in.
 *
 * Nothing here is a login: the ids are random local labels that make repeat
 * visits recognisable, not identities that can be verified.
 */

const VISITOR_KEY = 'ai-portfolio-visitor-v1';
const IDENTITY_KEY = 'ai-portfolio-identity-v1';
const SESSION_KEY = 'ai-portfolio-session-v1';

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

export function clearIdentity() {
    try {
        localStorage.removeItem(IDENTITY_KEY);
    } catch {
        /* ignore */
    }
    return { ...EMPTY_IDENTITY };
}

export function hasIdentity(identity) {
    return Boolean(identity?.name?.trim() || identity?.email?.trim());
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
