export function isValidJsonString(input: string): boolean {
    try {
        JSON.parse(input);
    } catch (e: any) {
        return false;
    }

    return true;
}

export function hasEmptyValues(input: any): boolean {
    for (const value of Object.values(input)) {
        if (value === '' || !value || value === null) return true;
    }

    return false;
}

// Utility functions
export function cleanTitle(title: string): string {
    // Remove spaces and convert to lowercase
    return title.replace(/\s+/g, '-').toLowerCase();
}

export function restoreTitle(cleanedTitle: string): string {
    // Replace hyphens with spaces and capitalize words
    const words = cleanedTitle.split('-');
    const restoredTitle = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return restoredTitle;
}
