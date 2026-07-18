import TerminalWindow from "./terminal/TerminalWindow";
import NotepadWindow from "./notepad/NotepadWindow";

export interface AppDefinition {
    title: string;
    component: React.ComponentType;
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
    terminal: { title: 'Terminal', component: TerminalWindow },
    notepad: { title: 'Notepad', component: NotepadWindow}
};