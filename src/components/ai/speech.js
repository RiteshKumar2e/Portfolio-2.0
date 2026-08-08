import { useCallback, useEffect, useRef, useState } from 'react';

/** Voice input via the Web Speech API. Degrades silently where unsupported. */
export function useSpeechInput({ onResult, language = 'en-IN' } = {}) {
    const [isListening, setIsListening] = useState(false);
    const [supported, setSupported] = useState(false);
    const recognitionRef = useRef(null);
    const onResultRef = useRef(onResult);
    onResultRef.current = onResult;

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return undefined;

        setSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            onResultRef.current?.(transcript, event.results[event.results.length - 1].isFinal);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        return () => {
            recognition.onresult = null;
            recognition.onend = null;
            try {
                recognition.abort();
            } catch {
                /* already stopped */
            }
        };
    }, [language]);

    const toggle = useCallback(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            try {
                recognition.start();
                setIsListening(true);
            } catch {
                setIsListening(false);
            }
        }
    }, [isListening]);

    return { isListening, supported, toggle };
}

/** Text-to-speech for assistant answers. */
export function useSpeech() {
    const [speakingId, setSpeakingId] = useState(null);
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported]);

    const speak = useCallback(
        (id, text) => {
            if (!supported) return;
            window.speechSynthesis.cancel();

            if (speakingId === id) {
                setSpeakingId(null);
                return;
            }

            // Strip markdown so the voice doesn't read asterisks and backticks.
            const plain = text
                .replace(/```[\s\S]*?```/g, ' code block ')
                .replace(/[*_`#>]/g, '')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/\s+/g, ' ')
                .trim();

            const utterance = new SpeechSynthesisUtterance(plain);
            utterance.rate = 1.02;
            utterance.pitch = 1;
            utterance.onend = () => setSpeakingId(null);
            utterance.onerror = () => setSpeakingId(null);

            setSpeakingId(id);
            window.speechSynthesis.speak(utterance);
        },
        [speakingId, supported]
    );

    const stop = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setSpeakingId(null);
    }, [supported]);

    return { speak, stop, speakingId, supported };
}
