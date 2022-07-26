
export function getString(message: string, defaultValue?: string): string | null {
    return window.prompt(message, defaultValue);
}