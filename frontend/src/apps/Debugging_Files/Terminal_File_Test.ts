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

const folderId = crypto.randomUUID();
const folderId2 = crypto.randomUUID();

const Drive: DirectoryNode = {
    type: "directory",
    children: [folderId],
    id: crypto.randomUUID(),
    name: "C:/",
    parentId: null,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
}

const folder: DirectoryNode = {
    type: 'directory',
    children: [folderId2],
    id: folderId,
    name: "Folder1",
    parentId: Drive.id,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
}

const folder2: DirectoryNode = {
    type: 'directory',
    children: [],
    id: folderId2,
    name: "Folder2",
    parentId: folder.id,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
}

const state: VFSState = {
    nodes: { [Drive.id]: Drive, [folder.id]: folder, [folder2.id]: folder2 },
    rootId: Drive.id
}

console.log(state.nodes[Drive.id]);

function FindFolder(name: string) {

    const root = state.nodes[Drive.id] as DirectoryNode;

    const foundId = root.children.find(id => state.nodes[id]?.name === name);
    if (!foundId) return undefined;

    const node = state.nodes[foundId];
    if (node.type !== 'directory') return undefined;

    return node;
}


// const found = FindFolder("Folder2");
// console.log(found);

function resolvePath(path: string, startId: string = state.rootId): DirectoryNode | undefined {
    // Absolute vs relative: if it starts with "/", start from root instead of cwd
    const isAbsolute = path.startsWith('/') || path.startsWith('C:/');
    let currentId = isAbsolute ? state.rootId : startId;

    const segments = path.split('/').filter(seg => seg !== '' && seg !== 'C:');

    for (const segment of segments) {
        const current = state.nodes[currentId];
        if (!current || current.type !== 'directory') return undefined; // dead end

        if (segment === '.') continue;               // stay put
        if (segment === '..') {
            if (current.parentId === null) continue; // already at root
            currentId = current.parentId;
            continue;
        }

        const nextId = current.children.find(id => state.nodes[id]?.name === segment);
        if (!nextId) return undefined; // no such child — path invalid

        currentId = nextId;
    }

    const result = state.nodes[currentId];
    return result?.type === 'directory' ? result : undefined;
}


let cwdId = state.rootId;

function cd(path: string) {
    const target = resolvePath(path, cwdId);
    if (!target) {
        console.log(`cd: no such directory: ${path}`);
        return;
    }
    cwdId = target.id;
    return target;
}

const FindPath = cd("C:/Folder1/Folder2/.././../");

console.log(FindPath);


