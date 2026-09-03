import style from './Terminal.module.css';
import { useState } from 'react';
import { TerminalOutput } from './Terminal_Output';
import { TerminalInput } from './Terminal_Input';
import { useShell } from '../hooks/useShell';
import { buildPathString } from '../vfs/path';

function Terminal() {
    const { state, lines, input, setInput, submit, recallPrevious, recallNext } = useShell();
    const promptPath = buildPathString(state.cwdId, state);


    return (
        <>

            <div
                className={style.Terminal_Window}
            >
                <TerminalOutput 
                    lines={lines}
                />
                <TerminalInput 
                    promptPath={promptPath}
                    value={input}
                    onChange={setInput}
                    onSubmit={submit}
                    onArrowUp={recallPrevious}
                    onArrowDown={recallNext}
                />
                
            </div>
        
        </>
    )
};

export default Terminal;