// import { faker } from '@faker-js/faker'
import { neon } from '@neondatabase/serverless'
import { Index } from '@upstash/vector'
import dotenv from 'dotenv';
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
      imageId: "Ferrari F430 Scuderia [2007].jpg",
      name: "Ferrari F430 Scuderia (2007)",
      price: 12.9,
      age: 2011,
      description: "The Ferrari F430 Scuderia model has been produced between 2009 and 2014. Hot Wheels has released many versions of this Italian car including this one which is out of a 5-Pack Set from 2011."
    },
    {
      id: "2",
      imageId: "Ferrari F50 [1995].jpg",
      name: "Ferrari F50 (1995)",
      price: 69.9,
      age: 2011,
      description: "The Ferrari F50 Challenge model has been produced between 1999 and 2013. Hot Wheels has released many versions of this Italian car including this one which is a Speed Machines model from 2011."
    },
    {
      id: "3",
      imageId: "Ferrari F40 [1987].jpg",
      name: "Ferrari F40 (1987)",
      price: 79.9,
      age: 2002,
      description: "The Ferrari F40 model has been produced between 1989 and 2014. Hot Wheels has released many versions of this Italian car including this one which is a model from the Automobile Milestones Series from 2002."
    },
    {
      id: "4",
      imageId: "Acura Integra GSR [2001].jpg",
      name: "Acura Integra GSR (2001)",
      price: 10.9,
      age: 2024,
      description: "The Acura Integra GSR model has been produced since 2016 and is still in production. Hot Wheels has released various versions of this Japanese car including this one which is a Hot Wheels Boulevard Car Culture model from 2024."
    },
    {
      id: "5",
      imageId: "Acura NSX [1990].jpg",
      name: "Acura NSX (1990)",
      price: 4.9,
      age: 2020,
      description: "The 1990 Acura NSX model has been produced since 2015 and is still in production. Hot Wheels has released various versions of this Japanese car including this one which is a mainliner model from 2020 and also a great memory of Ryu Asada, a star designer at Mattel who died from cancer in 2021."
    },
    {
      id: "6",
      imageId: "Acura NSX Race Car [1994].jpg",
      name: "Acura NSX Race Car (1994)",
      price: 39.9,
      age: 2010,
      description: "The Acura / Honda NSX-GT model has been produced since 2008 and is still in production. Hot Wheels has released various versions of this Japanese car including this one which is a quite valuable Speed Machines model from 2010."
    },
    {
      id: "7",
      imageId: "Alfa Romeo 8C Competitione [2007].jpg",
      name: "Alfa Romeo 8C Competitione (2007)",
      price: 7.9,
      age: 2022,
      description: "The Alfa Romeo 8C Competizione model has been produced since 2014 and is still in production. Hot Wheels has released various versions of this Italian car including this one which is a mainliner model from 2022."
    },
    {
      id: "8",
      imageId: "Alfa Romeo 33 Stradale [1969].jpg",
      name: "Alfa Romeo 33 Stradale (1969)",
      price: 19.9,
      age: 2020,
      description: "The Alfa Romeo 33 Stradale model has been produced between 2020 and 2022. Hot Wheels has released only two versions of this Italian car so far including this first release, a Hot Wheels Boulevard model from 2020."
    },
    {
      id: "9",
      imageId: "Alfa Romeo 155 V6 TI [1993].jpg",
      name: "Alfa Romeo 155 V6 TI (1993)",
      price: 13.9,
      age: 2022,
      description: "The Alfa Romeo 155 V6 TI model has been produced between 2022 and 2024. Hot Wheels has released a few versions of this Italian car including this one which is the first release of this casting as a Hot Wheels Boulevard from 2022."
    },
    {
      id: "10",
      imageId: "Bugatti EB110 SS [1994].jpg",
      name: "Bugatti EB110 SS (1994)",
      price: 13.9,
      age: 2022,
      description: "The Bugatti EB 110 SS model has been produced since 2021 and is still in production. Hot Wheels has released various versions of this French car including this one which is a Car Culture: Exotic Envy model from 2022."
    },
    {
      id: "11",
      imageId: "Bugatti Veyron [2005].jpg",
      name: "Bugatti Veyron (2005)",
      price: 7.9,
      age: 2021,
      description: "The Bugatti Veyron model has been produced since 2003 and is still in production. Hot Wheels has released various versions of this French car including this one which is a retooled model from 1/4 Mile Finals series in 2021."
    },
    {
      id: "12",
      imageId: "Chevrolet Corvette C6 ZR1 [2009].jpg",
      name: "Chevrolet Corvette C6 ZR1 (2009)",
      price: 19.9,
      age: 2012,
      description: "The Chevrolet Corvette ZR1 model has been produced between 2008 and 2019. Hot Wheels has released several versions of this American car including this one which was number 29 out of 32 of the set called Cars of the Decades in 2012."
    },
    {
      id: "13",
      imageId: "De Tomaso Pantera [1972].jpg",
      name: "De Tomaso Pantera (1972)",
      price: 13.9,
      age: 2024,
      description: "The De Tomaso Pantera Gruppo 4 model has been produced since 2022 and is still in production. Only three different colours have been released so far such as this one which is a Hot Wheels Boulevard from 2024."
    },
    {
      id: "14",
      imageId: "Ford Maverick Custom [2022].jpg",
      name: "Ford Maverick Custom (2022)",
      price: 1.9,
      age: 2024,
      description: "The American Ford Maverick Custom model has been produced since 2024 and is still in production. Only two different colours have been released such as this one which is a Hot Wheels mainliner first edition from 2024."
    },
    {
      id: "15",
      imageId: "GMA T50.s [2022].jpg",
      name: "GMA T50.s (2022)",
      price: 2.9,
      age: 2024,
      description: "The British Gordon Murray Automotive T.50s model has been produced as one single version so far in 2024 as a Hot Wheels mainliner model."
    },
    {
      id: "16",
      imageId: "Honda Civic EG6 [1991].jpg",
      name: "Honda Civic EG6 (1991)",
      price: 4.9,
      age: 2025,
      description: "The Honda Civic EG6 has been produced since 2020 and is still in production. Hot Wheels has released many versions of this Japanese car including this one out of the '90s Street Scene Series from 2025."
    },
    {
      id: "17",
      imageId: "Honda Civic Type R Spoon [2024].jpg",
      name: "Honda Civic Type R Spoon (2024)",
      price: 11.9,
      age: 2024,
      description: "The Japanese Honda Civic Type R model has been produced since 2024 and awaits its second release in 2025. This version is a Hot Wheels Boulevard from 2024."
    },
    {
      id: "18",
      imageId: "Honda S800 Racing [1968].jpg",
      name: "Honda S800 Racing (1968)",
      price: 2.9,
      age: 2024,
      description: "The Japanese Honda S800 Racing car has been produced only as one release so far in 2024 as a Hot Wheels mainliner model."
    },
    {
      id: "19",
      imageId: "Lamborghini Countach LP5000 QV [1988].jpg",
      name: "Lamborghini Countach LP5000 QV (1988)",
      price: 11.9,
      age: 2023,
      description: "The Lamborghini Countach LP 5000 QV model has been produced since 2021 and is still in production. Hot Wheels has released a few versions of this Italian car including this one which is a car culture premium model from the Spettacolare-Series from 2023."
    },
    {
      id: "20",
      imageId: "Mazda Mazdaspeed Miata [2004].jpg",
      name: "Mazda Mazdaspeed Miata (2004)",
      price: 11.9,
      age: 2023,
      description: "The Japanese Mazda Mazdaspeed Miata model has been produced between 2023 and 2024. Only two different colours have been released such as this one which is a Hot Wheels Boulevard model from 2023."
    },
    {
      id: "21",
      imageId: "Nissan Skyline GTR R33 [1995].jpg",
      name: "Nissan Skyline GTR R33 (1995)",
      price: 9.9,
      age: 2018,
      description: "The Nissan Skyline GT-R R33 model has been produced between 2018 and 2024. Hot Wheels has released many versions of this Japanese car including this one which is a Hot Wheels mainliner recolour of the first release in 2018."
    },
    {
      id: "22",
      imageId: "Porsche 911 Dakar [2023].jpg",
      name: "Porsche 911 Rallye Dakar (2023)",
      price: 2.9,
      age: 2024,
      description: "The Porsche 911 Rallye Dakar model has been produced since 2024 and is still in production. Hot Wheels has released a few versions of this German car including this one which is a first release mainliner from 2024."
    },
    {
      id: "23",
      imageId: "Porsche 917K [1970].jpg",
      name: "Porsche 917K (1970)",
      price: 29.9,
      age: 2020,
      description: "The Porsche 917K model has been produced between 1999 and 2003 and hot re-tooled again from 2005 to 2024. Hot Wheels has released a few versions of this german car including this one which is from the Iconic Racers Collector Set in 2020."
    },
    {
      id: "24",
      imageId: "Porsche 964 Carrera 2 [1989].jpg",
      name: "Porsche 964 Carrera 2 (1989)",
      price: 13.9,
      age: 2024,
      description: "The Porsche 964 Carrera 2 model has been produced between 2016 and 2024. Hot Wheels has released a few versions of this german car including this one which is a Hot Wheels Boulevard model from 2024 and so far the last release."
    },
    {
      id: "25",
      imageId: "Toyota Altezza [1998].jpg",
      name: "Toyota Altezza (1998)",
      price: 12.9,
      age: 2023,
      description: "The Japanese Toyota Altezza model has been produced as one single version in 2023 as a Hot Wheels Car Culture: Modern Classics car except the rare chase version in black from the same series."
    },
    {
      id: "26",
      imageId: "Toyota GR86 Cup [2022].jpg",
      name: "Toyota GR86 Cup (2022)",
      price: 2.9,
      age: 2024,
      description: "The Toyota GR86 Cup has been produced since 2024 and is still in production. Hot Wheels has released only two versions of this Japanese car so far including this first release as a mainliner model from 2024."
    },
    {
      id: "27",
      imageId: "Vector W8 [1989].jpg",
      name: "Vector W8 (1989)",
      price: 79.9,
      age: 2012,
      description: "The American Vector W8 model has been produced as one single version in 2012 as a Hot Wheels Boulevard: Ahead Of Its Time car. It is therefore pretty rare on the market."
    },
    {
      id: "28",
      imageId: "Alfa Romeo Giulia GTA [1965].jpg",
      name: "Alfa Romeo Giulia GTA (1965)",
      price: 24.9,
      age: 2016,
      description: "The Alfa Romeo Giulia Sprint GTA has been produced since 2016 and is still in production. Hot Wheels has released many versions of this Italian car so far including this first of the model as a Hot Wheels Entertainment: Forza Motorsport car from 2016."
    },
    {
      id: "29",
      imageId: "Alfa Romeo GTV6 3.0 [1984].jpg",
      name: "Alfa Romeo GTV6 3.0 (1984)",
      price: 3.9,
      age: 2023,
      description: "The Alfa Romeo GTV6 3.0 has been produced since 2023 and is still in production. Hot Wheels has released a few versions of this Italian car so far including this first release as a mainliner model from 2023."
    },
    {
      id: "30",
      imageId: "Aston Martin DB5 [1963].jpg",
      name: "Aston Martin DB5 (1963)",
      price: 14.9,
      age: 2014,
      description: "The Aston Martin DB5 model has been produced between 2014 and 2024. Hot Wheels has released many versions of this British car including this one which is a recolour in silver dedicated to the 007 James Bond Car as a mainliner in 2014."
    },
    {
      id: "31",
      imageId: "Audi Quattro [1987].jpg",
      name: "Audi Quattro (1987)",
      price: 3.9,
      age: 2024,
      description: "The 1987 Audi Quattro model has been produced since 2024 and is still in production. Hot Wheels has released a few versions of this German car so far including this first release as a mainliner model from 2024."
    },
    {
      id: "32",
      imageId: "Ferrari Enzo Ferrari [2002].jpg",
      name: "Ferrari Enzo Ferrari (2002)",
      price: 49.9,
      age: 2008,
      description: "The Ferrari Enzo Ferrari model has been produced between 2003 and 2011. Hot Wheels has released many versions of this Italian car including this one which is a GT-Ferrari 5 Pack exclusive because of the missing headlight decals from 2008."
    },
    {
      id: "33",
      imageId: "Koenigsegg Agera R [2011].jpg",
      name: "Koenigsegg Agera R (2011)",
      price: 18.9,
      age: 2022,
      description: "The Koenigsegg Agera R model has been produced from 2014 until 2022. Hot Wheels has released a few versions of this Swedish car including the very valuable Need For Speed version as well as this last release so far as a car culture premium model from 2022 in the Exotic Envy series."
    },
    {
      id: "34",
      imageId: "Koenigsegg Gemera [2024].jpg",
      name: "Koenigsegg Gemera (2024)",
      price: 2.9,
      age: 2022,
      description: "The Koenigsegg Gemera model has been produced since 2022 and is still in production. Hot Wheels has released a few versions of this Swedish car including this first release as a mainliner model from 2022."
    },
    {
      id: "35",
      imageId: "Koenigsegg Jesko [2022].jpg",
      name: "Koenigsegg Jesko (2022)",
      price: 2.9,
      age: 2021,
      description: "The Koenigsegg Jesko model has been produced since 2020 and is still in production. Hot Wheels has released a few versions of this Swedish car including this one as a third mainliner release from 2021."
    },
    {
      id: "36",
      imageId: "Lamborghini Aventador [2011].jpg",
      name: "Lamborghini Aventador (2011)",
      price: 119.9,
      age: 2018,
      description: "The Lamborghini Aventador model has been produced between 2011 and 2023. Hot Wheels has released many versions of this Italian car including this one which is the most valuable version of them all as a Super Treasure Hunt from 2018."
    },
    {
      id: "37",
      imageId: "Lamborghini Aventador J [2012].jpg",
      name: "Lamborghini Aventador J (2012)",
      price: 9.9,
      age: 2021,
      description: "The Lamborghini Aventador J model has been produced between 2013 and 2024. Hot Wheels has released many versions of this Italian car including this one which is a multipack exclusive from 2021."
    },
    {
      id: "38",
      imageId: "Lamborghini Gallardo Superleggera [2010].jpg",
      name: "Lamborghini Gallardo Superleggera (2010)",
      price: 9.9,
      age: 2011,
      description: "The Lamborghini Gallardo Superleggera model has been produced between 2011 and 2023. Hot Wheels has released many versions of this Italian car including this one which is the first release of this casting from 2011 as a Mainliner."
    },
    {
      id: "39",
      imageId: "Lamborghini Huracan Super Trofeo [2014].jpg",
      name: "Lamborghini Huracan Super Trofeo (2014)",
      price: 119.9,
      age: 2024,
      description: "The Lamborghini Huracan Super Trofeo model has been produced between 2016 and 2024. Hot Wheels has released many versions of this Italian car including this one which is the most valuable version of them all as a Super Treasure Hunt from 2024."
    },
    {
      id: "40",
      imageId: "Lamborghini Murcielago [2001].jpg",
      name: "Lamborghini Murcielago (2001)",
      price: 12.9,
      age: 2003,
      description: "The Lamborghini Murciélago model has been produced between 2003 and 2018. Hot Wheels has released many versions of this Italian car including this one which was the first release of this casting from 2003 as a Mainliner."
    },
    {
      id: "41",
      imageId: "Lamborghini Murcielago SV [2009].jpg",
      name: "Lamborghini Murcielago SV (2009)",
      price: 199.9,
      age: 2010,
      description: "The Lamborghini Murciélago SV model has been produced between 2011 and 2020. Hot Wheels has released only three versions of this Italian car so far including this one which was the first release of this casting as a Speed Machines model from 2010."
    },
    {
      id: "42",
      imageId: "Lamborghini Sesto Elemento [2012].jpg",
      name: "Lamborghini Sesto Elemento (2012)",
      price: 14.9,
      age: 2014,
      description: "The Lamborghini Sesto Elemento model has been produced between 2014 and 2024. Hot Wheels has released many versions of this Italian car including this one which was the second release ever in 2014 as a mainliner model dedicated to the Need For Speed Movie."
    },
    {
      id: "43",
      imageId: "Nissan Skyline GTR R34 [2001].jpg",
      name: "Nissan Skyline GTR R34 (2001)",
      price: 49.9,
      age: 2017,
      description: "The Nissan Skyline GTR R34 has been produced since 2010 and is still in production. Hot Wheels has released many versions of this Japanese car including this one out of the car culture retro entertainment premium series from 2017."
    },
    {
      id: "44",
      imageId: "Porsche 911 GT3 RS [2018].jpg",
      name: "Porsche 911 GT3 RS (2018)",
      price: 8.9,
      age: 2017,
      description: "The Porsche 911 GT3 RS model has been produced between 2016 and 2024. Hot Wheels has released many versions of this german car including this one which was the second release ever in 2017 as a mainliner model."
    },
    {
      id: "45",
      imageId: "Subaru BRZ Drift Car [2016].jpg",
      name: "Subaru BRZ Drift Car (2016)",
      price: 2.9,
      age: 2025,
      description: "The Subaru BRZ has been produced since 2021 and is still in production. Hot Wheels has released only a few versions of this japanese car so far including this one out of the standard mainline series from 2025."
    },
    {
      id: "46",
      imageId: "Toyota Supra MK4 [1996].jpg",
      name: "Toyota Supra MK4 (1996)",
      price: 24.9,
      age: 2019,
      description: "The Toyota Supra MK4 model has been produced since 2013 and is still in production. Hot Wheels has released many versions of this japanese car including this one out of the car culture premium series named Cruise Boulevard from 2019."
    },
    {
      id: "47",
      imageId: "Ferrari California [2008].jpg",
      name: "Ferrari California (2008)",
      price: 39.9,
      age: 2010,
      description: "The Ferrari California model has been produced between 2009 and 2012. Hot Wheels has released many versions of this italian car including this one out of the Speed Machine series from 2010."
    },
    {
      id: "48",
      imageId: "Ferrari 599 GTB [2010].jpg",
      name: "Ferrari 599 GTB (2010)",
      price: 49.9,
      age: 2010,
      description: "The Ferrari 599 GTB Fiorano model has been produced between 2007 and 2015 and was one of the last Ferrari castings made before Mattel lost their license with Ferrari. Hot Wheels has released many versions of this italian car including this one out of the Speed Machine series from 2010."
    },
    {
      id: "49",
      imageId: "Ferrari 308 GTS QV [1982].jpg",
      name: "Ferrari 308 GTS QV (1982)",
      price: 119.9,
      age: 2009,
      description: "The Ferrari 308 GTS Quattrovalvole model has been produced between 2009 and 2013. Hot Wheels has released many versions of this italian car including this one out of the Ferrari Racer Series which is the very first release of this model in 2009."
    },
    {
      id: "50",
      imageId: "Ferrari 288 GTO [1985].jpg",
      name: "Ferrari 288 GTO (1985)",
      price: 39.9,
      age: 2008,
      description: "The Ferrari 288 GTO model has been produced between 2008 and 2012. Hot Wheels has released many versions of this italian car including this one which is very first release as a mainliner in 2008."
    }

  ]

  // Puts all the products inside of an array:
  // Seeding the Neon Tech PostgreSQL console database in the Vector Database:
  productImageIDs.forEach(({ description, imageId, price = 0, age = 0 }, i) => {
    return products.push({
      id: (i + 1).toString(),
      name: formatFileName(imageId),
      description,
      price,
      imageId,
      age,
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
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageId: product.imageId,
      },
    })
  })
}

// Converts a file name to a human-readable product name for the vector based search
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