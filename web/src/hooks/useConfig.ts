import { useCallback, useSyncExternalStore } from 'react';
import {
    getConfig,
    type LintConfig,
    setConfig as setGlobalConfig,
    subscribeConfig,
} from '../config';

export function useConfig() {
    const config = useSyncExternalStore(subscribeConfig, getConfig, getConfig);

    const updateConfig = useCallback((newConfig: LintConfig) => {
        setGlobalConfig(newConfig);
    }, []);

    return {
        config,
        updateConfig,
    };
}
