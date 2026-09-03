// Tracks previously entered commands and supports up/down arrow recall.
export class CommandHistory {
    private entries: string[] = [];
    private cursor: number = -1; // -1 means "not currently browsing history"

    push(entry: string) {
        if (entry.trim() === '') return;
        this.entries.push(entry);
        this.cursor = this.entries.length; // reset cursor to "past the end"
    }

    previous(): string | undefined {
        if (this.entries.length === 0) return undefined;
        this.cursor = Math.max(0, this.cursor - 1);
        return this.entries[this.cursor];
    }

    next(): string | undefined {
        if (this.entries.length === 0) return undefined;
        this.cursor = Math.min(this.entries.length, this.cursor + 1);
        return this.entries[this.cursor]; // undefined when past the end — caller should clear input
    }

    reset() {
        this.cursor = this.entries.length;
    }
}