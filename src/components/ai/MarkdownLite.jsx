import React from 'react';

/**
 * A tiny, dependency-free markdown renderer for assistant messages.
 *
 * It builds React elements rather than HTML strings, so model output can never
 * inject markup. Supports the subset the model actually uses: headings, bullet
 * and numbered lists, fenced code, **bold**, *italic*, `code` and links.
 */

const INLINE = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+)/g;

function renderInline(text, keyPrefix) {
    const nodes = [];
    const parts = text.split(INLINE);

    parts.forEach((part, index) => {
        if (!part) return;
        const key = `${keyPrefix}-${index}`;

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            nodes.push(<strong key={key} className="font-bold">{part.slice(2, -2)}</strong>);
        } else if (part.startsWith('__') && part.endsWith('__') && part.length > 4) {
            nodes.push(<strong key={key} className="font-bold">{part.slice(2, -2)}</strong>);
        } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            nodes.push(
                <code
                    key={key}
                    className="px-1.5 py-0.5 rounded-md text-[0.85em] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/15"
                >
                    {part.slice(1, -1)}
                </code>
            );
        } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            nodes.push(<em key={key}>{part.slice(1, -1)}</em>);
        } else if (part.startsWith('[')) {
            const match = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
            if (match) {
                nodes.push(
                    <a
                        key={key}
                        href={match[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-indigo-400/50 underline-offset-2 text-indigo-600 dark:text-indigo-300 hover:decoration-indigo-500"
                    >
                        {match[1]}
                    </a>
                );
            } else {
                nodes.push(part);
            }
        } else if (/^https?:\/\//.test(part)) {
            nodes.push(
                <a
                    key={key}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-indigo-400/50 underline-offset-2 text-indigo-600 dark:text-indigo-300 break-all"
                >
                    {part.replace(/^https?:\/\//, '')}
                </a>
            );
        } else {
            nodes.push(part);
        }
    });

    return nodes;
}

function blockify(markdown) {
    const lines = markdown.split('\n');
    const blocks = [];
    let list = null;
    let codeBlock = null;

    const flushList = () => {
        if (list) {
            blocks.push(list);
            list = null;
        }
    };

    for (const line of lines) {
        if (line.trimStart().startsWith('```')) {
            if (codeBlock) {
                blocks.push(codeBlock);
                codeBlock = null;
            } else {
                flushList();
                codeBlock = { type: 'code', lines: [] };
            }
            continue;
        }

        if (codeBlock) {
            codeBlock.lines.push(line);
            continue;
        }

        const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
        const numbered = /^\s*(\d+)[.)]\s+(.*)$/.exec(line);
        const heading = /^\s*(#{1,4})\s+(.*)$/.exec(line);

        if (bullet) {
            if (!list || list.ordered) {
                flushList();
                list = { type: 'list', ordered: false, items: [] };
            }
            list.items.push(bullet[1]);
        } else if (numbered) {
            if (!list || !list.ordered) {
                flushList();
                list = { type: 'list', ordered: true, items: [] };
            }
            list.items.push(numbered[2]);
        } else if (heading) {
            flushList();
            blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
        } else if (line.trim() === '') {
            flushList();
        } else {
            const last = blocks[blocks.length - 1];
            if (!list && last && last.type === 'paragraph') {
                last.text += ` ${line.trim()}`;
            } else {
                flushList();
                blocks.push({ type: 'paragraph', text: line.trim() });
            }
        }
    }

    if (codeBlock) blocks.push(codeBlock);
    flushList();
    return blocks;
}

const MarkdownLite = ({ children, className = '' }) => {
    if (!children) return null;
    const blocks = blockify(children);

    return (
        <div className={`space-y-3 leading-relaxed ${className}`}>
            {blocks.map((block, index) => {
                if (block.type === 'code') {
                    return (
                        <pre
                            key={index}
                            className="overflow-x-auto rounded-xl p-4 text-[13px] font-mono bg-slate-900 text-slate-100 border border-white/10"
                        >
                            <code>{block.lines.join('\n')}</code>
                        </pre>
                    );
                }

                if (block.type === 'heading') {
                    return (
                        <p key={index} className="font-black text-[15px] tracking-tight pt-1">
                            {renderInline(block.text, `h-${index}`)}
                        </p>
                    );
                }

                if (block.type === 'list') {
                    const ListTag = block.ordered ? 'ol' : 'ul';
                    return (
                        <ListTag
                            key={index}
                            className={`space-y-1.5 pl-1 ${block.ordered ? 'list-decimal list-inside' : ''}`}
                        >
                            {block.items.map((item, itemIndex) => (
                                <li
                                    key={itemIndex}
                                    className={block.ordered ? 'pl-1' : 'flex gap-2.5'}
                                >
                                    {!block.ordered && (
                                        <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-indigo-500/70 shrink-0" />
                                    )}
                                    <span>{renderInline(item, `li-${index}-${itemIndex}`)}</span>
                                </li>
                            ))}
                        </ListTag>
                    );
                }

                return <p key={index}>{renderInline(block.text, `p-${index}`)}</p>;
            })}
        </div>
    );
};

export default MarkdownLite;
