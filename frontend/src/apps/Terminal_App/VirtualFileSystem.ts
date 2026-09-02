


interface BaseNode {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: number;
    modifiedAt: number;
}

interface FileNode extends BaseNode {
    type: 'file',
    content: string,
    mimeType?: string;
}

interface DirectoryNode extends BaseNode {
    type: 'directory',
    children: string[],
}

type VNode = FileNode | DirectoryNode;

type VFSState = {
    nodes: Record<string, VNode>;
    rootId: string;
}



let object: DirectoryNode = {
    type: "directory",
    children: ["2", "3"],
    id: "1",
    name: "C:/",
    parentId: null,
    createdAt: 1,
    modifiedAt: 1    
}

let folder1: DirectoryNode = {
    type: 'directory',
    children: [""],
    id: "2",
    name: "Folder",
    parentId: "1",
    createdAt: 2,
    modifiedAt: 2
}

let folder2: DirectoryNode = {
    type: 'directory',
    children: [""],
    id: "3",
    name: "Folder2",
    parentId: "1",
    createdAt: 3,
    modifiedAt: 3
}

const state: VFSState = {
    rootId: "1",
    nodes: {
        "1": object,
        "2": folder1,
        "3": folder2,
    },
};







