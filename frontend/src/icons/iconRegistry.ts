import terminal from '../assets/heroicons-outline_terminal.svg';
import folder from '../assets/heroicons-outline_folder.svg';
import notepad from '../assets/lucide_notebook.svg';


export interface IconData {
    id: string;
    appId: string;
    x: number;
    y: number;
    label: string;
    icon?: string;
}

export const initialIcons: IconData[] = [
    { id: 'terminal', appId: 'terminal', x: 20, y: 20, label: 'Terminal', icon: terminal },
    { id: 'files', appId: 'files', x: 20, y: 100, label: 'Files', icon: folder },
    { id: 'notepad', appId: 'notepad', x: 20 , y: 180, label: 'Notepad', icon: notepad }
]