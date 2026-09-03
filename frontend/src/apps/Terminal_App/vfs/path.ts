import type { VFSState, DirectoryNode, VNode } from './types';

export function resolvePath(
    path: string,
    startId: string,
    state: VFSState
): DirectoryNode | undefined {
    const isAbsolute = path.startsWith('/') || path.startsWith('C:/');
    let currentId = isAbsolute ? state.rootId : startId;

    const segments = path.split('/').filter(seg => seg !== '' && seg !== 'C:');

    for (const segment of segments) {
        const current = state.nodes[currentId];
        if (!current || current.type !== 'directory') return undefined;

        if (segment === '.') continue;

        if (segment === '..') {
            if (current.parentId === null) continue;
            currentId = current.parentId;
            continue;
        }

        const nextId = current.children.find(id => state.nodes[id]?.name === segment);
        if (!nextId) return undefined;

        currentId = nextId;
    }

    const result = state.nodes[currentId];
    return result?.type === 'directory' ? result : undefined;
}

// Builds a human-readable "C:/Folder1/Folder2" string for a given node — useful for prompts/pwd.
export function buildPathString(nodeId: string, state: VFSState): string {
    const parts: string[] = [];
    let currentId: string | null = nodeId;

    while (currentId !== null) {
        const node: VNode | undefined = state.nodes[currentId];
        if (!node) break;
        parts.unshift(node.name);
        currentId = node.parentId;
    }

    // Drive name already includes "C:/", so join the rest with "/"
    return parts.length > 1 ? `${parts[0]}${parts.slice(1).join('/')}` : parts[0] ?? '';
}