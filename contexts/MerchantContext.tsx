"use client";

import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

/* ─── Types ────────────────────────────────────────────── */

export interface MerchantProfile {
  id: string;
  ownerName: string;
  storeName: string;
  email: string;
  phone: string;
  docType: "cpf" | "cnpj";
  doc: string;
  rating: number;
  storeDescription: string;
  storeBanner: string | null;
  storeLogo: string | null;
  openTime: string;
  closeTime: string;
  deliveryTime: string;
  deliveryRadius: number;
  pixKeyType: string;
  pixKey: string;
  createdAt: string;
}

export interface Order {
  id: string;
  time: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "novo" | "preparando" | "entregue" | "cancelado";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export interface MerchantProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  image: string | null;
}

/* ─── Seed Data ────────────────────────────────────────── */

const seedOrders: Order[] = [
  {
    id: "PED-001",
    time: "14:32",
    date: "2026-02-28",
    customerName: "Lucas Mendes",
    customerEmail: "lucas.m@email.com",
    items: [
      { name: "Heineken 600ml", qty: 2, price: 14.9 },
      { name: "Smirnoff Ice", qty: 1, price: 9.5 },
    ],
    total: 39.3,
    status: "novo",
  },
  {
    id: "PED-002",
    time: "13:45",
    date: "2026-02-28",
    customerName: "Ana Clara",
    customerEmail: "ana.c@email.com",
    items: [
      { name: "Absolut Vodka 1L", qty: 1, price: 89.9 },
      { name: "Red Bull 250ml", qty: 4, price: 12.0 },
    ],
    total: 137.9,
    status: "preparando",
  },
  {
    id: "PED-003",
    time: "12:10",
    date: "2026-02-28",
    customerName: "Carlos Silva",
    customerEmail: "carlos.s@email.com",
    items: [{ name: "Whisky Jack Daniels 1L", qty: 1, price: 189.9 }],
    total: 189.9,
    status: "entregue",
  },
  {
    id: "PED-004",
    time: "11:20",
    date: "2026-02-28",
    customerName: "Mariana Costa",
    customerEmail: "mariana@email.com",
    items: [
      { name: "Tanqueray Gin 750ml", qty: 1, price: 119.9 },
      { name: "Agua Tonica Schweppes", qty: 6, price: 5.5 },
    ],
    total: 152.9,
    status: "entregue",
  },
  {
    id: "PED-005",
    time: "10:05",
    date: "2026-02-27",
    customerName: "Pedro Oliveira",
    customerEmail: "pedro.o@email.com",
    items: [{ name: "Skol 350ml", qty: 12, price: 3.5 }],
    total: 42.0,
    status: "cancelado",
  },
  {
    id: "PED-006",
    time: "19:30",
    date: "2026-02-27",
    customerName: "Juliana Lima",
    customerEmail: "juliana@email.com",
    items: [
      { name: "Vinho Casillero del Diablo", qty: 2, price: 59.9 },
      { name: "Queijo Brie", qty: 1, price: 35.0 },
    ],
    total: 154.8,
    status: "entregue",
  },
  {
    id: "PED-007",
    time: "20:15",
    date: "2026-02-27",
    customerName: "Rafael Santos",
    customerEmail: "rafael.s@email.com",
    items: [
      { name: "Corona Extra 355ml", qty: 6, price: 9.9 },
      { name: "Limao Taiti", qty: 1, price: 4.0 },
    ],
    total: 63.4,
    status: "novo",
  },
  {
    id: "PED-008",
    time: "16:50",
    date: "2026-02-26",
    customerName: "Fernanda Rocha",
    customerEmail: "fernanda.r@email.com",
    items: [
      { name: "Moet Chandon 750ml", qty: 1, price: 299.9 },
    ],
    total: 299.9,
    status: "preparando",
  },
];

