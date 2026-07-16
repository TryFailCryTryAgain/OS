import TerminalWindow from "./terminal/TerminalWindow";

export interface AppDefinition {
    title: string;
    component: React.ComponentType;
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
    terminal: { title: 'Terminal', component: TerminalWindow },
};