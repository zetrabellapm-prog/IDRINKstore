"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { products as allProducts } from "@/data/products";
import {
  Package, Clock, CheckCircle2, Truck, ArrowRight, ShoppingBag,
  XCircle, Star, RotateCcw, ChefHat, X
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  id?: string;
}

interface Order {
  id: string;
  storeName?: string;
  storeId?: string;
  items: OrderItem[];
  total: number;
  address: string;
  paymentMethod: string;
  status: "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled";
  createdAt: string;
}

// Mock past orders
const mockOrders: Order[] = [
  {
    id: "#iDK-2847",
    storeName: "Distribuidora Gelada",
    storeId: "distribuidora-gelada",
    items: [
      { name: "Heineken Long Neck 330ml", quantity: 6, price: 7.9, id: "dg-001" },
      { name: "Red Bull 250ml", quantity: 2, price: 12.9, id: "dg-003" },
    ],
    total: 73.2,
    address: "Rua das Flores, 123",
    paymentMethod: "pix",
    status: "delivered",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "#iDK-2631",
    storeName: "Adega Premium",
    storeId: "adega-premium",
    items: [
      { name: "Vinho Tinto Reserva Especial", quantity: 1, price: 89.9, id: "ap-001" },
      { name: "Gin Tanqueray 750ml", quantity: 1, price: 119.9, id: "ap-006" },
    ],
    total: 209.8,
    address: "Av. Brasil, 456",
    paymentMethod: "card",
    status: "delivered",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "#iDK-2510",
    storeName: "Drinks Express",
    storeId: "drinks-express",
    items: [
      { name: "Jack Daniel's 1L", quantity: 1, price: 189.9, id: "de-005" },
      { name: "Refrigerante Coca-Cola 2L", quantity: 2, price: 12.9, id: "de-007" },
    ],
    total: 215.7,
    address: "Rua Palmeiras, 789",
    paymentMethod: "cash",
    status: "delivered",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "#iDK-2400",
    storeName: "Cervejaria Hop",
    storeId: "cervejaria-hop",
    items: [
      { name: "IPA Tropical 473ml", quantity: 4, price: 16.9, id: "ch-001" },
      { name: "Tabua de Frios Artesanal", quantity: 1, price: 49.9, id: "ch-004" },
    ],
    total: 117.5,
    address: "Rua Augusta, 321",
    paymentMethod: "pix",
    status: "cancelled",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const statusConfig = {
  confirmed: { label: "Confirmado", icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-500/10" },
  preparing: { label: "Em preparo", icon: ChefHat, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  delivering: { label: "A caminho", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10" },
  delivered: { label: "Entregue", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-[#ea1d2c]", bg: "bg-[#ea1d2c]/10" },
};

const trackerSteps = [
  { label: "Pedido recebido", icon: CheckCircle2 },
  { label: "Loja confirmando", icon: Clock },
  { label: "Em preparo", icon: ChefHat },
  { label: "Saiu para entrega", icon: Truck },
  { label: "Entregue", icon: Package },
];

// Rating modal
function RatingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const tags = ["Entrega rapida", "Produto gelado", "Embalagem boa", "Atendimento"];

  const toggleTag = (tag: string) => setSelectedTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="mx-4 w-full max-w-sm rounded-[14px] border border-[#2a2a3a] bg-[#12121a] p-8 text-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 animate-check-scale">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Obrigado pela avaliacao!</h3>
          <p className="mt-2 text-sm text-[#9999aa]">Sua opiniao ajuda a melhorar nosso servico.</p>
          <button onClick={onClose} className="mt-6 w-full rounded-[50px] bg-[#ea1d2c] py-3 font-semibold text-white hover:opacity-90">Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-[14px] border border-[#2a2a3a] bg-[#12121a] p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Avaliar Pedido</h3>
          <button onClick={onClose} className="text-[#9999aa] hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-1 text-sm text-[#9999aa]">{order.storeName} - {order.id}</p>

        {/* Stars */}
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
              <Star className={`h-8 w-8 ${s <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-[#2a2a3a]"} transition-colors`} />
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <button key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1.5 text-sm transition-all ${selectedTags.includes(tag) ? "bg-[#ea1d2c] text-white" : "border border-[#2a2a3a] text-[#9999aa] hover:border-[#ea1d2c]/30"}`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Deixe um comentario (opcional)" rows={3} className="mt-4 w-full resize-none rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] py-2.5 px-4 text-white placeholder:text-[#9999aa]/50 focus:border-[#ea1d2c]/50 focus:outline-none" />

        <button onClick={() => setSubmitted(true)} disabled={rating === 0} className="mt-4 w-full rounded-[50px] bg-[#ea1d2c] py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50">
          Enviar Avaliacao
        </button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem("idrink_orders");
    let realOrders: Order[] = [];
    if (stored) {
      try { realOrders = JSON.parse(stored); } catch { /* empty */ }
    }
    // Merge with mock past orders, but avoid duplicates
    const existingIds = new Set(realOrders.map((o) => o.id));
    const combined = [...realOrders, ...mockOrders.filter((m) => !existingIds.has(m.id))];
    setOrders(combined);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      if (item.id) {
        const product = allProducts.find((p) => p.id === item.id);
        if (product) {
          for (let i = 0; i < item.quantity; i++) addItem(product);
        }
      }
    });
  };

  const activeOrders = orders.filter((o) => ["confirmed", "preparing", "delivering"].includes(o.status));
  const pastOrders = orders.filter((o) => ["delivered", "cancelled"].includes(o.status));

  const getTrackerStep = (status: Order["status"]) => {
    if (status === "confirmed") return 1;
    if (status === "preparing") return 2;
    if (status === "delivering") return 3;
    if (status === "delivered") return 4;
    return 0;
  };

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#12121a]">
          <Package className="h-10 w-10 text-[#9999aa]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Nenhum pedido ainda</h1>
        <p className="mt-2 text-[#9999aa]">Seus pedidos aparecerão aqui apos sua primeira compra</p>
        <Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-[50px] bg-[#ea1d2c] px-6 py-3 font-semibold text-white red-glow hover:opacity-90">
          Explorar Lojas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Meus Pedidos</h1>
        <p className="mt-1 text-[#9999aa]">Acompanhe o status dos seus pedidos</p>
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">Em andamento</h2>
          {activeOrders.map((order) => {
            const step = getTrackerStep(order.status);
            return (
              <div key={order.id} className="overflow-hidden rounded-[14px] border border-green-500/30 bg-[#12121a]">
                <div className="flex items-center justify-between border-b border-[#2a2a3a] px-5 py-4">
                  <div>
                    <p className="font-semibold text-white">{order.storeName || "Loja"}</p>
                    <p className="text-sm text-[#9999aa]">{order.id} - {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 animate-pulse-dot">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-400">Em andamento</span>
                  </div>
                </div>

                {/* Tracker */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    {trackerSteps.map((s, i) => {
                      const Icon = s.icon;
                      const isDone = i <= step;
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${isDone ? "bg-green-500/20 text-green-400" : "bg-[#2a2a3a] text-[#9999aa]"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className={`text-[10px] ${isDone ? "text-green-400" : "text-[#9999aa]"}`}>{s.label.split(" ")[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1 w-full rounded-full bg-[#2a2a3a]">
                    <div className="h-1 rounded-full bg-green-500 transition-all duration-1000" style={{ width: `${(step / 4) * 100}%` }} />
                  </div>
                </div>

                <div className="border-t border-[#2a2a3a] px-5 py-4">
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#9999aa]">{item.quantity}x {item.name}</span>
                        <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-[#2a2a3a] pt-3">
                    <span className="font-medium text-[#9999aa]">Total</span>
                    <span className="font-bold text-[#ea1d2c]">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past orders */}
      {pastOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Pedidos anteriores</h2>
          {pastOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="overflow-hidden rounded-[14px] border border-[#2a2a3a] bg-[#12121a]">
                <div className="flex items-center justify-between border-b border-[#2a2a3a] px-5 py-4">
                  <div>
                    <p className="font-semibold text-white">{order.storeName || "Loja"}</p>
                    <p className="text-xs text-[#9999aa]">{order.id} - {formatDate(order.createdAt)}</p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${status.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-sm text-[#9999aa]">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#2a2a3a] pt-3">
                    <span className="font-bold text-[#ea1d2c]">{formatCurrency(order.total)}</span>
                    <div className="flex gap-2">
                      {order.status === "delivered" && (
                        <button onClick={() => setRatingOrder(order)} className="flex items-center gap-1.5 rounded-full border border-[#2a2a3a] px-3 py-1.5 text-sm text-[#9999aa] transition-all hover:border-yellow-500/30 hover:text-yellow-400">
                          <Star className="h-3.5 w-3.5" /> Avaliar
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button onClick={() => handleReorder(order)} className="flex items-center gap-1.5 rounded-full bg-[#ea1d2c]/10 px-3 py-1.5 text-sm font-medium text-[#ea1d2c] transition-all hover:bg-[#ea1d2c]/20">
                          <RotateCcw className="h-3.5 w-3.5" /> Pedir novamente
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {ratingOrder && <RatingModal order={ratingOrder} onClose={() => setRatingOrder(null)} />}
    </div>
  );
}
