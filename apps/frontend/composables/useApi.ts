export const useApi = () => {
    const config = useRuntimeConfig()

    const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
        const url = `http://localhost:8000${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    return {
        fetchApi
    }
}