

export const APP_EVENTS = {
    OPEN_APP: 'app:open',
    CLOSE_APP: 'app:close',
    FOUCS_APP: 'app:foucs'
} as const;

export interface OpenAppDetail {
    appId: string;
}

export function dispatchOpenApp(appId: string) {
    window.dispatchEvent(
        new CustomEvent<OpenAppDetail>(APP_EVENTS.OPEN_APP, { detail: { appId } })
    );
}

export interface CloseAppDetail {
    windowId: string;
}

export function dispatchCloseApp(windowId: string) {
    window.dispatchEvent(
        new CustomEvent<CloseAppDetail>(APP_EVENTS.CLOSE_APP, { detail: { windowId} })
    );
}

export interface FocusAppDetail {
    windowId: string;
}

export function dispatchFocusApp(windowId: string) {
    window.dispatchEvent(
        new CustomEvent<FocusAppDetail>(APP_EVENTS.FOUCS_APP, { detail: { windowId} })
    );
}