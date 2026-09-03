import Terminal from "./Terminal_App/components/Terminal";
import Files from "./File_Explorer_App/Files";
import Notepad from "./Notepad_App/Notepad";


export interface AppDefinition {
    title: string;
    component: React.ComponentType;
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
    terminal: { title: 'Terminal', component: Terminal},
    files: { title: 'Files', component: Files},
    notepad: { title: 'Notepad', component: Notepad}
}