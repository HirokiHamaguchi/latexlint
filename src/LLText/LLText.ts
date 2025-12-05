/**
 * Data structure containing LaTeX text information and its processed metadata
 */
export interface LLText {
    /** The raw LaTeX text content */
    text: string;
    /** Array of [start, end] indices for align-like environments */
    alignLikeEnvs: [number, number][];
    /** Array of [start, end] indices for valid ranges (not in comments or verbatim) */
    validRanges: [number, number][];
    /**
     * Check if a position is in a valid range (not in comments or verbatim)
     * @param idx Character index in the text
     * @returns true if the position is valid
     */
    isValid(idx: number): boolean;
}