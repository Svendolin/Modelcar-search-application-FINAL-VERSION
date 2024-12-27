
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation"; // Personally fixed with Copilot
// The Search folder will end up in the URL path /search
// Page.tsx will be the content shown under the queried URL
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  }
}

const Page = async ({searchParams}: PageProps) => {
  const query = searchParams.query; // query is the key in the searchParams object which will be either a type string or an array of strings or undefined.
  
  if (Array.isArray(query) || !query) { // !query = is true if query is undefined
    return redirect('/') // We can not process an array of queries or an undefined query especially if its not a string. Redirect to the root page.
}

// Quering logic goes here to get the database that we want to show to the user
// Type safe SQL Syntax thanks to Drizzle ORM
// eslint-disable-next-line prefer-const
let products = await db // We will use let instead of const because we will be changing the value of products
.select()
.from(productsTable)
.where( // A combination of product name and description:
  sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
    productsTable.description
  })) @@ to_tsquery('simple', lower(${query
    .trim()
    .split(' ')
    .join(' & ')}))` // From the db(schema.ts) we are selecting the name column from the productsTable or as a Product description for one big string
)
.limit(3) // IMPORTANT: Over here we are limiting the amount of products to 3 (SHOWCASING)

// Render out everything we get from the database:
return <pre>{JSON.stringify(products)}</pre>


};
export default Page;