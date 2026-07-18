import DesktopIcon from './Desktop/DesktopIcon';
import { initialIcons } from './data/icons';
import { APP_REGISTRY } from './apps/appRegistry';
import { useState, useRef } from 'react';
import styles from './mainContainer.module.css';

interface OpenWindow {
  windowId: string;
  appId: string;
  x: number;
  y: number;
}

function MainContainer() {
  const [icons, setIcons] = useState(initialIcons);
  const containerRef = useRef<HTMLElement>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set());

  // store each window's pre-maximize inline size so we can restore it exactly
  const windowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const savedSizes = useRef<Map<string, { width: string; height: string }>>(new Map());

  const windowOffsetRef = useRef({ x: 0, y: 0});
  const windowDraggingRef = useRef(false);

  const handleWindowDrag = (windowId: string, x: number, y: number) => {
    setOpenWindows((prev) =>
      prev.map((window) => (window.windowId === windowId ? { ...window, x, y} : window))
    );
  }

  const handleDrag = (id: string, x: number, y: number) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon))
    );
  };

  const handleOpenApp = (appId: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.appId === appId)) return prev;
      return [...prev, { windowId: crypto.randomUUID(), appId, x: 200, y: 100 }];
    });
  };

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.windowId !== windowId));
    windowRefs.current.delete(windowId);
    savedSizes.current.delete(windowId);
  };

  const resizeWindow = (windowId: string) => {
    const el = windowRefs.current.get(windowId);

    setMaximizedWindows((prev) => {
      const next = new Set(prev);

      if (next.has(windowId)) {
        // restoring: reapply the inline size it had before maximizing
        next.delete(windowId);
        if (el) {
          const saved = savedSizes.current.get(windowId);
          if (saved) {
            el.style.width = saved.width;
            el.style.height = saved.height;
          }
        }
      } else {
        // maximizing: save current inline size, then clear it so CSS class wins
        if (el) {
          savedSizes.current.set(windowId, {
            width: el.style.width,
            height: el.style.height,
          });
          el.style.width = '';
          el.style.height = '';
        }
        next.add(windowId);
      }

      return next;
    });
  };

  const handleTitleBarMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    windowId: string
  ) => {
    if (maximizedWindows.has(windowId)) return;
    if ((e.target as HTMLElement).closest('button')) return;

    windowDraggingRef.current = true;

    const windowEl = windowRefs.current.get(windowId);
    if (!windowEl) return;

    const rect = windowEl.getBoundingClientRect();
    windowOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const handleMOuseMove = (e: MouseEvent) => {
      if (!windowDraggingRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - windowOffsetRef.current.x;
      const newY = e.clientY - containerRect.top - windowOffsetRef.current.y;

      handleWindowDrag(windowId, newX, newY);
    };

    const handleMouseUp = () => {
      windowDraggingRef.current = false;
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMOuseMove);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMOuseMove);
  };

  return (
    <main ref={containerRef} className={styles.mainContainer}>
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onDrag={handleDrag}
          containerRef={containerRef}
          isMenuOpen={activeMenuId === icon.id}
          onOpenMenu={() => setActiveMenuId(icon.id)}
          onCloseMenu={() => setActiveMenuId(null)}
          onOpenApp={handleOpenApp}
        />
      ))}

      {openWindows.map((win) => {
        const app = APP_REGISTRY[win.appId];
        if (!app) return null;
        const AppComponent = app.component;
        const isMaximized = maximizedWindows.has(win.windowId);

        return (
          <div
            key={win.windowId}
            ref={(el) => {
              if (el) windowRefs.current.set(win.windowId, el);
              else windowRefs.current.delete(win.windowId);
            }}
            className={`${styles.windowOverlay} ${isMaximized ? styles.windowMaximized : ''}`}
            style={isMaximized ? undefined : { left: win.x, top: win.y }}
          >
            <div 
              className={styles.windowTitleBar}
              onMouseDown={(e) => handleTitleBarMouseDown(e, win.windowId)}
            >
              <span>{app.title}</span>
              <span className={styles.windowTitleBarButtonContainer}>
                <button onClick={() => resizeWindow(win.windowId)}>
                  {isMaximized ? '❐' : '⛶'}
                </button>
                <button onClick={() => handleCloseWindow(win.windowId)}>✕</button>
              </span>
            </div>
            <AppComponent />
          </div>
        );
      })}
    </main>
  );
}

export default MainContainer;