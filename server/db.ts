import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Prevent idle connections from timing out
  idleTimeoutMillis: 30000,
  // Keep at least one connection available
  min: 1,
  // Maximum number of connections
  max: 20,
});

export const db = drizzle({ client: pool, schema });

// Keep the process alive by preventing pool from becoming idle
// This is critical for deployed environments where the process must stay running
let keepAliveInterval: NodeJS.Timeout | undefined;

export function startPoolKeepalive() {
  if (keepAliveInterval) return;
  
  keepAliveInterval = setInterval(async () => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
    } catch (err) {
      console.error('Keepalive query failed:', err);
    }
  }, 25000); // Query every 25 seconds to keep connection alive (below 30s idle timeout)
  
  // Don't let this interval prevent process exit in development
  if (keepAliveInterval.unref) {
    keepAliveInterval.unref();
  }
}

export function stopPoolKeepalive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = undefined;
  }
}
