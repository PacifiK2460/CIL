import { NextApiRequest, NextApiResponse } from "next";
import { testConnection } from "@/lib/db";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'edge' // specify the runtime to be edge

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await testConnection();
  return new Response("Connection successful");

}