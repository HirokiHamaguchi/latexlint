import configData from "../assets/auto_generated_config.json";

export interface LintConfig {
  userDefinedRules: string[];
  exceptions: string[];
  LLCrefExceptions: string[];
  disabledRules: string[];
}

export interface ConfigFieldMetadata {
  type: string;
  default: string[];
  description: string;
  items?: {
    type: string;
    enum: string[];
    uniqueItems: boolean;
  };
}

type ConfigData = Record<keyof LintConfig, ConfigFieldMetadata>;
type ConfigChangeListener = () => void;

export const configMetadata = configData as ConfigData;

export const defaultConfig: LintConfig = Object.keys(configData).reduce(
  (acc, key) => {
    acc[key as keyof LintConfig] =
      configData[key as keyof typeof configData].default;
    return acc;
  },
  {} as LintConfig
);

// Global mutable config for web version
export let currentConfig: LintConfig = { ...defaultConfig };
const listeners = new Set<ConfigChangeListener>();

export function setConfig(newConfig: LintConfig): void {
  currentConfig = { ...newConfig };
  listeners.forEach((listener) => listener());
}

export function getConfig(): LintConfig {
  return currentConfig;
}

export function resetConfig(): void {
  currentConfig = { ...defaultConfig };
  listeners.forEach((listener) => listener());
}

export function subscribeConfig(listener: ConfigChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
