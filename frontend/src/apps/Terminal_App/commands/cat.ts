import { findChildByName } from '../vfs/queries';
import type { Command } from './types';

export const cat: Command = (args, ctx) => {
    const name = args[0];
    if (!name) {
        return { output: 'cat: missing file name', error: true };
    }

    const node = findChildByName(ctx.cwdId, name, ctx.state);

    if (!node) {
        return { output: `cat: no such file: ${name}`, error: true };
    }
    if (node.type !== 'file') {
        return { output: `cat: not a file: ${name}`, error: true };
    }

    return { output: node.content };
};