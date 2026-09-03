import { commandMeta } from './meta';
import type { Command } from './types';

export const help: Command = (args) => {
    const [target] = args;

    // help <command> — show detail on just one
    if (target) {
        const meta = commandMeta[target];
        if (!meta) {
            return { output: `help: no such command: ${target}`, error: true };
        }
        return { output: `${meta.usage}\n  ${meta.description}` };
    }

    // help — list everything
    const lines = Object.entries(commandMeta).map(
        ([name, meta]) => `${name.padEnd(8)} ${meta.description}`
    );

    return { output: lines.join('\n') };
};