
interface BaseNode {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: number;
    modifiedAt: number;
}

export interface FileNode extends BaseNode {
    type: 'file',
    content: string,
    mimeType?: string;
}

export interface DirectoryNode extends BaseNode {
    type: 'directory',
    children: string[],
}

export type VNode = FileNode | DirectoryNode;

export type VFSState = {
    nodes: Record<string, VNode>;
    rootId: string;
    cwdId: string;
}