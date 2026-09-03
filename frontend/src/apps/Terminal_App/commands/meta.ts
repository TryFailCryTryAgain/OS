// Command descriptions, kept separate from registry.ts to avoid a circular import
// (registry.ts needs to include `help`, and `help` needs to describe every command).
export const commandMeta: Record<string, { usage: string; description: string }> = {
    cd:    { usage: 'cd <path>',        description: 'change the current directory' },
    ls:    { usage: 'ls',               description: 'list contents of the current directory' },
    mkdir: { usage: 'mkdir <name>',     description: 'create a new folder' },
    touch: { usage: 'touch <name>',     description: 'create a new empty file' },
    cat:   { usage: 'cat <name>',       description: 'print the contents of a file' },
    rm:    { usage: 'rm <name>',        description: 'delete a file or empty folder' },
    pwd:   { usage: 'pwd',              description: 'print the current directory path' },
    help:  { usage: 'help [command]',   description: 'list available commands, or show detail on one' },
    echo: { usage: 'echo [text] [name?]', description: 'add text to file or output text to terminal'}
};