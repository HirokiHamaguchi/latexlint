/**
 * Common interface for MyTextLint check results
 */
export interface MyTextLintError {
    message: string;
    range: [number, number];
}