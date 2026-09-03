import { registry } from '../commands/registry';
import { getState, updateState } from '../vfs/store';
import { parseInput } from './parseInput';
import type { CommandResult } from '../commands/types';

export function dispatch(line: string, cwdId: string): CommandResult {
    const { command, args } = parseInput(line);

    if (!command) {
        return { output: '' };
    }

    const fn = registry[command];
    if (!fn) {
        return { output: `command not found: ${command}`, error: true };
    }

    const state = getState();
    const result = fn(args, { state, cwdId });

    // Commands mutate `state` in place (see vfs/operations.ts) — persist whatever changed.
    updateState(s => {
        Object.assign(s, state);
        if (result.newCwdId) s.cwdId = result.newCwdId;
    });

    return result;
}