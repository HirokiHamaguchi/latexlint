export default function formatException(exception: string): string {
    // Replace multiple spaces with a single space
    exception = exception.replace(/\s+/g, ' ');
    // Remove leading and trailing spaces
    exception = exception.trim();
    return exception;
}