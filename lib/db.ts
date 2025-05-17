"use server";

import "cloudflare/shims/web";
import { nanoid } from "nanoid";
import {
  Product,
  Provider,
  Personal,
  FleetStatus,
  Invoice,
  Fleet,
  Data2Plot,
} from "./definitions";

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
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Personal`,
  //   }
  // );
  const response = await fetch("http://localhost:3001/api/personal");
  const data = (await response.json()) as Personal[];
  console.log("Response from API: ", data);
  return data;
}

export async function getPersonalById(id: string) {
  const response = await fetch(`http://localhost:3001/api/personal/${id}`);
  const data = (await response.json()) as Personal[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function addPersonal(
  name: string,
  email: string,
  address: string,
  rol: string,
  password: string
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `INSERT INTO Personal (id, name, email, address, rol, password) VALUES (?, ?, ?, ?, ?, ?)`,
  //     params: [nanoid(), name, email, address, rol, password],
  //   }
  // );
  // const data = response.result[0].results as Personal[];
  // return data;
  const response = await fetch("http://localhost:3001/api/personal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: nanoid(),
      name,
      email,
      address,
      rol,
      password,
    }),
  });

  const data = (await response.json()) as Personal[];
  console.log("AP Response from API: ", data);
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
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `UPDATE Personal SET name = ?, email = ?, address = ?, rol = ?, password = ? WHERE id = ?`,
  //     params: [name, email, address, rol, password, id],
  //   }
  // );
  // const data = response.result[0].results as Personal[];
  // return data;

  const response = await fetch(`http://localhost:3001/api/personal/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      email,
      address,
      rol,
      password,
    }),
  });
  const data = (await response.json()) as Personal[];
  console.log("UP Response from API: ", data);
  return data;
}

export async function deletePersonal(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `DELETE FROM Personal WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results as Personal[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/personal/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as Personal[];
  console.log("DP Response from API: ", data);
  return data;
}

export async function login(email: string, password: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Personal WHERE name = ? AND password = ?`,
  //     params: [email, password],
  //   }
  // );
  // const data = response.result[0].results as Personal[];
  // if (data.length === 0) {
  //   return null;
  // }
  // return data[0] as Personal;
  const response = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = (await response.json()) as Personal[];
  console.log("Login Response from API: ", data);
  return data;
}

/*
  API for Products
  These functions are used to interact with the Products table in the database.
*/

export async function getProducts() {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Products`,
  //   }
  // );
  // const data = response.result[0].results as Product[];
  // return data;
  const response = await fetch("http://localhost:3001/api/products", {
    method: "GET",
  });
  const data = (await response.json()) as Product[];
  console.log("Response from API products: ", data);
  return data;
}

export async function getProductById(id: string) {
  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: "GET",
  });
  const data = (await response.json()) as Product[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function addProduct(
  provider: string,
  name: string,
  quantity: number,
  location: string,
  price: number
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `INSERT INTO Products (id, provider, name, quantity, location) VALUES (?, ?, ?, ?, ?)`,
  //     params: [nanoid(), provider_id, name, numberToString(quantity), location],
  //   }
  // );
  // const data = response.result[0].results as Product[];
  // return data;
  const _id = nanoid();
  const response = await fetch("http://localhost:3001/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: _id,
      provider,
      name,
      quantity,
      location,
      price,
    }),
  });

  updateHistoryPrice(_id, price);
  const data = (await response.json()) as Product[];
  console.log("AP Response from API: ", data);
  return data;
}

export async function updateProduct(
  id: string,
  provider: string,
  name: string,
  quantity: number,
  location: string,
  price: number
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `UPDATE Products SET provider = ?, name = ?, quantity = ?, location = ? WHERE id = ?`,
  //     params: [provider_id, name, numberToString(quantity), location, id],
  //   }
  // );
  // const data = response.result[0].results as Product[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      provider,
      name,
      quantity,
      location,
      price,
    }),
  });
  updateHistoryPrice(id, price);
  const data = (await response.json()) as Product[];
  console.log("UP Response from API: ", data);
  return data;
}

