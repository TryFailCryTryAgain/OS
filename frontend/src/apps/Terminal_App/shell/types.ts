export type ParsedInput = {
    command: string;
    args: string[];
};

export type ShellLine = {
    id: string;
    type: 'input' | 'output' | 'error';
    text: string;
};