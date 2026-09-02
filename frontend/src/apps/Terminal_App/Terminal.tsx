import style from './Terminal.module.css';
import { useState } from 'react';

function Terminal() {

    const [input, setInput] = useState("");


    const handleSubmit = (e: React.SubmitEvent ) => {
        e.preventDefault();
        setInput("")
    }

    return (
        <>

            <form
                onSubmit={handleSubmit}
                className={style.Terminal_Window}
            >




                <div className={style.input_container}>
                    <input 
                        className={style.input} 
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <input className={style.button} type='submit'/>
                </div>
                
            </form>
        
        </>
    )
};

export default Terminal;