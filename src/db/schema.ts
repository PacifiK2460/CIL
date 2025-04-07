import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ProductsTable = sqliteTable("Products", {
    id: text("id").primaryKey(),
    provider: text("provider"),
    name: text("name"),
    quantity: int("quantity"),
    location: text("location"),
})

export const ProvidersTable = sqliteTable("Providers", {
    id: text("id").primaryKey(),
    name: text("name"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
})

export const PersonalTable = sqliteTable("Personal", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    address: text("address"),
    rol: text("rol"),
    password: text("password"),
})

export const InvoicesTable = sqliteTable("Invoices", {
    id: text("id").primaryKey(),
    order_key: text("order_key"),
    order_value: int("order_value"),
})

export const FleetTable = sqliteTable("Fleet", {
    id: text("id").primaryKey(),
    invoice: text("invoice"),
    departure: text("departure"),
    destination: text("destination"),
    status: text("status"),
})
