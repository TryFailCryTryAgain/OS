import { useState } from 'react';
import styles from './NotepadWindow.module.css';

function Notepad() {

    const [content, SetContent] = useState('');

    function handleTextChange(e: React.InputEvent<HTMLDivElement>) {
        const html = e.currentTarget.innerHTML ?? '';
        SetContent(html);
    }

    function LogTextContent() {
        console.log(content);
    }


    return (
        <div className={styles.NotepadDisplay}>

            <div className={styles.NotepadHeader}>
                <button
                    onClick={LogTextContent}
                >
                    Log the content
                </button>
            </div>

            <div 
                className={styles.NotepadMain}
                onInput={handleTextChange}
                contentEditable="true"
            >

            </div>

        </div>
    )

}

export default Notepad;