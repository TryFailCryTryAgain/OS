import { buildPathString } from '../vfs/path';
import type { Command } from './types';

export const pwd: Command = (args, ctx) => {
    return { output: buildPathString(ctx.cwdId, ctx.state) };
};