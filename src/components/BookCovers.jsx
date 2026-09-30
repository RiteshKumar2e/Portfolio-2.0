import React from 'react';
import { motion } from 'framer-motion';

/*
 * Illustrated covers for the Field Library. Every volume gets its own motif,
 * drawn on a 200×244 canvas in the volume's ink colour, with ember accents
 * and its own ambient motion (see the .svg-* keyframes in index.css).
 */

export const EMBER = '#d0703a';
const PAPER = '#fff3dc';
const DARK = '#2a211a';

// Small deterministic PRNG so every volume gets its own (stable) details.
export const seeded = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Stroke "draw-in" when the cover scrolls into view.
const draw = (i) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 1.4, delay: 0.2 + i * 0.05, ease: 'easeInOut' },
});

const LEAF = 'M0 0 C 4 -4, 10 -4, 14 0 C 10 4, 4 4, 0 0 Z';
const SPARKLE = 'M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z';

const bezier = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

const Sun = ({ y = 232 }) => (
    <>
        <circle cx="100" cy={y} r="4.5" fill={EMBER} className="svg-glow" />
        <circle cx="100" cy={y} r="8" fill="none" stroke={EMBER} strokeOpacity="0.5" />
    </>
);

const Svg = ({ children }) => (
    <svg viewBox="0 0 200 244" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {children}
    </svg>
);

/* I — a turning globe ringed by the people it serves */
const Globe = ({ color }) => {
    const people = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return {
            x: 100 + Math.cos(a) * 84,
            y: 112 + Math.sin(a) * 80,
            ex: 100 + Math.cos(a) * 60,
            ey: 112 + Math.sin(a) * 60,
        };
    });
    // Meridian widths sampled from |cos| so three ellipses read as a rotating globe.
    const meridian = (phase) => Array.from({ length: 13 }, (_, k) => Math.max(1, 60 * Math.abs(Math.cos((Math.PI * k) / 12 + phase))));

    return (
        <Svg>
            <g fill="none" stroke={color} strokeWidth="1.1">
                <ellipse cx="100" cy="112" rx="94" ry="20" transform="rotate(-16 100 112)" strokeDasharray="3 5" className="svg-flow" strokeOpacity="0.55" />
                {people.map((p, i) => (
                    <motion.line key={i} x1={p.ex} y1={p.ey} x2={p.x} y2={p.y} strokeOpacity="0.45" {...draw(i)} />
                ))}
                <motion.circle cx="100" cy="112" r="60" strokeWidth="1.6" {...draw(0)} />
                {[0, 1, 2].map((i) => (
                    <motion.ellipse
                        key={i}
                        cx="100"
                        cy="112"
                        ry="60"
                        strokeOpacity="0.6"
                        initial={{ rx: meridian((i * Math.PI) / 3)[0] }}
                        animate={{ rx: meridian((i * Math.PI) / 3) }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    />
                ))}
                <ellipse cx="100" cy="82" rx="52" ry="7" strokeOpacity="0.5" />
                <ellipse cx="100" cy="112" rx="60" ry="11" strokeOpacity="0.7" />
                <ellipse cx="100" cy="142" rx="52" ry="7" strokeOpacity="0.5" />
                <path d="M100 172 V198 M72 200 H128" strokeWidth="1.4" />
            </g>
            {people.map((p, i) => (
                <g key={i} transform={`translate(${p.x} ${p.y})`}>
                    <circle r="8" fill={EMBER} fillOpacity="0.25" className="svg-pulse" style={{ '--d': `${i * 0.3}s` }} />
                    <circle cy="-2.5" r="2.6" fill={color} />
                    <path d="M-4.5 5 Q0 -1 4.5 5 Z" fill={color} />
                </g>
            ))}
            <Sun />
        </Svg>
    );
};

