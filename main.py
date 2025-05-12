from flask import Flask, render_template, request, redirect, session
import argparse
import threading
import sqlite3
import definitions

app = Flask(__name__)

@app.route("/api/personal", methods=["GET"])
def get_personal():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Personal")
    rows = cur.fetchall()

    # Convert rows to a list of dictionaries
    personal_list = []
    for row in rows:
        personal = {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "address": row[3],
            "rol": row[4],
            "password": row[5],
        }
        personal_list.append(personal)
        
    cur.close()
    
    # Return the list of personal as JSON
    return personal_list

@app.route("/api/personal/<string:personal_id>", methods=["GET"])
def get_personal_by_id(personal_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Personal WHERE id=?", (personal_id,))
    row = cur.fetchone()

    if row:
        personal = {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "address": row[3],
            "rol": row[4],
            "password": row[5],
        }
        return [personal]
    else:
        return {"error": "Personal not found"}, 404
    
@app.route("/api/personal", methods=["POST"])
def add_personal():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    personal_id = data["id"]
    name = data["name"]
    email = data["email"]
    address = data["address"]
    rol = data["rol"]
    password = data["password"]

    # Insert new personal into the database
    cur.execute(
        "INSERT INTO Personal (id, name, email, address, rol, password) VALUES (?, ?, ?, ?, ?, ?)",
        (personal_id, name, email, address, rol, password),
    )
    
    con.commit()
    cur.close()
    
    new_personal = {
        "id": personal_id,
        "name": name,
        "email": email,
        "address": address,
        "rol": rol,
        "password": password,
    }
    
    return [new_personal]

@app.route("/api/personal/<string:personal_id>", methods=["PUT"])
def update_personal(personal_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    address = data["address"]
    rol = data["rol"]
    password = data["password"]

    # Update personal in the database
    cur.execute(
        "UPDATE Personal SET name=?, email=?, address=?, rol=?, password=? WHERE id=?",
        (name, email, address, rol, password, personal_id),
    )
    
    con.commit()
    cur.close()
    
    updated_personal = {
        "id": personal_id,
        "name": name,
        "email": email,
        "address": address,
        "rol": rol,
        "password": password,
    }
    
    print(updated_personal)
    return [updated_personal]

@app.route("/api/personal/<string:personal_id>", methods=["DELETE"])
def delete_personal(personal_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Personal WHERE id=?", (personal_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "Personal not found"}, 404
    
    old_personal = {
        "id": row[0],
        "name": row[1],
        "email": row[2],
        "address": row[3],
        "rol": row[4],
        "password": row[5],
    }
    
    # Delete personal from the database
    cur.execute("DELETE FROM Personal WHERE id=?", (personal_id,))
    
    con.commit()
    cur.close()
    
    return [old_personal]

@app.route("/api/login", methods=["POST"])
def login():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    # Check if user exists in the database
    cur.execute(
        "SELECT * FROM Personal WHERE email=? AND password=?", (email, password)
    )
    row = cur.fetchone()

    if row:
        person = {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "address": row[3],
            "rol": row[4],
        }
        print(person)
        return [person]
    else:
        print("Invalid credentials")
        return {"error": "Invalid credentials"}, 401

        
def run_server(port):
    # Check if npm / pnpm is installed
    try:
        import subprocess

        subprocess.run(["pnpm", "--version"], check=True)
    except FileNotFoundError:
        print("pnpm is not installed. Por favor instala npm primero.")
        return

    # Start the server
    try:
        import subprocess

        subprocess.run(["pnpm", "run", "dev", "-p", str(port)], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error al iniciar el servidor: {e}")
        return
    
@app.route("/api/products", methods=["GET"])
def get_products():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Products")
    rows = cur.fetchall()

    # Convert rows to a list of dictionaries
    products_list = []
    for row in rows:
        product = {
            "id": row[0],
            "provider": row[1],
            "name": row[2],
            "quantity": row[3],
            "location": row[4],
        }
        products_list.append(product)
        
    cur.close()
    
    # Return the list of products as JSON
    print(products_list)
    return products_list

@app.route("/api/products/<string:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Products WHERE id=?", (product_id,))
    row = cur.fetchone()

    if row:
        product = {
            "id": row[0],
            "provider": row[1],
            "name": row[2],
            "quantity": row[3],
            "location": row[4],
        }
        return [product]
    else:
        return {"error": "Product not found"}, 404
    
@app.route("/api/products", methods=["POST"])
def add_product():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    product_id = data["id"]
    provider = data["provider"]
    name = data["name"]
    quantity = data["quantity"]
    location = data["location"]

    # Insert new product into the database
    cur.execute(
        "INSERT INTO Products (id, provider, name, quantity, location) VALUES (?, ?, ?, ?, ?)",
        (product_id, provider, name, quantity, location),
    )
    
    con.commit()
    cur.close()
    
    new_product = {
        "id": product_id,
        "provider": provider,
        "name": name,
        "quantity": quantity,
        "location": location,
    }
    
    return [new_product]

@app.route("/api/products/<string:product_id>", methods=["PUT"])
def update_product(product_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    provider = data["provider"]
    name = data["name"]
    quantity = data["quantity"]
    location = data["location"]

    # Update product in the database
    cur.execute(
        "UPDATE Products SET provider=?, name=?, quantity=?, location=? WHERE id=?",
        (provider, name, quantity, location, product_id),
    )
    
    con.commit()
    cur.close()
    
    updated_product = {
        "id": product_id,
        "provider": provider,
        "name": name,
        "quantity": quantity,
        "location": location,
    }
    
    return [updated_product]

@app.route("/api/products/<string:product_id>", methods=["DELETE"])
def delete_product(product_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Products WHERE id=?", (product_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "Product not found"}, 404
    
    old_product = {
        "id": row[0],
        "provider": row[1],
        "name": row[2],
        "quantity": row[3],
        "location": row[4],
    }
    
    # Delete product from the database
    cur.execute("DELETE FROM Products WHERE id=?", (product_id,))
    
    con.commit()
    cur.close()
    
    return [old_product]

@app.route("/api/providers", methods=["GET"])
def get_providers():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Providers")
    rows = cur.fetchall()

    # Convert rows to a list of dictionaries
    providers_list = []
    for row in rows:
        provider = {
            "id": row[0],
            "name": row[1],
            "address": row[2],
            "phone": row[3],
            "email": row[4],
        }
        providers_list.append(provider)
        
    cur.close()
    
    # Return the list of providers as JSON
    return providers_list

@app.route("/api/providers/<string:provider_id>", methods=["GET"])
def get_provider_by_id(provider_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Providers WHERE id=?", (provider_id,))
    row = cur.fetchone()

    if row:
        provider = {
            "id": row[0],
            "name": row[1],
            "address": row[2],
            "phone": row[3],
            "email": row[4],
        }
        return [provider]
    else:
        return {"error": "Provider not found"}, 404
    
@app.route("/api/providers", methods=["POST"])
def add_provider():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    provider_id = data["id"]
    name = data["name"]
    address = data["address"]
    phone = data["phone"]
    email = data["email"]

    # Insert new provider into the database
    cur.execute(
        "INSERT INTO Providers (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?)",
        (provider_id, name, address, phone, email),
    )
    
    con.commit()
    cur.close()
    
    new_provider = {
        "id": provider_id,
        "name": name,
        "address": address,
        "phone": phone,
        "email": email,
    }
    
    return [new_provider]

@app.route("/api/providers/<string:provider_id>", methods=["PUT"])
def update_provider(provider_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    name = data["name"]
    address = data["address"]
    phone = data["phone"]
    email = data["email"]

    # Update provider in the database
    cur.execute(
        "UPDATE Providers SET name=?, address=?, phone=?, email=? WHERE id=?",
        (name, address, phone, email, provider_id),
    )
    
    con.commit()
    cur.close()
    
    updated_provider = {
        "id": provider_id,
        "name": name,
        "address": address,
        "phone": phone,
        "email": email,
    }
    
    return [updated_provider]

@app.route("/api/providers/<string:provider_id>", methods=["DELETE"])
def delete_provider(provider_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Providers WHERE id=?", (provider_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "Provider not found"}, 404
    
    old_provider = {
        "id": row[0],
        "name": row[1],
        "address": row[2],
        "phone": row[3],
        "email": row[4],
    }
    
    # Delete provider from the database
    cur.execute("DELETE FROM Providers WHERE id=?", (provider_id,))
    
    con.commit()
    cur.close()
    
    return [old_provider]

@app.route("/api/fleet", methods=["GET"])
def get_fleet():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Fleet")
    rows = cur.fetchall()

    # Convert rows to a list of dictionaries
    fleet_list = []
    for row in rows:
        fleet = {
            "id": row[0],
            "invoice": row[1],
            "departure": row[2],
            "destination": row[3],
            "status": row[4],
        }
        fleet_list.append(fleet)
        
    cur.close()
    
    # Return the list of fleet as JSON
    return fleet_list

@app.route("/api/fleet/<string:fleet_id>", methods=["GET"])
def get_fleet_by_id(fleet_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Fleet WHERE id=?", (fleet_id,))
    row = cur.fetchone()

    if row:
        fleet = {
            "id": row[0],
            "invoice": row[1],
            "departure": row[2],
            "destination": row[3],
            "status": row[4],
        }
        return [fleet]
    else:
        return {"error": "Fleet not found"}, 404
    
@app.route("/api/fleet", methods=["POST"])
def add_fleet():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    fleet_id = data["id"]
    invoice = data["invoice"]
    departure = data["departure"]
    destination = data["destination"]
    status = data["status"]

    # Insert new fleet into the database
    cur.execute(
        "INSERT INTO Fleet (id, invoice, departure, destination, status) VALUES (?, ?, ?, ?, ?)",
        (fleet_id, invoice, departure, destination, status),
    )
    
    con.commit()
    cur.close()
    
    new_fleet = {
        "id": fleet_id,
        "invoice": invoice,
        "departure": departure,
        "destination": destination,
        "status": status,
    }
    
    return [new_fleet]

@app.route("/api/fleet/<string:fleet_id>", methods=["PUT"])
def update_fleet(fleet_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    invoice = data["invoice"]
    departure = data["departure"]
    destination = data["destination"]
    status = data["status"]

    # Update fleet in the database
    cur.execute(
        "UPDATE Fleet SET invoice=?, departure=?, destination=?, status=? WHERE id=?",
        (invoice, departure, destination, status, fleet_id),
    )
    
    con.commit()
    cur.close()
    
    updated_fleet = {
        "id": fleet_id,
        "invoice": invoice,
        "departure": departure,
        "destination": destination,
        "status": status,
    }
    
    return [updated_fleet]

@app.route("/api/fleet/<string:fleet_id>", methods=["DELETE"])
def delete_fleet(fleet_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Fleet WHERE id=?", (fleet_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "Fleet not found"}, 404
    
    old_fleet = {
        "id": row[0],
        "invoice": row[1],
        "departure": row[2],
        "destination": row[3],
        "status": row[4],
    }
    
    # Delete fleet from the database
    cur.execute("DELETE FROM Fleet WHERE id=?", (fleet_id,))
    
    con.commit()
    cur.close()
    
    return [old_fleet]

@app.route("/api/invoices", methods=["GET"])
def get_invoices():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Invoices")
    rows = cur.fetchall()

    # Convert rows to a list of dictionaries
    invoices_list = []
    for row in rows:
        invoice = {
            "id": row[0],
            "invoiceItemId": row[1],
            "productId": row[2],
            "quantity": row[3],
        }
        invoices_list.append(invoice)
        
    cur.close()
    
    # Return the list of invoices as JSON
    return invoices_list

@app.route("/api/invoices/<string:invoice_id>", methods=["GET"])
def get_invoice_by_id(invoice_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Invoices WHERE id=?", (invoice_id,))
    row = cur.fetchone()

    if row:
        invoice = {
            "id": row[0],
            "invoiceItemId": row[1],
            "productId": row[2],
            "quantity": row[3],
        }
        return [invoice]
    else:
        return {"error": "Invoice not found"}, 404
    
@app.route("/api/invoices", methods=["POST"])
def add_invoice():
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    invoice_id = data["id"]
    invoiceItemId = data["invoiceItemId"]
    productId = data["productId"]
    quantity = data["quantity"]

    # Insert new invoice into the database
    cur.execute(
        "INSERT INTO Invoices (id, invoiceItemId, productId, quantity) VALUES (?, ?, ?, ?)",
        (invoice_id, invoiceItemId, productId, quantity),
    )
    
    con.commit()
    cur.close()
    
    new_invoice = {
        "id": invoice_id,
        "invoiceItemId": invoiceItemId,
        "productId": productId,
        "quantity": quantity,
    }
    
    return [new_invoice]

@app.route("/api/invoices/<string:invoice_id>", methods=["PUT"])
def update_invoice(invoice_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    # Get data from request
    data = request.get_json()
    invoiceItemId = data["invoiceItemId"]
    productId = data["productId"]
    quantity = data["quantity"]

    # Update invoice in the database
    cur.execute(
        "UPDATE Invoices SET invoiceItemId=?, productId=?, quantity=? WHERE id=?",
        (invoiceItemId, productId, quantity, invoice_id),
    )
    
    con.commit()
    cur.close()
    
    updated_invoice = {
        "id": invoice_id,
        "invoiceItemId": invoiceItemId,
        "productId": productId,
        "quantity": quantity,
    }
    
    return [updated_invoice]

@app.route("/api/invoices/<string:invoice_id>", methods=["DELETE"])
def delete_invoice(invoice_id):
    con = sqlite3.connect("cil.db")
    cur = con.cursor()
    
    cur.execute("SELECT * FROM Invoices WHERE id=?", (invoice_id,))
    row = cur.fetchone()
    if not row:
        return {"error": "Invoice not found"}, 404
    
    old_invoice = {
        "id": row[0],
        "invoiceItemId": row[1],
        "productId": row[2],
        "quantity": row[3],
    }
    
    # Delete invoice from the database
    cur.execute("DELETE FROM Invoices WHERE id=?", (invoice_id,))
    
    con.commit()
    cur.close()
    
    return [old_invoice] 

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="CIL",
        description="CIL - Control de Inventarios y Logística",
        epilog="CIL - Control de Inventarios y Logística (O bueno eso creemos, no recordamos que significaban las siglas)",
        add_help=True,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    parser.add_argument(
        "-f",
        "--frontend_port",
        type=int,
        default=3000,
        help="Puerto para el servidor frontend",
    )
    parser.add_argument(
        "-p", "--port", type=int, default=3001, help="Puerto para el servidor backend"
    )
    parser.add_argument(
        "-v",
        "--version",
        action="version",
        version="%(prog)s 0.1",
        help="Muestra la versión del programa",
    )
    parser.add_argument(
        "-d", "--debug", action="store_true", help="Ejecuta el servidor en modo debug"
    )
    parser.add_argument(
        "-i", "--initialize", action="store_true", help="Inicializa la base de datos"
    )

    args = parser.parse_args()

    if args.initialize:
        con = sqlite3.connect("cil.db")
        cur = con.cursor()
        # Initialize the database
        try:
            cur.execute(
                """CREATE TABLE IF NOT EXISTS Fleet (id TEXT, invoice TEXT, departure TEXT, destination TEXT, status TEXT)"""
            )
            cur.execute(
                """CREATE TABLE IF NOT EXISTS Invoices (id TEXT, invoiceItemId TEXT, productId TEXT, quantity TEXT)"""
            )
            cur.execute(
                """CREATE TABLE IF NOT EXISTS Personal (id TEXT, name TEXT, email TEXT, address TEXT, rol TEXT, password TEXT)"""
            )
            cur.execute(
                """CREATE TABLE IF NOT EXISTS Products (id TEXT, provider TEXT, name TEXT, quantity INTEGER, location TEXT)"""
            )
            cur.execute(
                """CREATE TABLE IF NOT EXISTS Providers (id TEXT, name TEXT, address TEXT, phone TEXT, email TEXT)"""
            )
            
            # Insert default admin user
            cur.execute(
                """INSERT INTO Personal (id, name, email, address, rol, password) VALUES ('admin', 'Admin', 'admin', 'admin', 'admin', 'admin')"""
            )
            con.commit()
            
            print("Base de datos inicializada correctamente.")
            
            cur.execute(
                """SELECT * FROM Personal"""
            )
            rows = cur.fetchall()
            print(rows)
            
            cur.close()
            exit(0)
        except sqlite3.Error as e:
            print(f"Error al inicializar la base de datos: {e}")
            exit(1)

    # Run server in a separate thread
    server_thread = threading.Thread(target=run_server, args=(args.frontend_port,))
    server_thread.start()

    app.run(
        port=args.port,
        debug=args.debug,
    )