export async function deleteProduct(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `DELETE FROM Products WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results as Product[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as Product[];
  console.log("DP Response from API: ", data);
  return data;
}

/*
  API for Providers
  These functions are used to interact with the Providers table in the database.
*/

export async function getProviders() {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Providers`,
  //   }
  // );
  // const data = response.result[0].results as Provider[];
  // return data;
  const response = await fetch("http://localhost:3001/api/providers");
  const data = (await response.json()) as Provider[];
  console.log("Response from API: ", data);
  return data;
}

export async function getProviderById(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Providers WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results;
  // if (data === undefined) {
  //   return null;
  // }

  // return data[0] as Provider;
  const response = await fetch(`http://localhost:3001/api/providers/${id}`);
  const data = (await response.json()) as Provider[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function addProvider(
  name: string,
  address: string,
  phone: string,
  email: string
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `INSERT INTO Providers (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?)`,
  //     params: [nanoid(), name, address, phone, email],
  //   }
  // );
  // const data = response.result[0].results as Provider[];
  // return data;
  const response = await fetch("http://localhost:3001/api/providers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: nanoid(),
      name,
      address,
      phone,
      email,
    }),
  });
  const data = (await response.json()) as Provider[];
  console.log("AP Response from API: ", data);
  return data;
}

export async function updateProvider(
  id: string,
  name: string,
  address: string,
  phone: string,
  email: string
) {
  // console.log("Adding provider", id, name, address, phone, email);
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `UPDATE Providers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?`,
  //     params: [name, address, phone, email, id],
  //   }
  // );
  // const data = response.result[0].results as Provider[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/providers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      address,
      phone,
      email,
    }),
  });
  const data = (await response.json()) as Provider[];
  console.log("UP Response from API: ", data);
  return data;
}

export async function deleteProvider(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `DELETE FROM Providers WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results as Provider[];
  // return data;

  const response = await fetch(`http://localhost:3001/api/providers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as Provider[];
  console.log("DP Response from API: ", data);
  return data;
}

/*
  API for Fleet
  These functions are used to interact with the Fleet table in the database.
*/

export async function getFleet() {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Fleet`,
  //   }
  // );
  // const data = response.result[0].results as Fleet[];
  // return data;
  const response = await fetch("http://localhost:3001/api/fleet");
  const data = (await response.json()) as Fleet[];
  console.log("Response from API: ", data);
  return data;
}

export async function getFleetById(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Fleet WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results;
  // if (data === undefined) {
  //   return null;
  // }

  // return data[0] as Fleet;
  const response = await fetch(`http://localhost:3001/api/fleet/${id}`);
  const data = (await response.json()) as Fleet[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function addFleet(
  invoice: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `INSERT INTO Fleet (id, invoice, departure, destination, status) VALUES (?, ?, ?, ?, ?)`,
  //     params: [nanoid(), invoice_id, departure, destination, status],
  //   }
  // );
  // const data = response.result[0].results as Fleet[];
  // return data;
  const response = await fetch("http://localhost:3001/api/fleet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: nanoid(),
      invoice,
      departure,
      destination,
      status,
    }),
  });
  const data = (await response.json()) as Fleet[];
  console.log("AP Response from API: ", data);
  return data;
}

export async function updateFleet(
  id: string,
  invoice: string,
  departure: string,
  destination: string,
  status: FleetStatus
) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `UPDATE Fleet SET invoice = ?, departure = ?, destination = ?, status = ? WHERE id = ?`,
  //     params: [invoice_id, departure, destination, status, id],
  //   }
  // );
  // const data = response.result[0].results as Fleet[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/fleet/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      invoice,
      departure,
      destination,
      status,
    }),
  });
  const data = (await response.json()) as Fleet[];
  console.log("UP Response from API: ", data);
  return data;
}

