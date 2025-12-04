import { useCallback, useState } from 'react';
import { getConfig, type LintConfig, setConfig as setGlobalConfig } from '../config';

export function useConfig() {
    const [, forceUpdate] = useState({});

    const updateConfig = useCallback((newConfig: LintConfig) => {
        setGlobalConfig(newConfig);
        forceUpdate({}); // Force component re-render
    }, []);

    return {
        config: getConfig(),
        updateConfig,
    };
}