/* II — a glowing terminal doorway under a circuit tree */
const Arch = ({ color, index }) => {
    const art = React.useMemo(() => {
        const r = seeded(index + 7);
        const branches = [];
        for (let k = 0; k < 6; k++) {
            const y = 120 - k * 10;
            [-1, 1].forEach((dir) => {
                const len = 14 + r() * 30;
                const rise = 5 + r() * 9;
                const x = 100 + dir * len;
                branches.push({ d: `M100 ${y} H${x.toFixed(1)} V${(y - rise).toFixed(1)}`, x, y: y - rise });
            });
        }
        const roots = [];
        for (let k = 0; k < 7; k++) {
            const o = k - 3;
            const sx = 100 + o * 5;
            const ex = 100 + o * 24 + (r() - 0.5) * 12;
            const ey = 222 + r() * 12;
            roots.push(`M${sx} 198 C ${sx} 212, ${(100 + o * 16).toFixed(1)} 206, ${ex.toFixed(1)} ${ey.toFixed(1)}`);
        }
        const leaves = Array.from({ length: 5 }, (_, k) => ({ y: 186 - k * 20, a: -40 + r() * 20 }));
        return { branches, roots, leaves };
    }, [index]);

    const glow = `door-${index}`;

    return (
        <Svg>
            <defs>
                <radialGradient id={glow} cx="50%" cy="65%" r="70%">
                    <stop offset="0%" stopColor="#ffd9a0" />
                    <stop offset="45%" stopColor={EMBER} />
                    <stop offset="100%" stopColor="#6b2e17" />
                </radialGradient>
            </defs>
            <g fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                {[66, 56].map((R, i) => (
                    <motion.path key={R} d={`M${100 - R} 112 A${R} ${R} 0 0 1 ${100 + R} 112`} strokeOpacity="0.35" {...draw(i)} />
                ))}
                <motion.path d="M58 198 V112 A42 42 0 0 1 142 112 V198" strokeWidth="1.5" {...draw(2)} />
                <motion.path d="M100 132 V58" strokeWidth="1.5" {...draw(3)} />
                {art.branches.map((b, i) => (
                    <motion.path key={i} d={b.d} {...draw(4 + i)} />
                ))}
                {art.roots.map((d, i) => (
                    <motion.path key={i} d={d} strokeOpacity="0.8" {...draw(6 + i)} />
                ))}
                <motion.path d="M28 204 C 22 170, 34 132, 26 92" {...draw(8)} />
                <motion.path d="M172 204 C 178 170, 166 132, 174 92" {...draw(8)} />
                <path d="M16 204 H184" strokeOpacity="0.6" />
                <path d="M80 201 H120 M74 206 H126" />
            </g>
            <g fill={color} fillOpacity="0.75">
                {art.leaves.map((l, i) => (
                    <React.Fragment key={i}>
                        <path d={LEAF} transform={`translate(${28 + (i % 2 ? 2 : -2)} ${l.y}) rotate(${180 - l.a})`} />
                        <path d={LEAF} transform={`translate(${172 + (i % 2 ? -2 : 2)} ${l.y}) rotate(${l.a})`} />
                    </React.Fragment>
                ))}
            </g>
            {art.branches.map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={i % 3 === 0 ? 2.4 : 1.6} fill={i % 4 === 0 ? EMBER : color} className={i % 4 === 0 ? 'svg-glow' : undefined} />
            ))}
            <circle cx="100" cy="55" r="3.2" fill={EMBER} className="svg-glow" />
            <path className="door-glow" d="M86 198 V136 A14 14 0 0 1 114 136 V198 Z" fill={`url(#${glow})`} />
            <path d="M86 198 V136 A14 14 0 0 1 114 136 V198" fill="none" stroke={color} strokeWidth="1.2" />
            <text x="100" y="176" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fill={PAPER}>›_</text>
            <Sun y={234} />
        </Svg>
    );
};

