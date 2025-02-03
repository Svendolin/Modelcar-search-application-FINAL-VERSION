import { faker } from '@faker-js/faker'
import { neon } from '@neondatabase/serverless'
import { Index } from '@upstash/vector'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { vectorize } from '../lib/vectorize' 
import { productsTable } from './schema'

dotenv.config()

const index = new Index()

async function main() {
  const connector = neon(process.env.DATABASE_URL!)
  
  const db = drizzle(connector)

  const products: (typeof productsTable.$inferInsert)[] = []

  /* The following products are used for the semantic search for Upstash:
  - With npm run drizzle:seed we pass this data to the vector database Upstash
  - xxx
  - Using Faker.js, we generate random prices for the products that are NOT relevant for the semantic search
  - The following order will be the exact order stored in the Postgres database with the ID 1 - 26 consecutive
  - The ID's apply to the respective database and are not directly assigned to the respective product!
  - So Ferrari F50 can have ID 10 in Postgres, but ID 2 in Upstash Vector and would still be found!
  
  */

  const productImageIDs = [
    {
      id: "1",
      imageId: 'Ferrari F430 Scuderia 2007 Hot Wheels.jpg',
      name: "Ferrari F430 Scuderia [2007]",
      price: 12.90,
      description:
        'The Ferrari F430 Scuderia model has been produced between 2009 and 2014. Hot Wheels has released many versions of this italian car including this one which is out of a 5-Pack Set from 2011.',
    },
    {
      id: "10",
      imageId: 'Ferrari F50 1995 Hot Wheels.jpg',
      name: "Ferrari F50 [1995]",
      price: 17.90,
      description:
        'The Ferrari F50 Challenge model has been produced between 1999 and 2013. Hot Wheels has released many versions of this italian car including this one which is a Speed Machines model from 2011.',
    },
    {
      id: "2",
      imageId: 'Ferrari F40 1987 Hot Wheels.jpg',
      name: "Ferrari F40 [1987]",
      price: 19.90,
      description:
        'The Ferrari F40 model has been produced between 1989 and 2014. Hot Wheels has released many versions of this italian car including this one which is a model from the Automobile Milestones Series from 2002.',
    },
    {
      imageId: 'Acura Integra GSR 2001 Hot Wheels.jpg',
      description:
        'A timeless dark leather jacket that combines classic styling with rugged durability. Perfect for adding an edge to any outfit, rain or shine.',
    },
    {
      imageId: 'Acura NSX 1990 Hot Wheels.jpg',
      description:
        'Stay protected against the elements with this durable parka. Its insulated lining and fur-trimmed hood offer warmth and style in harsh conditions.',
    },
    {
      imageId: 'Acura NSX Race Car 1994 Hot Wheels.jpg',
      description:
        'This sleek parka features a waterproof exterior and a thermal interior, making it a must-have for winter escapades in the city or the mountains.',
    },
    {
      imageId: 'Alfa Romeo 8C Competitione 2007 Hot Wheels.jpg',
      description:
        'With its adjustable features and multiple pockets, this parka blends practicality with modern aesthetics for the ultimate winter outerwear.',
    },
    {
      imageId: 'Alfa Romeo 33 Stradale 1969 Hot Wheels.jpg  ',
      description:
        'A modern twist on a classic design, this dark trench coat offers both sophistication and weather resistance, perfect for rainy days.',
    },
    {
      imageId: 'Alfa Romeo 155 V6 TI 1993 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'Bugatti EB110 SS 1994 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'Bugatti Veyron 2005 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'Chevrolet Corvette C6 ZR1 2009 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'De Tomaso Pantera 1972 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'Ford Maverick Custom 2022.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'GMA T50.s 2022 HOT WHEELS .jpg',
      description:
        'Embrace the cold in this light and airy down jacket, featuring a water-resistant shell and a sleek design for everyday wear.',
    },
    {
      imageId: 'Honda Civic EG6 1991 Hot Wheels.jpg',
      description:
        'This stylish down jacket combines warmth and lightweight design, making it the perfect companion for winter travel.',
    },
    {
      imageId: 'Honda Civic Type R Spoon 2024 Hot Wheels .jpg',
      description:
        'Enjoy the soft touch of this light fleece jacket, designed for brisk mornings and cool evenings, with a versatile zip-up style for easy layering.',
    },
    {
      imageId: 'Honda S800 Racing 1968 Hot Wheels.jpg',
      description:
        'A casual classic, this light denim jacket adds a layer of cool to any outfit, perfect for those crisp, sunny days.',
    },
    {
      imageId: 'Mazda Mazdaspeed Miata 2004 Hot Wheels.jpg',
      description:
        'Upgrade your casual wear with this distressed light denim jacket, featuring a relaxed fit and timeless appeal.',
    },
    {
      imageId: 'Nissan Skyline GTR R33 1995 Hot Wheels.jpg',
      description:
        "This light parka offers a breathable, water-resistant layer, ideal for unpredictable weather, with a sleek design that doesn't compromise on style.",
    },
    {
      imageId: 'Porsche 911 Dakar 2023 Hot Wheels.jpg',
      description:
        'A chic and lightweight trench coat that brings an elegant layer to spring and autumn outfits, with a belted waist for a flattering fit.',
    },
    {
      imageId: 'Porsche 917K 1970 Hot Wheels.jpg',
      description:
        'Enjoy a stylish and sophisticated look with this lightweight trench coat made from a fabric that resists both wind and rain. Perfect for the transition between seasons.',
    },
    {
      imageId: 'Porsche 964 Carrera 2 1989 Hot Wheels.jpg',
      description:
        'Take on the breezy days with this lightweight wind jacket that is designed to offer protection and style with its minimalist design and functional features.',
    },
    {
      imageId: 'Toyota Altezza 1998 Hot Wheels.jpg',
      description:
        'A versatile windbreaker for active days. This jacket offers lightweight comfort and resistance to the elements in a sleek package.',
    },
    {
      imageId: 'Toyota GT86 Cup 2022 Hot Wheels.jpg',
      description:
        'Stay ahead of the weather with this dynamic light wind jacket, combining breathability with waterproof technology for all-day comfort.',
    },
    {
      imageId: 'Vector W8 1989 Hot Wheels.jpg',
      description:
        'A comfortable wind jacket designed to keep you warm during winter or rain. With a minimal light grey color it suits the rest of your outfit well.',
    },
    {
      imageId: 'Alfa Romeo Giulia GTA 1965 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
    {
      imageId: 'Alfa Romeo GTV6 3.0 1984 Hot Wheels.jpg',
      description:
        'Lightweight yet warm, this down jacket is an essential layer for transitional weather, offering comfort without bulk.',
    },
  ]

  // Puts all the products inside of an array:
  // Seeding the Neon Tech PostgreSQL console database with thîs schema:
  productImageIDs.forEach(({ description, imageId }, i) => {
    return products.push({
      id: (i + 1).toString(),
      name: formatFileName(imageId),
      description,
      price: parseFloat(faker.commerce.price({ min: 40, max: 200 })),
      imageId,
      age: 10 // We enter this data manually into the database with
    })
  })

  // ...and finally in our database of Postgresql for text matching:
  products.forEach(async (product) => {
    await db.insert(productsTable).values(product).onConflictDoNothing()

    // UPSTASH VECTOR SEMANTIC SEARCH:
     await index.upsert({ // Upsert operation on a specific index to our Upstash Vector instance to do Semantic Matching:
      id: product.id!,
      vector: await vectorize(`${product.name}: ${product.description}`),
      metadata: {
        id: product.id, // Done by Upstash
        name: product.name, // Done by Upstash
        description: product.description, // PART OF OUR SEEDING from ABOVE
        price: product.price, // Not relevant for the semantic search
        imageId: product.imageId, // PART OF OUR SEEDING from ABOVE
      },
    }) 
  })
}


// 'dark_down_jacket_1.png' -> 'Dark Down Jacket 1'
function formatFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.\w+$/, '')
  const words = nameWithoutExtension.split('_')

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )
  return capitalizedWords.join(' ')
}

main()