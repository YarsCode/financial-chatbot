export function replacePlaceholders(text: string, userName: string): string {
    return text.replace(/\{\{name\}\}/g, userName);
}
