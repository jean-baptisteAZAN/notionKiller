import postgres from 'postgres'

export const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
})
