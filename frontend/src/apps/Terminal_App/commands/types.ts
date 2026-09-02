import type { VFSState } from "../vfs/types";

export type CommandContext = {
    state: VFSState;
    cwdId: string;
}

export type CommandResult = {
    output: string;
    error?: boolean;
    newCwdId?: string;
};

export type Command = (args: string[], ctx: CommandContext) => CommandResult;