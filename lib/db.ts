"use server";

import "cloudflare/shims/web";
import Cloudflare from "cloudflare";
import { nanoid } from "nanoid";
import {
  Product,
  Provider,
  Personal,
  FleetStatus,
  Invoice,
  Fleet,
} from "./definitions";

const cloudflare = new Cloudflare({
  apiEmail: process.env.ACCOUNT_EMAIL,
  apiToken: process.env.API_KEY,
});

function numberToString(num: number) {
  // Convert a number to a string with a fallback to 0 if error
  try {
    return num.toString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return "0";
  }
}

/*
  API for Personal
  These functions are used to interact with the Personal table in the database and
  to login as a user.
*/

export async function getPersonal() {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Personal`,
    }
  );

  const data = response.result[0].results as Personal[];
  return data;
}

export async function getPersonalById(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Personal WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results;
  if (data === undefined) {
    return null;
  }

  return data[0] as Personal;
}

export async function addPersonal(
  name: string,
  email: string,
  address: string,
  rol: string,
  password: string
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `INSERT INTO Personal (id, name, email, address, rol, password) VALUES (?, ?, ?, ?, ?, ?)`,
      params: [nanoid(), name, email, address, rol, password],
    }
  );
  const data = response.result[0].results as Personal[];
  return data;
}

export async function updatePersonal(
  id: string,
  name: string,
  email: string,
  address: string,
  rol: string,
  password: string
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `UPDATE Personal SET name = ?, email = ?, address = ?, rol = ?, password = ? WHERE id = ?`,
      params: [name, email, address, rol, password, id],
    }
  );
  const data = response.result[0].results as Personal[];
  return data;
}

export async function deletePersonal(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Personal WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results as Personal[];
  return data;
}

export async function login(email: string, password: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Personal WHERE name = ? AND password = ?`,
      params: [email, password],
    }
  );
  const data = response.result[0].results as Personal[];
  if (data.length === 0) {
    return null;
  }
  return data[0] as Personal;
}

/*
  API for Products
  These functions are used to interact with the Products table in the database.
*/

export async function getProducts() {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Products`,
    }
  );
  const data = response.result[0].results as Product[];
  return data;
}

export async function getProductById(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Products WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results;
  if (data === undefined) {
    return null;
  }

  return data[0] as Product;
}

export async function addProduct(
  provider_id: string,
  name: string,
  quantity: number,
  location: string
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `INSERT INTO Products (id, provider, name, quantity, location) VALUES (?, ?, ?, ?, ?)`,
      params: [nanoid(), provider_id, name, numberToString(quantity), location],
    }
  );
  const data = response.result[0].results as Product[];
  return data;
}

export async function updateProduct(
  id: string,
  provider_id: string,
  name: string,
  quantity: number,
  location: string
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `UPDATE Products SET provider = ?, name = ?, quantity = ?, location = ? WHERE id = ?`,
      params: [provider_id, name, numberToString(quantity), location, id],
    }
  );
  const data = response.result[0].results as Product[];
  return data;
}

export async function deleteProduct(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Products WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results as Product[];
  return data;
}

/*
  API for Providers
  These functions are used to interact with the Providers table in the database.
*/

export async function getProviders() {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Providers`,
    }
  );
  const data = response.result[0].results as Provider[];
  return data;
}

export async function getProviderById(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Providers WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results;
  if (data === undefined) {
    return null;
  }

  return data[0] as Provider;
}

export async function addProvider(
  name: string,
  address: string,
  phone: string,
  email: string
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `INSERT INTO Providers (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?)`,
      params: [nanoid(), name, address, phone, email],
    }
  );
  const data = response.result[0].results as Provider[];
  return data;
}

export async function updateProvider(
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string
) {
  console.log("Adding provider", id, name, address, phone, email);
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `UPDATE Providers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?`,
      params: [name, address, phone, email, id],
    }
  );
  const data = response.result[0].results as Provider[];
  return data;
}

export async function deleteProvider(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Providers WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results as Provider[];
  return data;
}

/*
  API for Fleet
  These functions are used to interact with the Fleet table in the database.
*/

export async function getFleet() {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Fleet`,
    }
  );
  const data = response.result[0].results as Fleet[];
  return data;
}

export async function getFleetById(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Fleet WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results;
  if (data === undefined) {
    return null;
  }

  return data[0] as Fleet;
}

export async function addFleet(
  invoice_id: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `INSERT INTO Fleet (id, invoice, departure, destination, status) VALUES (?, ?, ?, ?, ?)`,
      params: [nanoid(), invoice_id, departure, destination, status],
    }
  );
  const data = response.result[0].results as Fleet[];
  return data;
}

export async function updateFleet(
  id: string,
  invoice_id: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `UPDATE Fleet SET invoice = ?, departure = ?, destination = ?, status = ? WHERE id = ?`,
      params: [invoice_id, departure, destination, status, id],
    }
  );
  const data = response.result[0].results as Fleet[];
  return data;
}

export async function deleteFleet(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Fleet WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results as Fleet[];
  return data;
}

/*
  API for Invoices
  These functions are used to interact with the Invoices table in the database.
*/

export async function getInvoices() {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Invoices`,
    }
  );
  const data = response.result[0].results as Invoice[];
  return data;
}

export async function getInvoiceById(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `SELECT * FROM Invoices WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results;
  if (data === undefined) {
    return null;
  }

  return data[0] as Invoice;
}

export async function addInvoice(order: Invoice[]) {
  if (order.length === 0) {
    return null;
  }

  console.log("Adding invoice: ", order);
  const invoiceId = nanoid();

  order.map(async (item) => {
    const response = await cloudflare.d1.database.query(
      process.env.DATABASE_ID!,
      {
        account_id: process.env.ACCOUNT_ID!,
        sql: `INSERT INTO Invoices (id, invoiceItemId, productId, quantity) VALUES (?, ?, ?, ?)`,
        params: [
          invoiceId,
          nanoid(),
          item.productId,
          numberToString(item.quantity),
        ],
      }
    );

    console.log("Adding invoice item", item);

    // If error, return null
    if (response.result[0].success === false) {
      return null;
    }
  });

  return order;
}

export async function updateInvoice(order: Invoice[]) {
  console.log("Updating invoice: ", order);
  // Delete all items in the invoice, then add the new items
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Invoices WHERE id = ?`,
      params: [order[0].id],
    }
  );

  if (response.result[0].success === false) {
    return null;
  }

  order.map(async (item) => {
    // If the invoiceItemId is not set, set it to a new id
    if (item.invoiceItemId === undefined || item.invoiceItemId === "") {
      item.invoiceItemId = nanoid();
    }

    const response = await cloudflare.d1.database.query(
      process.env.DATABASE_ID!,
      {
        account_id: process.env.ACCOUNT_ID!,
        sql: `INSERT INTO Invoices (id, invoiceItemId, productId, quantity) VALUES (?, ?, ?, ?)`,
        params: [
          item.id,
          item.invoiceItemId,
          item.productId,
          numberToString(item.quantity),
        ],
      }
    );

    // If error, return null
    if (response.result[0].success === false) {
      return null;
    }
  });
}

export async function deleteInvoice(id: string) {
  const response = await cloudflare.d1.database.query(
    process.env.DATABASE_ID!,
    {
      account_id: process.env.ACCOUNT_ID!,
      sql: `DELETE FROM Invoices WHERE id = ?`,
      params: [id],
    }
  );
  const data = response.result[0].results as Invoice[];
  return data;
}
