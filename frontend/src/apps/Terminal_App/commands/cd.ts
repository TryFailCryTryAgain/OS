import { resolvePath } from '../vfs/path';
import type { Command } from './types';

export const cd: Command = (args, ctx) => {
    const path = args[0];

    if (!path) {
        return { output: '', newCwdId: ctx.state.rootId };
    }

    const target = resolvePath(path, ctx.cwdId, ctx.state);

    if (!target) {
        return { output: `cd: no such directory: ${path}`, error: true };
    }

    return { output: '', newCwdId: target.id };
};