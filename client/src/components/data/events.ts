

export const APP_EVENTS = {
    OPEN_APP: 'app:open',
} as const;

export interface OpenAppDetail {
    appId: string;
}

export function dispatchOpenApp(appId: string) {
    window.dispatchEvent(
        new CustomEvent<OpenAppDetail>(APP_EVENTS.OPEN_APP, { detail: { appId } })
    );
}