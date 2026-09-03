import type { VFSState, VNode, FileNode, DirectoryNode } from './types';

export function getNode(id: string, state: VFSState): VNode | undefined {
    return state.nodes[id];
}

export function getDirectory(id: string, state: VFSState): DirectoryNode | undefined {
    const node = state.nodes[id];
    return node?.type === 'directory' ? node : undefined;
}

export function getFile(id: string, state: VFSState): FileNode | undefined {
    const node = state.nodes[id];
    return node?.type === 'file' ? node : undefined;
}

export function getChildren(dirId: string, state: VFSState): VNode[] {
    const dir = getDirectory(dirId, state);
    if (!dir) return [];
    return dir.children
        .map(id => state.nodes[id])
        .filter((n): n is VNode => n !== undefined);
}

// Finds a direct child of `parentId` by name (not recursive — one level only).
export function findChildByName(
    parentId: string,
    name: string,
    state: VFSState
): VNode | undefined {
    const dir = getDirectory(parentId, state);
    if (!dir) return undefined;
    const id = dir.children.find(childId => state.nodes[childId]?.name === name);
    return id ? state.nodes[id] : undefined;
}

export function getParent(id: string, state: VFSState): DirectoryNode | undefined {
    const node = state.nodes[id];
    if (!node || node.parentId === null) return undefined;
    return getDirectory(node.parentId, state);
}