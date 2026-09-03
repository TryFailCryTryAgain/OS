import { createFile } from '../vfs/operations';
import type { Command } from './types';

export const touch: Command = (args, ctx) => {
    const name = args[0];
    if (!name) {
        return { output: 'touch: missing file name', error: true };
    }

    const result = createFile(ctx.cwdId, name, '', ctx.state);

    if (!result.ok) {
        return { output: `touch: ${result.error}`, error: true };
    }

    return { output: '' };
};