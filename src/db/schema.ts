// Defines what kind of datastrucutre lives in our database
import { integer } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { doublePrecision } from "drizzle-orm/pg-core";

// Check at 44:05
// .notNull() is an info that the column is required
// Now this will be out database structure:
// So we are free to add more columns to this table:
export const productsTable = pgTable("products", {
  id: text("id").primaryKey().default("uuid_generate_v4()"), // When we create a new product, it will automatically get an ID
  name: text("name").notNull(),
  imageId: text("image_id").notNull(),
  price: doublePrecision("price").notNull(),
  description: text("description"),
  age: integer("age").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// We get get the statements back from above as one product
export type Product = typeof productsTable.$inferSelect
