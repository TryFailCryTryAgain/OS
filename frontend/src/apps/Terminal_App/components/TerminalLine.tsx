import type { ShellLine } from '../shell/types';
import style from './Terminal.module.css';

type Props = {
    line: ShellLine;
};

const lineStyleMap: Record<ShellLine['type'], string> = {
    input: style.Line_Input,
    output: style.Line_Output,
    error: style.Line_Error,
};

export function TerminalLine({ line }: Props) {
    if (line.type === 'input') {
        return <div className="terminal-line terminal-line--input">&gt; {line.text}</div>;
    }

    return (
        <div className={`${style.Line} ${lineStyleMap[line.type]}`}>
            {line.text}
        </div>
    );
}