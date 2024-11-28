// config/db.ts
import postgres from 'postgres'

const sql = postgres({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

// Test la connexion
const testConnection = async () => {
    try {
        const result = await sql`SELECT 1`
        console.log('Database connection successful')
    } catch (error) {
        console.error('Database connection error:', error)
    }
}

testConnection()

export { sql }