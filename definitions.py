"""
Generate object definitions for the given data.
"""

"""
export interface Product {
  id: string;
  provider: string;
  name: string;
  quantity: number;
  location: string;
}

export interface Provider {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Personal {
  id: string;
  name: string;
  email: string;
  address: string;
  rol: string;
  password: string;
}

export enum FleetStatus {
    Pending = "Pendiente",
    InTransit = "En tránsito",
    Delivered = "Entregado",
    Cancelled = "Cancelado",
}
export interface Invoice {
  id: string;
  invoiceItemId: string;
  productId: string;
  quantity: number;
}

export interface Fleet {
  id: string;
  invoice: string;
  departure: string;
  destination: string;
  status: FleetStatus;
}
"""

# Product
class Product:
    def __init__(self, id: str, provider: str, name: str, quantity: int, location: str):
        self.id = id
        self.provider = provider
        self.name = name
        self.quantity = quantity
        self.location = location

# Provider
class Provider:
    def __init__(self, id: str, name: str, address: str, phone: str, email: str):
        self.id = id
        self.name = name
        self.address = address
        self.phone = phone
        self.email = email
        
# Personal
class Personal:
    def __init__(self, id: str, name: str, email: str, address: str, rol: str, password: str):
        self.id = id
        self.name = name
        self.email = email
        self.address = address
        self.rol = rol
        self.password = password
        
# FleetStatus
class FleetStatus:
    Pending = "Pendiente"
    InTransit = "En tránsito"
    Delivered = "Entregado"
    Cancelled = "Cancelado"
    
# Invoice
class Invoice:
    def __init__(self, id: str, invoiceItemId: str, productId: str, quantity: int):
        self.id = id
        self.invoiceItemId = invoiceItemId
        self.productId = productId
        self.quantity = quantity
        
# Fleet
class Fleet:
    def __init__(self, id: str, invoice: str, departure: str, destination: str, status: FleetStatus):
        self.id = id
        self.invoice = invoice
        self.departure = departure
        self.destination = destination
        self.status = status