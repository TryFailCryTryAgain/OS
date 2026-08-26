import styles from './footer.module.css';
import StartMenu from './smallerComponents/startMenu';
import TaskbarItem from './smallerComponents/TaskbarItem';
import { APP_REGISTRY } from './apps/appRegistry';

interface OpenWindowRef {
  windowId: string;
  appId: string;
}

interface FooterProps {
  openWindows: OpenWindowRef[];
  activeWindowId: string | null;
  windowRefs: React.RefObject<Map<string, HTMLDivElement>>;
}

function Footer({ openWindows, activeWindowId, windowRefs }: FooterProps) {
  return (
    <footer className={styles.FooterStyling}>
      <StartMenu />

      <div className={styles.TaskbarItems}>
        {openWindows.map((win) => {
          const app = APP_REGISTRY[win.appId];
          if (!app) return null;
          return (
            <TaskbarItem
              key={win.windowId}
              windowId={win.windowId}
              title={app.title}
              isActive={activeWindowId === win.windowId}
              windowRefs={windowRefs}
            />
          );
        })}
      </div>

      <div className={styles.FooterIcons}>
        <div className={styles.Icon} />
      </div>
    </footer>
  );
}

export default Footer;