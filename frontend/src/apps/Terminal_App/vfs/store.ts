import type { VFSState } from './types';
import { createInitialState } from './initialState';

const STORAGE_KEY = 'vfs-state';
const CHANGE_EVENT = 'vfs:change';

function loadFromStorage(): VFSState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            return JSON.parse(raw) as VFSState;
        } catch {
            // corrupted data — fall back to a fresh tree rather than crashing
        }
    }
    return createInitialState();
}

function saveToStorage(state: VFSState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getState(): VFSState {
    return loadFromStorage();
}

// Read current state, apply a mutation in place, persist, notify listeners.
export function updateState(mutator: (state: VFSState) => void): VFSState {
    const state = loadFromStorage();
    mutator(state);
    saveToStorage(state);
    return state;
}

export function subscribe(callback: () => void): () => void {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
}