import styles from './TerminalWindow.module.css';
import { useState } from 'react';

function TerminalWindow() {
  const [value, setValue] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const printLine = (line: string) => {
    setOutput((prev) => [...prev, line]);
  };

  // Each command receives the remaining text after the command word as a single string.
  const commands: Record<string, (args: string) => void> = {
    echo: (args) => {
      printLine(args);
    },
    clear: () => {
      setOutput([]);
    },
    help: () => {
      printLine(Object.keys(commands).join(', '));
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) return;

    const spaceIndex = trimmed.indexOf(' ');
    const commandName = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
    const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1);

    const handler = commands[commandName];

    if (handler) {
      handler(args);
    } else {
      printLine(`command not found: ${commandName}`);
    }

    setValue('');
  };

  return (
    <section className={styles.TerminalWindow}>
      <div className={styles.TerminalMainView}>
        {output.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <form className={styles.TerminalFooterWrapper} onSubmit={handleSubmit}>
        <input
          className={styles.TerminalFooter}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </section>
  );
}

export default TerminalWindow;