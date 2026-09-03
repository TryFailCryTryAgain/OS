import { useRef, useState, useCallback } from 'react';
import { dispatch } from '../shell/dispatch';
import { CommandHistory } from '../shell/history';
import { useVFS } from './useVFS';
import type { ShellLine } from '../shell/types';

export function useShell() {
    const state = useVFS();
    const [lines, setLines] = useState<ShellLine[]>([]);
    const [input, setInput] = useState('');
    const historyRef = useRef(new CommandHistory());

    const submit = useCallback(() => {
        const line = input;
        if (line.trim() === '') return;

        historyRef.current.push(line);

        const result = dispatch(line, state.cwdId);

        setLines(prev => [
            ...prev,
            { id: crypto.randomUUID(), type: 'input', text: line },
            ...(result.output
                ? [{ id: crypto.randomUUID(), type: result.error ? 'error' : 'output', text: result.output } as ShellLine]
                : []),
        ]);

        setInput('');
    }, [input, state.cwdId]);

    const recallPrevious = useCallback(() => {
        const prev = historyRef.current.previous();
        if (prev !== undefined) setInput(prev);
    }, []);

    const recallNext = useCallback(() => {
        const next = historyRef.current.next();
        setInput(next ?? '');
    }, []);

    return { state, lines, input, setInput, submit, recallPrevious, recallNext };
}