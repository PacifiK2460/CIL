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