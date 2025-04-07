"use server";

import "cloudflare/shims/web";
import { drizzle } from "drizzle-orm/d1";
import { nanoid } from "nanoid";
import {
  PersonalTable,
  ProductsTable,
  ProvidersTable,
  InvoicesTable,
  FleetTable,
} from "@/src/db/schema";

import {
  Product,
  Provider,
  Personal,
  FleetStatus,
  Invoice,
  Fleet,
} from "./definitions";
import { and, eq } from "drizzle-orm";

// const cloudflare = new Cloudflare({
//   apiEmail: process.env.ACCOUNT_EMAIL,
//   apiToken: process.env.API_TOKEN,
// });

const db = drizzle(process.env.DB);
export async function testConnection() {
  console.log("D", process.env.DB);
  console.log("DB", db);
  try {
    if (!db) {
      throw new Error("Database connection failed.");
    }

    const response = await db.select().from(PersonalTable);
    console.log("Database connection successful:", response);
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

/*
  API for Personal
  These functions are used to interact with the Personal table in the database and
  to login as a user.
*/

export async function getPersonal() {
  const response = await db.select().from(PersonalTable).all();
  return response as Personal[];
}

export async function getPersonalById(id: string) {
  const response = await db
    .select()
    .from(PersonalTable)
    .where(eq(PersonalTable.id, id))
    .all();
  return response as Personal[];
}

export async function addPersonal(
  name: string,
  email: string,
  address: string,
  rol: string,
  password: string
) {
  const response = await db
    .insert(PersonalTable)
    .values({
      id: nanoid(),
      name,
      email,
      address,
      rol,
      password,
    })
    .returning();
  return response as Personal[];
}

export async function updatePersonal(
  id: string,
  name: string,
  email: string,
  address: string,
  rol: string,
  password: string
) {
  const response = await db
    .update(PersonalTable)
    .set({
      name,
      email,
      address,
      rol,
      password,
    })
    .where(eq(PersonalTable.id, id))
    .returning();
  return response as Personal[];
}

export async function deletePersonal(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .delete(PersonalTable)
    .where(eq(PersonalTable.id, id))
    .returning();
  return response as Personal[];
}

export async function login(email: string, password: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .select()
    .from(PersonalTable)
    .where(
      and(eq(PersonalTable.email, email), eq(PersonalTable.password, password))
    )
    .all();
  return response as Personal[];
}

/*
  API for Products
  These functions are used to interact with the Products table in the database.
*/

export async function getProducts() {
  const db = drizzle(process.env.DB);
  const response = await db.select().from(ProductsTable).all();
  return response as Product[];
}

export async function getProductById(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .select()
    .from(ProductsTable)
    .where(eq(ProductsTable.id, id))
    .all();
  return response as Product[];
}

export async function addProduct(
  provider_id: string,
  name: string,
  quantity: number,
  location: string
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .insert(ProductsTable)
    .values({
      id: nanoid(),
      provider: provider_id,
      name,
      quantity: quantity,
      location,
    })
    .returning();
  return response as Product[];
}

export async function updateProduct(
  id: string,
  provider_id: string,
  name: string,
  quantity: number,
  location: string
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .update(ProductsTable)
    .set({
      provider: provider_id,
      name,
      quantity: quantity,
      location,
    })
    .where(eq(ProductsTable.id, id))
    .returning();
  return response as Product[];
}

export async function deleteProduct(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .delete(ProductsTable)
    .where(eq(ProductsTable.id, id))
    .returning();
  return response as Product[];
}

/*
  API for Providers
  These functions are used to interact with the Providers table in the database.
*/

export async function getProviders() {
  const db = drizzle(process.env.DB);
  const response = await db.select().from(ProvidersTable).all();
  return response as Provider[];
}

export async function getProviderById(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .select()
    .from(ProvidersTable)
    .where(eq(ProvidersTable.id, id))
    .all();
  return response as Provider[];
}

export async function addProvider(
  name: string,
  address: string,
  phone: string,
  email: string
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .insert(ProvidersTable)
    .values({
      id: nanoid(),
      name,
      address,
      phone,
      email,
    })
    .returning();
  return response as Provider[];
}

export async function updateProvider(
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .update(ProvidersTable)
    .set({
      name,
      address,
      phone,
      email,
    })
    .where(eq(ProvidersTable.id, id))
    .returning();
  return response as Provider[];
}

export async function deleteProvider(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .delete(ProvidersTable)
    .where(eq(ProvidersTable.id, id))
    .returning();
  return response as Provider[];
}

/*
  API for Fleet
  These functions are used to interact with the Fleet table in the database.
*/

export async function getFleet() {
  const db = drizzle(process.env.DB);
  const response = await db.select().from(FleetTable).all();
  return response as Fleet[];
}

export async function getFleetById(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .select()
    .from(FleetTable)
    .where(eq(FleetTable.id, id))
    .all();
  return response as Fleet[];
}

export async function addFleet(
  invoice_id: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .insert(FleetTable)
    .values({
      id: nanoid(),
      invoice: invoice_id,
      departure,
      destination,
      status,
    })
    .returning();
  return response as Fleet[];
}

export async function updateFleet(
  id: string,
  invoice_id: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  const db = drizzle(process.env.DB);
  const response = await db
    .update(FleetTable)
    .set({
      invoice: invoice_id,
      departure,
      destination,
      status,
    })
    .where(eq(FleetTable.id, id))
    .returning();
  return response as Fleet[];
}

export async function deleteFleet(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .delete(FleetTable)
    .where(eq(FleetTable.id, id))
    .returning();
  return response as Fleet[];
}

/*
  API for Invoices
  These functions are used to interact with the Invoices table in the database.
*/

export async function getInvoices() {
  const db = drizzle(process.env.DB);
  const response = await db.select().from(InvoicesTable).all();
  return response as Invoice[];
}

export async function getInvoiceById(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .select()
    .from(InvoicesTable)
    .where(eq(InvoicesTable.id, id))
    .all();
  return response as Invoice[];
}

export async function addInvoice(order: [string, number][]) {
  const db = drizzle(process.env.DB);
  const id = nanoid();
  const resposnes = [] as Invoice[];
  for (const [key, value] of order) {
    const response = await db
      .insert(InvoicesTable)
      .values({
        id: id,
        order_key: key,
        order_value: value,
      })
      .returning();
    resposnes.push(...(response as Invoice[]));
  }
  return resposnes;
}

export async function deleteInvoice(id: string) {
  const db = drizzle(process.env.DB);
  const response = await db
    .delete(InvoicesTable)
    .where(eq(InvoicesTable.id, id))
    .returning();
  return response as Invoice[];
}
