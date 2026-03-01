"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/contexts/CartContext";
import { Plus, Minus, ShoppingBag, Search } from "lucide-react";
import Link from "next/link";

interface StoreProductsProps {
  products: Product[];
  categories: string[];
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#2a2a3a] bg-[#12121a]">
      <div className="skeleton h-40 w-full" />
      <div className="p-4">
        <div className="skeleton mb-2 h-4 w-3/4 rounded" />
        <div className="skeleton mb-3 h-3 w-1/2 rounded" />
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProductCardEnhanced({ product }: { product: Product }) {
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 300);
  };

  return (
    <div className="group overflow-hidden rounded-[14px] border border-[#2a2a3a] bg-[#12121a] transition-all hover:border-[#ea1d2c]/30 hover:bg-[#1a1a26]">
      {/* Image placeholder */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-[#1a1a26] to-[#12121a]">
        <span className="text-5xl font-bold text-white/5">{product.name.charAt(0)}</span>
        {product.oldPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ea1d2c] px-2 py-0.5 text-xs font-bold text-white">
            {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-white line-clamp-1">{product.name}</h4>
        <p className="mt-0.5 text-sm text-[#9999aa] line-clamp-1">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#ea1d2c]">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-[#9999aa] line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#ea1d2c] text-white transition-all hover:opacity-90 active:scale-90 ${justAdded ? "animate-bounce-add" : ""}`}
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-fade-in">
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a3a] text-white transition-colors hover:border-[#ea1d2c]/50 hover:bg-[#ea1d2c]/10"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
              <button
                onClick={() => increaseQuantity(product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ea1d2c] text-white transition-all hover:opacity-90 active:scale-90"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StoreProducts({ products, categories }: StoreProductsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { items, totalItems, totalPrice } = useCart();
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === null || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, selectedCategory]);

  return (
    <div>
      <div className="mb-6 border-t border-[#2a2a3a]" />

      <h2 className="mb-4 text-xl font-bold text-white">Produtos</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9999aa]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produtos nesta loja..."
          className="w-full rounded-full border border-[#2a2a3a] bg-[#12121a] py-3 pl-11 pr-4 text-white placeholder:text-[#9999aa] focus:border-[#ea1d2c]/50 focus:outline-none"
        />
      </div>

      {/* Category tabs (scrollable) */}
      <div ref={categoryRef} className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-[#ea1d2c] text-white"
              : "border border-[#2a2a3a] text-[#9999aa] hover:border-[#ea1d2c]/30 hover:text-white"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-[#ea1d2c] text-white"
                : "border border-[#2a2a3a] text-[#9999aa] hover:border-[#ea1d2c]/30 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProductCardEnhanced product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-[#9999aa]">Nenhum produto encontrado.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="mt-3 text-sm text-[#00b4d8] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40 md:bottom-6 md:left-auto md:right-6 md:max-w-sm animate-slide-up">
          <Link
            href="/carrinho"
            className="flex items-center justify-between rounded-[50px] bg-[#ea1d2c] px-6 py-4 font-semibold text-white shadow-lg red-glow transition-all hover:opacity-95"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span>
                Ver carrinho · {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
            <span className="font-bold">{formatCurrency(totalPrice)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
