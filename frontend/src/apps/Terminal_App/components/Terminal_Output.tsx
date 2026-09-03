import { useEffect, useRef } from 'react';
import { TerminalLine } from './TerminalLine';
import type { ShellLine } from '../shell/types';
import style from './Terminal.module.css';

type Props = {
    lines: ShellLine[];
};

export function TerminalOutput({ lines }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    return (
        <div className={style.Output}>
            {lines.map(line => (
                <TerminalLine key={line.id} line={line} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}