import { cd } from './cd';
import { ls } from './ls';
import { mkdir } from './mkdir';
import { touch } from './touch';
import { cat } from './cat';
import { rm } from './rm';
import { pwd } from './pwd';
import type { Command } from './types';
import { help } from './help';
import { echo } from './echo';

export const registry: Record<string, Command> = {
    cd,
    ls,
    mkdir,
    touch,
    cat,
    rm,
    pwd,
    help,
    echo
};