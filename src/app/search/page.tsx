
import { db } from "@/db";
import { Product, productsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation"; // Personally fixed with Copilot
import { vectorize } from "@/lib/vectorize";
import { Index } from '@upstash/vector';
import { X } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
// The Search folder will end up in the URL path /search
// Page.tsx will be the content shown under the queried URL
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  }
}

// The overlap of what we store in the Vector database and the main database from db > schema.ts
export type CoreProduct = Omit<Product, "createdAt" | "updatedAt">;
const index = new Index<CoreProduct>()

const Page = async ({searchParams}: PageProps) => {
  const query = searchParams.query; // query is the key in the searchParams object which will be either a type string or an array of strings or undefined.
  
  if (Array.isArray(query) || !query) { // !query = is true if query is undefined
    return redirect('/') // We can not process an array of queries or an undefined query especially if its not a string. Redirect to the root page.
}

// Quering logic goes here to get the database that we want to show to the user
// Type safe SQL Syntax thanks to Drizzle ORM
// eslint-disable-next-line prefer-const
let products: CoreProduct[] = await db // We will use let instead of const because we will be changing the value of products
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
if(products.length < 3) {
  // Over here we are searching cars by semantic similarity:
  const vector = await vectorize(query) // Asynchronous operation that vectorizes the query

  const res = await index.query({ // The amount of products we want to retrieve
    topK: 5, // The 5 most similar ones
    vector,
    includeMetadata: true,

  })

  /* The reason we are filtering in because it might very well happen that the products 
  from Postgres Database matches they might also retrieved from our vector database. 
  But we dont want duplicates, thats why we are getting more products that we actually 
  need so we can filter out all the duplicates that might be in there: */
  const vectorProducts = res.filter((existingProduct) => {
    if(products.some((product) => product.id === existingProduct.id) || 
    existingProduct.score < 0.9) {
      return false
    } else {
      return true
    }
    
  }).map(({metadata}) => metadata!) // To avoid being undefined, because we includeMetadata

  products.push(...vectorProducts) // We are pushing the vectorProducts into the products array
}

// Render out everything we get from the database:

if (products.length === 0) {
  return (
    <div className='text-center py-4 bg-white shadow-md rounded-b-md'>
      <X className='mx-auto h-8 w-8 text-gray-400' />
      <h3 className='mt-2 text-sm font-semibold text-gray-900'>No results</h3>
      <p className='mt-1 text-sm mx-auto max-w-prose text-gray-500'>
        Sorry, we couldnt find any matches for{' '}
        <span className='text-green-600 font-medium'>{query}</span>.
      </p>
    </div>
  )
}

return (
  <ul className="py-4 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md">
    {products.slice(0, 3).map((product) => (
      <li key={product.id} className="mx-auto py-4 px-8 flex space-x-4">
        <Link href={`/products/${product.id}`}>
          <div className="relative flex items-center bg-zinc-100 rounded-lg h-40 w-40" suppressHydrationWarning={true}>
            <Image
              loading="eager"
              fill
              alt="product-image"
              src={product.imageId ? `/${product.imageId}` : '/default-image.png'}
            />
          </div>

          <div className='w-full flex-1 space-y-2 py-1'>
              <h1 className='text-lg font-medium text-gray-900'>
                {product.name}
              </h1>

              <p className='prose prose-sm text-gray-500 line-clamp-3'>
                {product.description}
              </p>

              <p className='text-base font-medium text-gray-900'>
                ${product.price.toFixed(2)}
              </p>
            </div>
        </Link>
      </li>
    ))}
  </ul>
);

};
export default Page;