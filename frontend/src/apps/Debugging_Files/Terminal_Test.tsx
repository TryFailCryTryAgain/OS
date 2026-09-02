import { useState } from "react";
import style from './Terminal_Test.module.css';
import { Form } from "react-router";

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

const Drive: DirectoryNode = {
    type: "directory",
    children: [],
    id: crypto.randomUUID(),
    name: "C:/",
    parentId: null,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
}

function mkdir(state: VFSState, parentId: string, name: string): VFSState {
    const parent = state.nodes[parentId] as DirectoryNode;

    if (parent.type !== "directory") throw new Error("not a directory");
    if (parent.children.some(id => state.nodes[id].name === name)) {
        throw new Error(`"${name}" already exists`);
    }

    const newId = crypto.randomUUID();
    const newDir: DirectoryNode = {
        type: "directory",
        id: newId,
        name: name,
        parentId,
        children: [],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
    };


    return {
        ...state,
        nodes: {
            ...state.nodes,
            [newId]: newDir,
            [parentId]: { ...parent, children: [...parent.children, newId ] },
        },
    };
}


function Terminal_Test() {

    const [state, setState] = useState<VFSState>({
        nodes: { [Drive.id]: Drive },
        rootId: Drive.id,
    });

    const [currentParentId, setCurrentParentId] = useState(Drive.id);
    const [folderNameInput, setFolderNameInput] = useState("");



    const createFolder = (e: React.SubmitEvent) => {
        e.preventDefault();
        setState(prev => mkdir(prev, currentParentId, folderNameInput));
        console.log(state);
    }


    const [id, setId] = useState("");

    const reconfigCurrentParentId = (e: React.SubmitEvent<HTMLFormElement>, id: string) : void => {
        e.preventDefault();
        setCurrentParentId(id);
    }


    return (
        <>
            <div className={style.center}>

            <div className={style.url}></div>
            
            


            <div>Create a folder</div>
            <Form onSubmit={createFolder}>
                <input 
                    type="text"
                    value={folderNameInput}
                    onChange={(e) => setFolderNameInput(e.target.value)}
                />
                <input type="submit"/>
            </Form>

            <div>Change Parent</div>
            <Form onSubmit={(e) => reconfigCurrentParentId(e, id)}>
                <input 
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input type="submit"/>
            </Form>
            </div>
        </>
    )
};

export default Terminal_Test;