import { drizzle } from 'drizzle-orm/d1';
import { PersonalTable } from './db/schema';

export interface Env {
  DB: D1Database;
}

const worker = {
    async fetch(request: Request, env: Env) {
      const db = drizzle(env.DB);
      const result = await db.select().from(PersonalTable).all()
      return Response.json(result);
    },
  };
  
  export const db = drizzle(process.env.DB);
  export default worker;