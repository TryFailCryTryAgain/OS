import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { dispatchFocusApp, dispatchCloseApp } from '../data/events';
import styles from './TaskbarItem.module.css';

interface TaskbarItemProps {
  windowId: string;
  title: string;
  isActive: boolean;
  windowRefs: React.RefObject<Map<string, HTMLDivElement>>;
}

function TaskbarItem({ windowId, title, isActive, windowRefs }: TaskbarItemProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(async () => {
        const node = windowRefs.current?.get(windowId);
        if (!node) return;

        try {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const rect = node.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        const scale = 0.5;

        const dataUrl = await toPng(node, {
        cacheBust: true,
        width,
        height,
        canvasWidth: width * scale,
        canvasHeight: height * scale,
        style: {
            position: 'static',   // strip the absolute positioning that was pushing content off-canvas
            left: '0',
            top: '0',
            transform: 'none',
            margin: '0',
            width: `${width}px`,
            height: `${height}px`,
        },
        });

        setPreview(dataUrl);
        } catch (err) {
        console.error('preview capture failed:', err);
        setPreview(null);
        }
    }, 150);
    };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setPreview(null);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't also trigger focus
    dispatchCloseApp(windowId);
  };

  return (
    <div
      className={`${styles.taskbarItem} ${isActive ? styles.active : ''}`}
      onClick={() => dispatchFocusApp(windowId)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{title}</span>
      <button className={styles.closeButton} onClick={handleClose}>✕</button>

      {preview && (
        <div className={styles.previewPopup}>
          <img src={preview} alt={`${title} preview`} />
        </div>
      )}
    </div>
  );
}

export default TaskbarItem;