const seedCustomers: Customer[] = [
  { id: "CLI-01", name: "Lucas Mendes", email: "lu***@email.com", orders: 5, totalSpent: 312.5, lastOrder: "2026-02-28" },
  { id: "CLI-02", name: "Ana Clara", email: "an***@email.com", orders: 8, totalSpent: 890.0, lastOrder: "2026-02-28" },
  { id: "CLI-03", name: "Carlos Silva", email: "ca***@email.com", orders: 3, totalSpent: 420.7, lastOrder: "2026-02-28" },
  { id: "CLI-04", name: "Mariana Costa", email: "ma***@email.com", orders: 12, totalSpent: 1540.0, lastOrder: "2026-02-28" },
  { id: "CLI-05", name: "Pedro Oliveira", email: "pe***@email.com", orders: 2, totalSpent: 84.0, lastOrder: "2026-02-27" },
  { id: "CLI-06", name: "Juliana Lima", email: "ju***@email.com", orders: 6, totalSpent: 720.3, lastOrder: "2026-02-27" },
  { id: "CLI-07", name: "Rafael Santos", email: "ra***@email.com", orders: 4, totalSpent: 253.6, lastOrder: "2026-02-27" },
  { id: "CLI-08", name: "Fernanda Rocha", email: "fe***@email.com", orders: 1, totalSpent: 299.9, lastOrder: "2026-02-26" },
];

const seedProducts: MerchantProduct[] = [
  {
    id: "PROD-01",
    name: "Heineken 600ml",
    category: "Cerveja",
    description: "Cerveja premium lager importada",
    price: 14.9,
    stock: 48,
    featured: true,
    image: null,
  },
  {
    id: "PROD-02",
    name: "Absolut Vodka 1L",
    category: "Vodka",
    description: "Vodka sueca premium",
    price: 89.9,
    stock: 12,
    featured: true,
    image: null,
  },
  {
    id: "PROD-03",
    name: "Tanqueray Gin 750ml",
    category: "Gin",
    description: "London Dry Gin classico",
    price: 119.9,
    stock: 8,
    featured: false,
    image: null,
  },
];

/* ─── Reducer ──────────────────────────────────────────── */

interface MerchantState {
  isLoggedIn: boolean;
  profile: MerchantProfile | null;
  orders: Order[];
  customers: Customer[];
  products: MerchantProduct[];
}

type MerchantAction =
  | { type: "LOGIN"; payload: MerchantProfile }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<MerchantProfile> }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "UPDATE_ORDER_STATUS"; payload: { id: string; status: Order["status"] } }
  | { type: "ADD_PRODUCT"; payload: MerchantProduct }
  | { type: "UPDATE_PRODUCT"; payload: MerchantProduct }
  | { type: "REMOVE_PRODUCT"; payload: string };

function merchantReducer(state: MerchantState, action: MerchantAction): MerchantState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, profile: action.payload };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, profile: null };
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
      };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
      };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

/* ─── Context ──────────────────────────────────────────── */

interface MerchantContextValue {
  state: MerchantState;
  dispatch: React.Dispatch<MerchantAction>;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
}

const MerchantContext = createContext<MerchantContextValue | null>(null);

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(merchantReducer, {
    isLoggedIn: false,
    profile: null,
    orders: seedOrders,
    customers: seedCustomers,
    products: seedProducts,
  });

  const [toastMsg, setToastMsg] = useState<{ text: string; type: string } | null>(null);

  function toast(msg: string, type: "success" | "error" | "info" = "success") {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  }

  return (
    <MerchantContext.Provider value={{ state, dispatch, toast }}>
      {children}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-bottom-4 ${
            toastMsg.type === "success"
              ? "bg-emerald-600 text-white"
              : toastMsg.type === "error"
              ? "bg-[#e63946] text-white"
              : "bg-[#00b4d8] text-white"
          }`}
        >
          {toastMsg.text}
        </div>
      )}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  const ctx = useContext(MerchantContext);
  if (!ctx) throw new Error("useMerchant deve ser usado dentro de MerchantProvider");
  return ctx;
}
