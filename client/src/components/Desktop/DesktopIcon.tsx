import { useRef, useState, useEffect } from 'react';
import type { DesktopIconData } from '../data/icons';
import styles from './DesktopIcon.module.css';
import DesktopIconMenu from './DesktopIconMenu';

interface DesktopIconProps {
  icon: DesktopIconData;
  onDrag: (id: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onOpenApp: (appId: string) => void;
}

function DesktopIcon({
  icon,
  onDrag,
  containerRef,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  onOpenApp,
}: DesktopIconProps) {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Local: only the click coordinates for this icon's menu
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onCloseMenu(); // close menu if a drag starts

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

      onDrag(icon.id, newX, newY);
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  function handleRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault(); // disable native context menu
    setMenuPos({ x: e.clientX, y: e.clientY });
    onOpenMenu();
  }

  // Close this icon's menu if the user clicks anywhere else on the page
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = () => onCloseMenu();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, onCloseMenu]);


  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onOpenMenu();
  };

  return (
    <div
      className={styles.desktopIcon}
      onMouseDown={handleMouseDown}
      onContextMenu={handleRightClick}
      style={{
        position: 'absolute',
        left: icon.x,
        top: icon.y,
      }}
    >
      <div className={styles.iconImage} />
      <span>{icon.label}</span>

      {isMenuOpen && (
        <DesktopIconMenu
          x={menuPos.x}
          y={menuPos.y}
          onClose={onCloseMenu}
          onOpen={() => onOpenApp(icon.appId)}
        />
      )}
    </div>
  );
}

export default DesktopIcon;