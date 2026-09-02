import style from './Icon_Layout.module.css';
import { initialIcons, type IconData } from '../icons/iconRegistry';
import { useRef, useState, useEffect } from 'react';
import { dispatchOpenApp } from '../apps/events';
import Window_Overlay from './Window_Overlay';



// interface IconProps {
//     icon: IconData;

// }


function Icon_Layout() {
    const [icons, setIcons] = useState(initialIcons);

    const containerRef = useRef<HTMLElement>(null);
    const draggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleDrag = (id: string, x: number, y: number) => {
        setIcons((prev) =>
        prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon))
        );
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        e.preventDefault();
        draggingRef.current = true;

        const rect = e.currentTarget.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!draggingRef.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newX = e.clientX - containerRect.left - offsetRef.current.x;
            const newY = e.clientY - containerRect.top - offsetRef.current.y;

            handleDrag(id, newX, newY);
        };

        const handleMouseUp = () => {
            draggingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    return (
        <>
            <section 
                className={style.icon_layout}
                ref={containerRef}
            >

                {icons.map((icon) => (
                    <div
                        className={style.icon}
                        style={{
                            position: 'absolute',
                            left: icon.x,
                            top: icon.y
                        }}
                        onMouseDown={(e) => handleMouseDown(e, icon.id)}
                        onClick={() => dispatchOpenApp(icon.appId)}
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
                        
                        <span>{icon.label}</span>
                    </div>
                ))}


                <Window_Overlay />



            </section>
        </>
    )
};

export default Icon_Layout;