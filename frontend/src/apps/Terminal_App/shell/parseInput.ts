import type { ParsedInput } from './types';

// "cd Folder1" -> { command: "cd", args: ["Folder1"] }
// Handles simple quoted strings so names with spaces work: mkdir "My Folder"
export function parseInput(line: string): ParsedInput {
    const trimmed = line.trim();
    if (!trimmed) return { command: '', args: [] };

    const tokens: string[] = [];
    const regex = /"([^"]*)"|(\S+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(trimmed)) !== null) {
        tokens.push(match[1] !== undefined ? match[1] : match[2]);
    }

    const [command, ...args] = tokens;
    return { command: command.toLowerCase(), args };
}