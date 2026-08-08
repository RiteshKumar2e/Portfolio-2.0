/**
 * Client for the AI representative backend.
 *
 * The chat endpoint returns Server-Sent Events; we read the response body as a
 * stream and hand each token to a callback so the UI can type it out live.
 */

const API_BASE = (
    import.meta.env.VITE_AI_API_URL || 'http://localhost:8000'
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
 * @param {string}   [options.jobDescription] Pasted JD, if the recruiter set one.
 * @param {string}   [options.language]      'auto' | 'en' | 'hi'
 * @param {Function} options.onToken         Called with each text chunk.
 * @param {Function} [options.onDone]        Called with { model } — which model
 *                                           answered, after the fallback chain.
 * @param {AbortSignal} [options.signal]     Lets the UI stop generation.
 */
export async function streamChat({
    message,
    history = [],
    jobDescription = null,
    language = 'auto',
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
            job_description: jobDescription || null,
            language,
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

async function postJson(path, body) {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(await readError(response), response.status);
    return response.json();
}

/** Structured suitability report for a pasted job description. */
export function matchJobDescription(jobDescription) {
    return postJson('/api/match', { job_description: jobDescription });
}

/** Interview questions grounded in the profile (optionally targeted at a JD). */
export function generateInterviewQuestions({ jobDescription = null, focus = 'mixed', count = 6 } = {}) {
    return postJson('/api/interview-questions', {
        job_description: jobDescription || null,
        focus,
        count,
    });
}

/** Liveness check — used to show an honest status dot in the UI. */
export async function checkHealth() {
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) throw new ApiError('Backend is unreachable.', response.status);
    return response.json();
}
