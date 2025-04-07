import { drizzle } from 'drizzle-orm/d1';
import { PersonalTable } from './src/db/schema';

export interface Env {
  DB: D1Database; // Replace <BINDING_NAME> with your actual binding name, e.g., DB
}

const handler = {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
    const result = await db.select().from(PersonalTable).all();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export default handler;