
import styles from './startMenuPopup.module.css';
import { dispatchOpenApp } from '../data/events';

function StartMenuPopup() {


    return (
        <>

            <div className={styles.StartMenuPopup}>
                <aside>
                    <div
                        onClick={() => dispatchOpenApp('files')}
                    >
                        &#128193;
                    </div>
                </aside>

                <main>

                </main>
            </div>

        </>
    );
};

export default StartMenuPopup;