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
    /** Index of \begin{document} in the text, or -1 if not found */
    idxOfBeginDocument: number;
    /**
     * Check if a position is in a valid range (not in comments or verbatim)
     * @param idx Character index in the text
     * @returns true if the position is valid
     */
    isValid(idx: number): boolean;
    /**
     * Check if a position is in the preamble (before \begin{document})
     * @param idx Character index in the text
     * @returns true if the position is in the preamble
     */
    isPreamble(idx: number): boolean;
}
