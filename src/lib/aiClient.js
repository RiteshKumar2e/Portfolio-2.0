/**
 * Client for the AI representative backend.
 *
 * The chat endpoint returns Server-Sent Events; we read the response body as a
 * stream and hand each token to a callback so the UI can type it out live.
 */

// The deployed backend is the default for every environment — local dev at
// localhost:3000 and production at riteshkr.info both talk to Render, so no
// local Python process is needed. Override with VITE_AI_API_URL to point at a
// backend running on your own machine.
const API_BASE = (
    import.meta.env.VITE_AI_API_URL || 'https://portfolio-q17g.onrender.com'
).replace(/\/$/, '');

export const AI_API_BASE = API_BASE;

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function readError(response) {
    try {
        const body = await response.json();
        if (typeof body.detail === 'string') return body.detail;
        if (Array.isArray(body.detail)) return body.detail[0]?.msg || 'Invalid request.';
    } catch {
        /* fall through to the generic message */
    }
    return `Request failed (${response.status}).`;
}

/**
 * Stream an answer.
 *
 * @param {object}   options
 * @param {string}   options.message         The visitor's question.
 * @param {Array}    options.history         Prior turns: [{ role, content }].
 * @param {string}   [options.language]      'auto' | 'en' | 'hi'
 * @param {Function} options.onToken         Called with each text chunk.
 * @param {Function} [options.onDone]        Called with { model } — which model
 *                                           answered, after the fallback chain.
 * @param {AbortSignal} [options.signal]     Lets the UI stop generation.
 * @param {object}   [options.visitor]       Who is asking — recorded in the
 *                                           owner's question log.
 */
export async function streamChat({
    message,
    history = [],
    language = 'auto',
    visitor = null,
    onToken,
    onDone,
    signal,
}) {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            history,
            language,
            visitor,
        }),
        signal,
    });

    if (!response.ok) {
        throw new ApiError(await readError(response), response.status);
    }
    if (!response.body) {
        throw new ApiError('Streaming is not supported by this browser.', 0);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let streamError = null;

    // SSE frames are separated by a blank line; a frame may arrive split across
    // network chunks, so we only consume complete frames from the buffer.
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';

        for (const frame of frames) {
            let event = 'message';
            let data = '';

            for (const line of frame.split('\n')) {
                if (line.startsWith('event:')) event = line.slice(6).trim();
                else if (line.startsWith('data:')) data += line.slice(5).trim();
            }
            if (!data) continue;

            let payload;
            try {
                payload = JSON.parse(data);
            } catch {
                continue;
            }

            if (event === 'token' && payload.text) onToken(payload.text);
            else if (event === 'error') streamError = payload.detail;
            else if (event === 'done') onDone?.(payload);
        }
    }

    if (streamError) throw new ApiError(streamError, 502);
}

/** Liveness check — used to show an honest status dot in the UI. */
export async function checkHealth() {
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) throw new ApiError('Backend is unreachable.', response.status);
    return response.json();
}

// --------------------------------------------------------------------------
// Owner-only. Every call needs the ADMIN_TOKEN; the backend answers 401
// without it, so these are useless to a visitor who finds them in the bundle.
// --------------------------------------------------------------------------

async function adminGet(path, token) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: { 'X-Admin-Token': token },
    });
    if (!response.ok) throw new ApiError(await readError(response), response.status);
    return response.json();
}

/** Every question ever asked, newest first. */
export function fetchChatLog({ token, limit = 50, offset = 0, search = '' }) {
    const query = new URLSearchParams({ limit, offset, search });
    return adminGet(`/api/admin/chats?${query}`, token);
}

export function fetchChatLogStats(token) {
    return adminGet('/api/admin/chats/stats', token);
}

/** Download link for the Excel workbook (the token rides in the query string
 *  because a plain browser download cannot send a header). */
export function chatLogExportUrl(token, format = 'xlsx') {
    const query = new URLSearchParams({ token, format });
    return `${API_BASE}/api/admin/chats/export?${query}`;
}

/** Erase the entire log. Owner only — there is no visitor-facing path to this. */
export async function deleteAllChatLogs(token) {
    const response = await fetch(`${API_BASE}/api/admin/chats?confirm=DELETE-ALL`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token },
    });
    if (!response.ok) throw new ApiError(await readError(response), response.status);
    return response.json();
}
