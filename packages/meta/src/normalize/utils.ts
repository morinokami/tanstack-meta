export function resolveArray<T>(value: T | T[]): T[] {
	if (Array.isArray(value)) {
		return value;
	}
	return [value];
}

export function resolveAsArrayOrUndefined<T>(
	value: T | T[] | undefined | null,
): T[] | undefined {
	if (typeof value === "undefined" || value === null) {
		return undefined;
	}
	return resolveArray(value);
}

// biome-ignore lint/suspicious/noExplicitAny: reason
export function isStringOrURL(icon: any): icon is string | URL {
	return typeof icon === "string" || icon instanceof URL;
}
