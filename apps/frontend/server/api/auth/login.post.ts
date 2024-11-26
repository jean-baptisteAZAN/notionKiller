export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    try {
        const response = await fetch(`${config.apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                message: 'Authentication failed'
            })
        }

        const data = await response.json()

        setCookie(event, 'auth-token', data.token, {
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            secure: true,
            sameSite: 'lax'
        })

        return data
    } catch (error) {
        console.error('Login error:', error)
        throw createError({
            statusCode: 500,
            message: 'Authentication failed'
        })
    }
})