/* III — a laurel-wreathed medal under slowly turning rays */
const Laurel = ({ color }) => {
    const leaves = [];
    [-1, 1].forEach((dir) => {
        const P = [[100, 192], [100 + dir * 52, 182], [100 + dir * 64, 130], [100 + dir * 42, 70]];
        for (let k = 1; k <= 9; k++) {
            const t = k / 10;
            const x = bezier(P[0][0], P[1][0], P[2][0], P[3][0], t);
            const y = bezier(P[0][1], P[1][1], P[2][1], P[3][1], t);
            const x2 = bezier(P[0][0], P[1][0], P[2][0], P[3][0], t + 0.01);
            const y2 = bezier(P[0][1], P[1][1], P[2][1], P[3][1], t + 0.01);
            const tangent = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
            leaves.push({ x, y, a: tangent + (k % 2 ? 40 : -40) });
        }
    });
    const star = Array.from({ length: 10 }, (_, i) => {
        const R = i % 2 ? 6 : 14;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        return `${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R).toFixed(1)}`;
    }).join(' ');

    return (
        <Svg>
            <g transform="translate(100 112)">
                <g className="svg-spin" stroke={color} strokeOpacity="0.3">
                    {Array.from({ length: 24 }, (_, i) => {
                        const a = (i / 24) * Math.PI * 2;
                        return <line key={i} x1={Math.cos(a) * 36} y1={Math.sin(a) * 36} x2={Math.cos(a) * (i % 2 ? 62 : 74)} y2={Math.sin(a) * (i % 2 ? 62 : 74)} />;
                    })}
                </g>
            </g>
            <g fill="none" stroke={color} strokeWidth="1.2">
                <motion.path d="M100 192 C 48 182, 36 130, 58 70" {...draw(0)} />
                <motion.path d="M100 192 C 152 182, 164 130, 142 70" {...draw(0)} />
            </g>
            <g fill={color} fillOpacity="0.8">
                {leaves.map((l, i) => (
                    <path key={i} d={LEAF} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(1)})`} />
                ))}
            </g>
            <path d="M88 132 L80 176 L90 168 L96 180 L100 136 Z M112 132 L120 176 L110 168 L104 180 L100 136 Z" fill={EMBER} fillOpacity="0.85" />
            <circle cx="100" cy="112" r="27" fill="#f3e6c8" stroke={color} strokeWidth="1.6" />
            <circle cx="100" cy="112" r="22" fill="none" stroke={color} strokeDasharray="2 3" strokeOpacity="0.7" />
            <g transform="translate(100 112)">
                <polygon points={star} fill={EMBER} className="svg-spin-rev svg-glow" />
            </g>
            {[[46, 64], [156, 58], [40, 150], [164, 160], [100, 40]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                    <path d={SPARKLE} fill={EMBER} className="svg-twinkle" style={{ '--d': `${i * 0.6}s` }} />
                </g>
            ))}
            <path d="M40 206 H160" stroke={color} strokeOpacity="0.5" />
            <Sun />
        </Svg>
    );
};

/* IV — a lens sweeping a riveted steel plate for defects */
const Lens = ({ color }) => (
    <Svg>
        <g fill="none" stroke={color}>
            <path d="M30 74 V56 H48 M152 56 H170 V74 M170 176 V194 H152 M48 194 H30 V176" strokeWidth="1.5" />
            <motion.rect x="40" y="64" width="120" height="120" rx="2" strokeWidth="1.4" {...draw(0)} />
            <g strokeOpacity="0.25">
                {[55, 70, 85, 100, 115, 130, 145].map((v) => (
                    <React.Fragment key={v}>
                        <line x1={v} y1="64" x2={v} y2="184" />
                        <line x1="40" y1={v + 24} x2="160" y2={v + 24} />
                    </React.Fragment>
                ))}
            </g>
            <g stroke={EMBER} strokeWidth="1.4" strokeLinecap="round">
                <path d="M60 92 l10 4 l6 -3" />
                <path d="M122 150 l14 -6" />
                <path d="M76 142 l4 8 l9 1" />
            </g>
        </g>
        {[[46, 70], [154, 70], [46, 178], [154, 178]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="2" fill={color} />
        ))}
        {[[70, 94, 0], [128, 148, 0.8], [84, 150, 1.6]].map(([x, y, d]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
                <circle r="4" fill={EMBER} className="svg-pulse svg-glow" style={{ '--d': `${d}s` }} />
            </g>
        ))}
        <g className="svg-scan">
            <rect x="40" y="58" width="120" height="8" fill={EMBER} fillOpacity="0.14" />
            <line x1="40" y1="66" x2="160" y2="66" stroke={EMBER} strokeWidth="1.5" className="svg-glow" />
        </g>
        <g className="svg-sway">
            <circle cx="108" cy="112" r="30" fill="#f7eed9" fillOpacity="0.35" stroke={color} strokeWidth="1.8" />
            <circle cx="108" cy="112" r="24" fill="none" stroke={color} strokeOpacity="0.45" strokeDasharray="2 3" />
            <path d="M108 100 V124 M96 112 H120" stroke={EMBER} strokeWidth="1" />
            <line x1="130" y1="134" x2="156" y2="160" stroke={color} strokeWidth="6" strokeLinecap="round" />
        </g>
        <Sun y={220} />
    </Svg>
);

/* V — a watchful eye inside face-detection brackets */
const Eye = ({ color }) => {
    const lashes = Array.from({ length: 9 }, (_, k) => {
        const t = 0.1 + (k / 8) * 0.8;
        const x = (1 - t) * (1 - t) * 36 + 2 * (1 - t) * t * 100 + t * t * 164;
        const y = (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 58 + t * t * 120;
        const a = Math.atan2(y - 120, x - 100);
        return { x, y, x2: x + Math.cos(a) * 11, y2: y + Math.sin(a) * 11 };
    });

    return (
        <Svg>
            {[[34, 60, 'M0 14 V0 H14'], [166, 60, 'M-14 0 H0 V14'], [34, 180, 'M0 -14 V0 H14'], [166, 180, 'M-14 0 H0 V-14']].map(([x, y, d], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                    <path d={d} fill="none" stroke={EMBER} strokeWidth="1.6" className="svg-pulse" style={{ '--d': `${i * 0.4}s` }} />
                </g>
            ))}
            <g className="svg-blink">
                <g stroke={color} strokeWidth="1.2" strokeLinecap="round">
                    {lashes.map((l, i) => (
                        <line key={i} x1={l.x} y1={l.y} x2={l.x2} y2={l.y2} />
                    ))}
                </g>
                <motion.path d="M36 120 Q100 58 164 120 Q100 182 36 120 Z" fill="#f7eed9" fillOpacity="0.5" stroke={color} strokeWidth="1.6" {...draw(0)} />
                <circle cx="100" cy="120" r="30" fill="none" stroke={color} strokeWidth="1.3" />
                <g transform="translate(100 120)">
                    <circle r="23" fill="none" stroke={color} strokeDasharray="2 4" className="svg-spin" />
                    <circle r="17" fill="none" stroke={EMBER} strokeOpacity="0.6" strokeDasharray="10 6" className="svg-spin-rev" />
                    <circle r="12" fill={EMBER} fillOpacity="0.3" className="svg-pulse" />
                </g>
                <circle cx="100" cy="120" r="8" fill={DARK} />
                <circle cx="103.5" cy="116.5" r="2.4" fill={PAPER} />
            </g>
            <path d="M52 206 H148" stroke={color} strokeOpacity="0.5" />
            <text x="100" y="200" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill={color} letterSpacing="2">AGE · GENDER</text>
            <Sun y={226} />
        </Svg>
    );
};

/* VI — two pages whose matching lines light up */
const Docs = ({ color }) => {
    const lines = (x, y) => [52, 40, 56, 34, 50, 44, 58, 38].map((w, i) => ({ x1: x + 8, y1: y + 16 + i * 9, x2: x + 8 + w, hot: i === 2 || i === 5 }));
    const Doc = ({ x, y, rot, i }) => (
        <g transform={`rotate(${rot} ${x + 35} ${y + 48})`}>
            <path d={`M${x} ${y} H${x + 56} L${x + 70} ${y + 14} V${y + 96} H${x} Z`} fill="#f7eed9" stroke={color} strokeWidth="1.4" />
            <path d={`M${x + 56} ${y} V${y + 14} H${x + 70}`} fill="none" stroke={color} />
            {lines(x, y).map((l, k) => (
                <motion.line
                    key={k}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y1}
                    stroke={l.hot ? EMBER : color}
                    strokeWidth={l.hot ? 3 : 1}
                    strokeOpacity={l.hot ? 0.8 : 0.5}
                    strokeLinecap="round"
                    {...draw(i * 8 + k)}
                />
            ))}
        </g>
    );

    return (
        <Svg>
            <Doc x={36} y={56} rot={-8} i={0} />
            <Doc x={96} y={64} rot={7} i={1} />
            <g fill="none" stroke={EMBER} strokeWidth="1.2" strokeDasharray="3 3" className="svg-flow">
                <path d="M92 86 C 104 80, 106 96, 118 96" />
                <path d="M92 112 C 104 108, 108 124, 118 124" />
            </g>
            <motion.circle cx="90" cy="196" r="15" fill="none" stroke={color} strokeWidth="1.3" animate={{ cx: [84, 93, 84] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.circle cx="110" cy="196" r="15" fill={EMBER} fillOpacity="0.18" stroke={EMBER} strokeWidth="1.3" animate={{ cx: [116, 107, 116] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
            <Sun y={230} />
        </Svg>
    );
};

/* VII — a sun over flowing sentiment tides */
const Waves = ({ color }) => {
    const wave = (k) => {
        const base = 106 + k * 16;
        const amp = 5 + (k % 3) * 2.5;
        let d = `M26 ${base}`;
        for (let x = 26; x <= 174; x += 4) {
            d += ` L${x} ${(base + Math.sin(x / 13 + k * 1.3) * amp).toFixed(1)}`;
        }
        return d;
    };

    return (
        <Svg>
            <g transform="translate(100 66)">
                <g className="svg-spin" stroke={EMBER} strokeWidth="1.3" strokeLinecap="round">
                    {Array.from({ length: 12 }, (_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        return <line key={i} x1={Math.cos(a) * 23} y1={Math.sin(a) * 23} x2={Math.cos(a) * 31} y2={Math.sin(a) * 31} />;
                    })}
                </g>
                <circle r="17" fill={EMBER} className="svg-glow" />
            </g>
            <g fill="none" strokeWidth="1.4" strokeLinecap="round">
                {[0, 1, 2, 3, 4].map((k) => (
                    <path key={k} d={wave(k)} stroke={k === 2 ? EMBER : color} strokeOpacity={k === 2 ? 0.9 : 0.7} strokeDasharray={k % 2 ? '10 6' : '18 6'} className="svg-flow" />
                ))}
            </g>
            <g stroke={color} strokeWidth="1.2" fill="none">
                <path d="M50 206 H150" strokeOpacity="0.5" />
                {[[50, 'M-3 3 Q0 0 3 3'], [100, 'M-3 2 H3'], [150, 'M-3 1 Q0 4 3 1']].map(([x, mouth]) => (
                    <g key={x} transform={`translate(${x} 206)`}>
                        <circle r="7" fill="#f7eed9" />
                        <circle cx="-2.3" cy="-2" r="0.9" fill={color} stroke="none" />
                        <circle cx="2.3" cy="-2" r="0.9" fill={color} stroke="none" />
                        <path d={mouth} />
                    </g>
                ))}
            </g>
            <motion.g animate={{ x: [0, 50, 100, 50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
                <path d="M50 218 l-4 7 h8 Z" fill={EMBER} />
            </motion.g>
        </Svg>
    );
};

/* VIII — rising bars, a trend line, and a clicking cursor */
const Cursor = ({ color }) => {
    const heights = [30, 46, 38, 62, 76, 100];
    const tops = heights.map((h, k) => [63 + k * 16, 196 - h - 8]);

    return (
        <Svg>
            <g fill={color}>
                {[0, 1, 2, 3].map((k) => (
                    <path key={k} d={`M${96 + k * 16} 40 L${108 + k * 16} 40 L${188} ${118 - k * 16 - 30} L${188} ${106 - k * 16 - 30} Z`} fillOpacity={0.1 + k * 0.05} />
                ))}
            </g>
            <g fill="none" stroke={color} strokeOpacity="0.35">
                {[24, 40, 56, 72, 88].map((R) => (
                    <path key={R} d={`M${30 + R} 214 A${R} ${R} 0 0 0 30 ${214 - R}`} />
                ))}
            </g>
            {heights.map((h, k) => (
                <motion.rect
                    key={k}
                    x={58 + k * 16}
                    y={196 - h}
                    width="10"
                    height={h}
                    fill={k === heights.length - 1 ? EMBER : color}
                    fillOpacity={k === heights.length - 1 ? 0.95 : 0.35 + k * 0.1}
                    style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.3 + k * 0.12, ease: [0.16, 1, 0.3, 1] }}
                />
            ))}
            <motion.polyline points={tops.map((p) => p.join(',')).join(' ')} fill="none" stroke={EMBER} strokeWidth="1.6" {...draw(4)} />
            {tops.map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r="2.2" fill={EMBER} />
            ))}
            <path d="M52 196 H154" stroke={color} strokeWidth="1.4" />
            <g transform="translate(58 74)">
                <circle r="9" fill="none" stroke={EMBER} strokeWidth="1.4" className="svg-ripple" />
            </g>
            <g className="svg-bob">
                <g transform="translate(58 74) rotate(-12)">
                    <path d="M0 0 L0 50 L13 38 L22 58 L31 54 L22 34 L39 34 Z" fill={DARK} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
                </g>
            </g>
            <Sun y={226} />
        </Svg>
    );
};

const MOTIFS = { globe: Globe, arch: Arch, laurel: Laurel, lens: Lens, eye: Eye, docs: Docs, waves: Waves, cursor: Cursor };

export const CoverArt = ({ motif, index, color }) => {
    const Motif = MOTIFS[motif] ?? Arch;
    return <Motif color={color} index={index} />;
};
