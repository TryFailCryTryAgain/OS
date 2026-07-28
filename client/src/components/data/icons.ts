export interface DesktopIconData {
  id: string;
  appId: string;
  x: number;
  y: number;
  label: string;
}

export const initialIcons: DesktopIconData[] = [
  { id: 'notepad', appId: 'notepad', x: 20, y: 20, label: 'Notepad' },
  { id: 'cv', appId: 'cv', x: 20, y: 100, label: 'CV'},
  { id: 'terminal', appId: 'terminal', x: 20, y: 180, label: 'Terminal'},
  { id: 'Testfile.txt', appId: 'text.txt', x: 20, y: 260, label: 'Testfile.txt'},
  { id: 'files', appId: 'files', x: 100, y: 20, label: 'Files'},
];

