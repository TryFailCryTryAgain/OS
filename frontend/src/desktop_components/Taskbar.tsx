
import style from './Taskbar.module.css';
import Start_Menu_Icon from '../assets/heroicons-outline_start_menu.svg';
import { useState } from 'react';
import { initialIcons } from '../icons/iconRegistry';

function Taskbar() {

    const [startMenu, setStartMenu] = useState(false);

    const [icons, setIcons] = useState(initialIcons);

    return (
        <>

            {startMenu && (
                <section className={style.Start_Menu}>
                    
                    <aside>

                    </aside>

                    <div className={style.middle_panel}>
                        {icons.map((icon) => (
                            <div 
                                className={style.icon}
                            >
                                {icon.icon ? (
                                    <div className={style.icon_size}>
                                        <img src={icon.icon} alt="Icon"></img>
                                    </div>
                                ) : (
                                    <div className={style.icon_size}>
                                        <div className={style.default_icon_img}></div>
                                    </div>
                                )}
                                
                            </div>
                        ))}
                    </div>


                </section>
            )}


            <section className={style.Taskbar}>
                <div>
                    <img 
                        src={Start_Menu_Icon} 
                        alt="Start Menu Icon" 
                        className={style.Taskbar_Start_Menu_Icon}
                        onClick={() => setStartMenu(!startMenu)}
                    />
                </div>
            </section>
        </>
    )
};

export default Taskbar;