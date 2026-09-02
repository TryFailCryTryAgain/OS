import { APP_EVENTS, type OpenAppDetail, type CloseAppDetail, type FocusAppDetail, dispatchCloseApp } from '../apps/events';
import { APP_REGISTRY } from '../apps/appRegistry';
import style from './Window_Overlay.module.css';
import { useState, useRef, useCallback, useEffect } from 'react';

interface OpenWindow {
  windowId: string;
  appId: string;
  x: number;
  y: number;
  zIndex: number;
}

function Window_Overlay() {

  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set());

  const zIndexCounter = useRef(10);

  // refs to each window's DOM node + its pre-maximize inline size,
  // needed for drag positioning and for restoring exact size on un-maximize
  const windowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const savedSizes = useRef<Map<string, { width: string; height: string }>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const windowOffsetRef = useRef({ x: 0, y: 0 });
  const windowDraggingRef = useRef(false);

  const handleOpenApp = useCallback((appId: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.appId === appId)) return prev;
      zIndexCounter.current += 1;
      return [...prev, { windowId: crypto.randomUUID(), appId, x: 200, y: 100, zIndex: zIndexCounter.current }];
    });
  }, []);

  useEffect(() => {
    const listener = (e: Event) => {
      const { appId } = (e as CustomEvent<OpenAppDetail>).detail;
      handleOpenApp(appId);
    };

    window.addEventListener(APP_EVENTS.OPEN_APP, listener);
    return () => window.removeEventListener(APP_EVENTS.OPEN_APP, listener);
  }, [handleOpenApp]);

  const handleCloseWindow = useCallback((windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.windowId !== windowId));
    windowRefs.current.delete(windowId);
    savedSizes.current.delete(windowId);
  }, []);

  useEffect(() => {
    const listener = (e: Event) => {
      const { windowId } = (e as CustomEvent<CloseAppDetail>).detail;
      handleCloseWindow(windowId);
    };

    window.addEventListener(APP_EVENTS.CLOSE_APP, listener);
    return () => window.removeEventListener(APP_EVENTS.CLOSE_APP, listener);
  }, [handleCloseWindow]);

  // --- focus / bring-to-front ---

  const bringToFront = useCallback((windowId: string) => {
    zIndexCounter.current += 1;
    const nextZ = zIndexCounter.current;
    setOpenWindows((prev) =>
      prev.map((w) => (w.windowId === windowId ? { ...w, zIndex: nextZ } : w))
    );
  }, []);

  useEffect(() => {
    const listener = (e: Event) => {
      const { windowId } = (e as CustomEvent<FocusAppDetail>).detail;
      bringToFront(windowId);
    };
    window.addEventListener(APP_EVENTS.FOCUS_APP, listener);
    return () => window.removeEventListener(APP_EVENTS.FOCUS_APP, listener);
  }, [bringToFront]);

  // --- maximize / restore ---

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
        // maximizing: save current inline size, then clear it so the CSS class wins
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

  // --- drag ---

  const handleWindowDrag = (windowId: string, x: number, y: number) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.windowId === windowId ? { ...w, x, y } : w))
    );
  };

  const handleTitleBarMouseDown = (
    e: React.MouseEvent<HTMLElement>,
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowDraggingRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - windowOffsetRef.current.x;
      const newY = e.clientY - containerRect.top - windowOffsetRef.current.y;

      handleWindowDrag(windowId, newX, newY);
    };

    const handleMouseUp = () => {
      windowDraggingRef.current = false;
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
  };

  return (
    <div ref={containerRef} className={style.container}>
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
            className={`${style.Window_Overlay} ${isMaximized ? style.maximized_window : ''}`}
            style={{
              ...(isMaximized ? {} : { left: win.x, top: win.y }),
              zIndex: win.zIndex,
            }}
            onMouseDownCapture={() => bringToFront(win.windowId)}
          >
            <header
              onMouseDown={(e) => handleTitleBarMouseDown(e, win.windowId)}
            >
              <span className={style.title}>{app.title}</span>
              <span className={style.button_container}>
                {isMaximized ? (
                  <>
                    <button
                      className={style.minimize}
                      onClick={() => resizeWindow(win.windowId)}
                    >
                      ❐
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={style.maximize}
                      onClick={() => resizeWindow(win.windowId)}
                    >
                      ⛶
                    </button>
                  </>
                )}
                <button
                  className={style.close}
                  onClick={() => dispatchCloseApp(win.windowId)}
                >
                  ✕
                </button>
              </span>
            </header>

              <AppComponent />
          </div>
        );
      })}
    </div>
  );
}

export default Window_Overlay;