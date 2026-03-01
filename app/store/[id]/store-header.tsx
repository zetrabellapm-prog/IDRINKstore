"use client";

import { useState } from "react";
import { Star, Clock, ArrowLeft, Heart, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Store } from "@/data/stores";

interface StoreHeaderProps {
  store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="mb-8">
      {/* Back button */}
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#ea1d2c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Marketplace
      </Link>

      {/* Banner */}
      <div className="relative h-52 overflow-hidden rounded-3xl md:h-72">
        <Image
          src={store.banner}
          alt={store.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 active:scale-90"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-[#ea1d2c] text-[#ea1d2c]" : "text-white"
            }`}
          />
        </button>

        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 md:h-20 md:w-20">
              <Image
                src={store.logo}
                alt={`Logo ${store.name}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                {store.name}
              </h1>
              <p className="mt-0.5 text-white/70">{store.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">
                    {store.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-white/80" />
                  <span className="text-sm text-white/90">{store.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 backdrop-blur-sm">
                  <Truck className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-sm text-green-300">
                    {"Frete gratis acima de R$80"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-muted-foreground">{store.description}</p>
    </div>
  );
}
