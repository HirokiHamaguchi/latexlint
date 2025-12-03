/**
 * Data structure containing LaTeX text information and its processed metadata
 */
export interface LLText {
    /** The raw LaTeX text content */
    text: string;
    /** Array of [start, end] indices for align-like environments */
    alignLikeEnvs: [number, number][];
    // Future extensions will be added here
}