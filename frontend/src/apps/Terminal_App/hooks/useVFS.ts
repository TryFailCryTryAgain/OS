import { useEffect, useState } from 'react';
import { getState, subscribe } from '../vfs/store';
import type { VFSState } from '../vfs/types';

// Subscribes a component to VFS changes — re-renders whenever store.updateState() runs.
export function useVFS(): VFSState {
    const [state, setState] = useState<VFSState>(getState());

    useEffect(() => {
        return subscribe(() => setState(getState()));
    }, []);

    return state;
}