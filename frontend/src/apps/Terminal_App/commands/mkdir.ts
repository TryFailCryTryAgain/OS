import { createFolder } from '../vfs/operations';
import type { Command } from './types';

export const mkdir: Command = (args, ctx) => {
    const name = args[0];
    if (!name) {
        return { output: 'mkdir: missing folder name', error: true };
    }

    const result = createFolder(ctx.cwdId, name, ctx.state);

    if (!result.ok) {
        return { output: `mkdir: ${result.error}`, error: true };
    }

    return { output: '' };
};