import DesktopIcon from './Desktop/DesktopIcon';
import { initialIcons } from './data/icons';
import { APP_REGISTRY } from './apps/appRegistry';
import { useState, useRef } from 'react';
import styles from './mainContainer.module.css';

interface OpenWindow {
  windowId: string;
  appId: string;
}

function MainContainer() {
  const [icons, setIcons] = useState(initialIcons);
  const containerRef = useRef<HTMLElement>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const handleDrag = (id: string, x: number, y: number) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon))
    );
  };

  const handleOpenApp = (appId: string) => {
    setOpenWindows((prev) => {
      // avoid opening duplicate windows for the same app
      if (prev.some((w) => w.appId === appId)) return prev;
      return [...prev, { windowId: crypto.randomUUID(), appId }];
    });
  };

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.windowId !== windowId));
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

        return (
          <div key={win.windowId} className={styles.windowOverlay}>
            <div className={styles.windowTitleBar}>
              <span>{app.title}</span>
              <button onClick={() => handleCloseWindow(win.windowId)}>✕</button>
            </div>
            <AppComponent />
          </div>
        );
      })}
    </main>
  );
}

export default MainContainer;