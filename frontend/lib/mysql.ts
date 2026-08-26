import fs from 'fs';
import path from 'path';
import { getAll, insert } from "@/lib/db";

let mysql: any;
try {
    // Attempt to load the native driver
    mysql = require('mysql2/promise');
} catch (e) {
    // If native driver is missing, we use our local JSON DB fallback
}

let pool: any;

export const getDb = async () => {
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL && !process.env.DB_HOST) {
        return null;
    }

    if (mysql && (process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER))) {
        if (!pool) {
            try {
                const config = process.env.DATABASE_URL ? process.env.DATABASE_URL : {
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER || 'root',
                    password: process.env.DB_PASSWORD || '',
                    database: process.env.DB_NAME || 'siid_flash',
                    port: parseInt(process.env.DB_PORT || '3306'),
                    waitForConnections: true,
                    connectionLimit: 5,
                    queueLimit: 0,
                    connectTimeout: 2000
                };
                
                pool = mysql.createPool(config);
                const conn = await pool.getConnection();
                conn.release();
            } catch (err) {
                console.warn("SQL Server connection failed. Using JSON DB fallback.");
                return null;
            }
        }
        return pool;
    }
    return null;
};

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await getDb();
    
    // 1. If we have a native connection, use it
    if (db) {
        const [results] = await db.execute(sql, params);
        return results as T[];
    }

    // 2. Fallback to lib/db.ts (JSON File Emulation)
    const table = sql.match(/FROM\s+(\w+)/i)?.[1] || "users";
    const data = getAll(table);

    // Handle SELECT * FROM users WHERE email = ?
    if (sql.includes("WHERE email = ?")) {
        const email = (params[0] || "").toLowerCase();
        return data.filter((u: any) => u.email?.toLowerCase() === email) as T[];
    }

    // Handle SELECT id, ... FROM users WHERE id = ?
    if (sql.includes("WHERE id = ?")) {
        const userId = params[0].toString();
        return data.filter((u: any) => (u.id || u._id || "").toString() === userId) as T[];
    }

    // Handle INSERT INTO users (...)
    if (sql.toUpperCase().includes("INSERT INTO")) {
        const names = sql.match(/\((.*?)\)/)?.[1]?.split(",").map(n => n.trim()) || [];
        const newUser: any = { id: `u${Date.now()}` };
        names.forEach((name, i) => {
            newUser[name] = params[i];
        });
        insert(table, newUser);
        return { insertId: newUser.id } as any;
    }

    return data as T[];
}
