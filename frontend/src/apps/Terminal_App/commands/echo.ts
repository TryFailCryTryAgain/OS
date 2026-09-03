import { findChildByName } from "../vfs/queries";
import type { Command } from "./types";

export const echo: Command = (args, ctx) => {

    const separatorIndex = args.indexOf(">");

    // No ">" found — just print everything as text
    if (separatorIndex === -1) {
        const text = args.join(" ");
        if (!text) {
            return { output: `echo: missing text content`, error: true };
        }
        return { output: text };
    }

    // Everything left of ">" is the text
    const textParts = args.slice(0, separatorIndex);
    const text = textParts.join(" ");

    if (!text) {
        return { output: `echo: missing text content`, error: true };
    }

    // Everything right of ">" is the filename
    const nameParts = args.slice(separatorIndex + 1);
    const name = nameParts[0]; // usually just one word, but see note below

    if (!name) {
        return { output: `echo: missing file name`, error: true };
    }

    const node = findChildByName(ctx.cwdId, name, ctx.state);

    if (!node) {
        return { output: `echo: no such file ${name}`, error: true };
    }
    if (node.type !== 'file') {
        return { output: `echo: not a file ${name}`, error: true };
    }

    node.content = node.content ? node.content + "\n" + text : text;

    return { output: node.content };
}