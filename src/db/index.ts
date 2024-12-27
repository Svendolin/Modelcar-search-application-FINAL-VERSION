// The place where we call the database and get the products
// [!] Changed with drizzle docs Correction suggested by CoPilot

import 'dotenv/config';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connector = neon(process.env.DATABASE_URL!);

export const db = drizzle(connector);