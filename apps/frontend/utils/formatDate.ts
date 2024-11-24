export function formatDate(dateString: string) {
    try {
        return new Date(dateString).toLocaleString();
    } catch (error) {
        return "Date unavailable";
    }
}