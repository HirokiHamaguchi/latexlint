export default function isInComment(text: string, idx: number): boolean {
    // Check if the idx is inside a comment, i.e., after a '%'
    // We do not detect comments by \if0 ... \fi (maybe ToDo)
    while (idx > 0 && text[idx - 1] !== '\n') {
        idx--;
        if (text[idx] === '%') return true;
    }
    return false;
}
