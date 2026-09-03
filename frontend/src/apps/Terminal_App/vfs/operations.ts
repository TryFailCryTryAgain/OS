import type { VFSState, FileNode, DirectoryNode } from './types';
import { findChildByName, getDirectory } from './queries';

export type OperationResult =
    | { ok: true }
    | { ok: false; error: string };

export function createFolder(
    parentId: string,
    name: string,
    state: VFSState
): OperationResult {
    const parent = getDirectory(parentId, state);
    if (!parent) return { ok: false, error: `not a directory: ${parentId}` };

    if (findChildByName(parentId, name, state)) {
        return { ok: false, error: `already exists: ${name}` };
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    const folder: DirectoryNode = {
        type: 'directory',
        id,
        name,
        parentId,
        children: [],
        createdAt: now,
        modifiedAt: now,
    };

    state.nodes[id] = folder;
    parent.children.push(id);
    parent.modifiedAt = now;

    return { ok: true };
}

export function createFile(
    parentId: string,
    name: string,
    content: string,
    state: VFSState,
    mimeType?: string
): OperationResult {
    const parent = getDirectory(parentId, state);
    if (!parent) return { ok: false, error: `not a directory: ${parentId}` };

    if (findChildByName(parentId, name, state)) {
        return { ok: false, error: `already exists: ${name}` };
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    const file: FileNode = {
        type: 'file',
        id,
        name,
        parentId,
        content,
        mimeType,
        createdAt: now,
        modifiedAt: now,
    };

    state.nodes[id] = file;
    parent.children.push(id);
    parent.modifiedAt = now;

    return { ok: true };
}

export function deleteNode(id: string, state: VFSState): OperationResult {
    const node = state.nodes[id];
    if (!node) return { ok: false, error: `no such node: ${id}` };
    if (node.parentId === null) return { ok: false, error: `cannot delete root` };

    // Refuse to delete a non-empty directory — caller can add a recursive/-force variant later.
    if (node.type === 'directory' && node.children.length > 0) {
        return { ok: false, error: `directory not empty: ${node.name}` };
    }

    const parent = getDirectory(node.parentId, state);
    if (parent) {
        parent.children = parent.children.filter(childId => childId !== id);
        parent.modifiedAt = Date.now();
    }

    delete state.nodes[id];
    return { ok: true };
}

export function renameNode(id: string, newName: string, state: VFSState): OperationResult {
    const node = state.nodes[id];
    if (!node) return { ok: false, error: `no such node: ${id}` };

    if (node.parentId && findChildByName(node.parentId, newName, state)) {
        return { ok: false, error: `already exists: ${newName}` };
    }

    node.name = newName;
    node.modifiedAt = Date.now();
    return { ok: true };
}