export async function deleteFleet(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `DELETE FROM Fleet WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results as Fleet[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/fleet/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as Fleet[];
  console.log("DP Response from API: ", data);
  return data;
}

/*
  API for Invoices
  These functions are used to interact with the Invoices table in the database.
*/

export async function getInvoices() {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Invoices`,
  //   }
  // );
  // const data = response.result[0].results as Invoice[];
  // return data;
  const response = await fetch("http://localhost:3001/api/invoices");
  const data = (await response.json()) as Invoice[];
  console.log("Response from API: ", data);
  return data;
}

export async function getInvoiceById(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Invoices WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results;
  // if (data === undefined) {
  //   return null;
  // }

  // return data[0] as Invoice;
  const response = await fetch(`http://localhost:3001/api/invoices/${id}`);
  const data = (await response.json()) as Invoice[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function addInvoice(order: Invoice[]) {
  if (order.length === 0) {
    return null;
  }

  console.log("Adding invoice: ", order);
  let invoiceId = nanoid();
  for (let i = 0; i < order.length; i++) {
    if (order[i].invoiceItemId !== "") {
      invoiceId = order[i].invoiceItemId;
    }
  }

  order.map(async (item) => {
    // const response = await cloudflare.d1.database.query(
    //   process.env.DATABASE_ID!,
    //   {
    //     account_id: process.env.ACCOUNT_ID!,
    //     sql: `INSERT INTO Invoices (id, invoiceItemId, productId, quantity) VALUES (?, ?, ?, ?)`,
    //     params: [
    //       invoiceId,
    //       nanoid(),
    //       item.productId,
    //       numberToString(item.quantity),
    //     ],
    //   }
    // );

    // console.log("Adding invoice item", item);

    // // If error, return null
    // if (response.result[0].success === false) {
    //   return null;
    // }
    let invoiceItemId = nanoid();
    for (let i = 0; i < order.length; i++) {
      if (
        order[i].productId === item.productId &&
        order[i].invoiceItemId !== ""
      ) {
        invoiceItemId = order[i].invoiceItemId;
      }
    }

    const response = await fetch("http://localhost:3001/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: invoiceId,
        invoiceItemId: invoiceItemId,
        productId: item.productId,
        quantity: numberToString(item.quantity),
      }),
    });
    const data = (await response.json()) as Invoice[];
    console.log("AP Response from API: ", data);
    if (data === undefined) {
      return null;
    }
  });

  return order;
}

async function updateHistoryPrice(id: string, price: number) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `UPDATE Products SET price = ? WHERE id = ?`,
  //     params: [numberToString(price), id],
  //   }
  // );
  // const data = response.result[0].results as Product[];
  // return data;
  const date = new Date();
  const response = await fetch(`http://localhost:3001/api/history/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPrice: price,
      Date: date.toISOString(),
    }),
  });
  const data = (await response.json()) as Product[];
  console.log("UP Response from API: ", data);
  return data;
}

export async function getHistoryPrice(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `SELECT * FROM Products WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results;
  // if (data === undefined) {
  //   return null;
  // }

  // return data[0] as Product;
  const response = await fetch(`http://localhost:3001/api/history/${id}`);
  const data = (await response.json()) as Data2Plot[];
  if (data === undefined) {
    return null;
  }
  console.log("GPBYD: Response from API: ", data);
  return data;
}

export async function generateRandomHistoryPrice(id: string) {
  await fetch(`http://localhost:3001/api/history/random/${id}`, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
  });
}

export async function updateInvoice(order: Invoice[]) {
  if (order.length === 0) {
    return null;
  }
  console.log("Adding invoice: ", order);
  const res = addInvoice(order);

  order.map(async (item) => {
    deleteInvoice(item.id);
  });

  return res;
}

export async function deleteInvoice(id: string) {
  // const response = await cloudflare.d1.database.query(
  //   process.env.DATABASE_ID!,
  //   {
  //     account_id: process.env.ACCOUNT_ID!,
  //     sql: `DELETE FROM Invoices WHERE id = ?`,
  //     params: [id],
  //   }
  // );
  // const data = response.result[0].results as Invoice[];
  // return data;
  const response = await fetch(`http://localhost:3001/api/invoices/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as Invoice[];
  console.log("DP Response from API: ", data);
  return data;
}
