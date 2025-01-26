// Over here we are fetching the product details from the database and displaying it on the page.
// We are using the product id from the url to fetch the product details from the database.
// => This is the place where we display the product details like name, price, description, image, etc.

import { db } from '@/db'
import { productsTable } from '@/db/schema'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import BackButton from '@/components/BackButton'
import Image from 'next/image'
import { Check, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: {
    productId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { productId } = params

  // If the product id is not present in the url, we are returning a 404 page.
  if (!productId) return notFound()

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId))

  if (!product) return notFound()
  // BackButton is a custom component that we have created to navigate back to the previous page.
  /* Up next the followning lines will be:

  - BackButton Component to get back to the 3  models overview
  - Product name (Title)
  - Product image
  - Product price (toFixed(2) means that the price will be displayed with 2 decimal places)
  - Product description
  - A message that says that the product is eligible for express delivery
  - A button to add the product to the cart
  - A message that says that the product is eligible for a 30-day return guarantee

  (Many of the icons are from Lucide, a library of icons that we are using in this project)
  
  
  */
  return (
    <div className='py-8 pb-8 px-12 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md'>
      <div>
        
        
        <BackButton /> 

        <div className='mt-4'> 
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {product.name}
          </h1>
        </div>

        <div className='aspect-square my-6 border border-border w-58 h-58'> 
          <div className='relative bg-zinc-100 w-full h-full overflow-hidden rounded-xl'>
            <Image
              fill
              loading='eager'
              className='h-full w-full object-cover object-center'
              src={`/${product.imageId}`}
              alt='product image'
            />
          </div>
        </div>

        <div className='mt-4'>
          <div className='flex items-center'>
            <p className='font-bold text-gray-900'>
              Approximate value: ${product.price.toFixed(2)}
            </p>
            <p className='ml-2 text-sm text-muted-foreground'>
            (Price corresponds to original packaging)
            </p>
          </div>

          <div className='flex items-center'>
            <p className='font-bold text-gray-900'>
              Release date: {product.age}
            </p>
            <p className='ml-2 text-sm text-muted-foreground'>
            (of the model as shown above)
            </p>
            
          </div>

          <div className='mt-4 space-y-6'>
            <p className='text-base max-w-prose text-muted-foreground'>
              {product.description}
            </p>
          </div>

          <div className='mt-6 flex items-center'>
            <Check className='h-5 w-5 flex-shrink-0 text-green-500' />
            <p className='ml-2 text-sm text-muted-foreground'>
              Fully licensed product
            </p>
          </div>
        </div>
      </div>

      <div className='mt-6'>
      <a href="mailto:support@toycarsaddict.club">
        <Button className='w-full mt-10'>CONTACT US</Button>
      </a>

        <div className='mt-6 text-center'>
          <div className='inline-flex text-sm text-medium'>
            <Shield className='mr-2 h-5 w-5 flex-shrink-0 text-gray-400' />
            <span className='text-muted-foreground hover:text-gray-700'>
            Part of the collection of Toycarsaddict_Daily
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
