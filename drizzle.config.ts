import dotenv from 'dotenv';
import { Config } from 'drizzle-kit'; // Wasn't able to import the Config interface from drizzle-kit, so with CoPilot I had to add drizzle-kit.d.ts file at src folder

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Add this line to debug


const config: Config = {
  schema: "./src/db/schema.ts", // The schema where the tables are located
  dialect: 'postgresql',
  out: "./drizzle", // The output directory where the generated files will be placed
  dbCredentials: {
    url: process.env.DATABASE_URL || '' // Uses the URL from the .env file or an empty string as default
  }
};

export default config;