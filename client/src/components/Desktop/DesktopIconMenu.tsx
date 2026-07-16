import styles from './DesktopIconMenu.module.css';

interface DesktopIconMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpen: () => void;
}

function DesktopIconMenu({ x, y, onClose, onOpen }: DesktopIconMenuProps) {

  const handleOpenClick = () => {
    onOpen();
    onClose();
  };


  return (
    <ul
      className={styles.desktopIconMenu}
      style={{
        position: 'fixed',
        left: x,
        top: y,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <li onClick={handleOpenClick}>Open</li>
    </ul>
  );
}

export default DesktopIconMenu;