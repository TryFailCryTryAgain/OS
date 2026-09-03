import { findChildByName } from '../vfs/queries';
import { deleteNode } from '../vfs/operations';
import type { Command } from './types';

export const rm: Command = (args, ctx) => {
    const name = args[0];
    if (!name) {
        return { output: 'rm: missing name', error: true };
    }

    const node = findChildByName(ctx.cwdId, name, ctx.state);
    if (!node) {
        return { output: `rm: no such file or directory: ${name}`, error: true };
    }

    const result = deleteNode(node.id, ctx.state);
    if (!result.ok) {
        return { output: `rm: ${result.error}`, error: true };
    }

    return { output: '' };
};