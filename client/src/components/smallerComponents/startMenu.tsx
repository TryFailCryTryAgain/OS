
import { useState } from 'react';
import menuIcon from '../../assets/Icons/menu_icon.svg';
import styles from './startMenu.module.css';
import StartMenuPopup from './startMenuPopup';

function StartMenu() {

    const [startMenuPopup, setStartMenuPopup] = useState(false);


    function ToggleMenu() {
        setStartMenuPopup(!startMenuPopup);
    }

    return (


        <>
            <img 
                src={menuIcon} 
                alt="menu" 
                className={styles.startMenuIcon}
                onClick={ToggleMenu}
            />

            {startMenuPopup && (
                <StartMenuPopup />
            )}
            
            
        </>
    )
}

export default StartMenu