export function isValidJsonString<T>(input: string): boolean {
    try {
        JSON.parse(input)
    } catch (e: any) {
        return false;
    }

    return true
}

export function hasEmptyValues(input: any): boolean {
    for(const value of Object.values(input)) {
        if(value === "" || !value || value === null) return true;
    }

    return false;
}