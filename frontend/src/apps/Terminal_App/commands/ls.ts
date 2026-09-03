import { getChildren } from '../vfs/queries';
import type { Command } from './types';

export const ls: Command = (args, ctx) => {
    const children = getChildren(ctx.cwdId, ctx.state);

    if (children.length === 0) {
        return { output: '(empty)' };
    }

    const lines = children.map(node =>
        node.type === 'directory' ? `${node.name}/` : node.name
    );

    return { output: lines.join('\n') };
};