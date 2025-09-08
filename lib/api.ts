export function getBackendApiUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error("API Base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.");
    }
    // Ensure the base URL doesn't have a trailing slash
    const sanitizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    // Ensure the path has a leading slash
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${sanitizedBase}${sanitizedPath}`;
}