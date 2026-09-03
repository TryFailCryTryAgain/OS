import { useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import style from './Terminal.module.css';

type Props = {
    promptPath: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onArrowUp: () => void;
    onArrowDown: () => void;
};

export function TerminalInput({ promptPath, value, onChange, onSubmit, onArrowUp, onArrowDown }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            onSubmit();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onArrowUp();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onArrowDown();
        }
    }

    return (
        <div className={style.Input_Container}>
            <span className={style.Prompt}>{promptPath}&gt;</span>
            <input
                ref={inputRef}
                className={style.Input}
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
            />
        </div>
    );
}