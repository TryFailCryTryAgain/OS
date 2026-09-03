import type { VFSState, DirectoryNode } from "./types";

export function createInitialState(): VFSState {
    const driveId = crypto.randomUUID();


    const drive: DirectoryNode = {
        type: 'directory',
        id: driveId,
        name: 'C:/',
        parentId: null,
        children: [],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
    };

    return {
        nodes: {
            [drive.id]: drive,
        },
        rootId: driveId,
        cwdId: driveId
    }
}