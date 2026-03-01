export interface Store {
  id: string;
  name: string;
  banner: string;
  logo: string;
  tagline: string;
  description: string;
  rating: number;
  deliveryTime: string;
  categories: string[];
}

export const stores: Store[] = [
  {
    id: "adega-premium",
    name: "Adega Premium",
    banner: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=100&h=100&fit=crop",
    tagline: "Os melhores vinhos e destilados",
    description:
      "A Adega Premium oferece uma selecao curada dos melhores vinhos nacionais e importados, destilados premium e acessorios para apreciadores.",
    rating: 4.8,
    deliveryTime: "30-45 min",
    categories: ["Vinhos", "Destilados", "Espumantes"],
  },
  {
    id: "cervejaria-artesanal",
    name: "Cervejaria Artesanal",
    banner: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop",
    tagline: "Cervejas artesanais selecionadas",
    description:
      "Descubra cervejas artesanais das melhores cervejarias do Brasil e do mundo. IPAs, Stouts, Lagers e muito mais.",
    rating: 4.7,
    deliveryTime: "25-40 min",
    categories: ["Cervejas Artesanais", "Cervejas Importadas", "Kits"],
  },
  {
    id: "distribuidora-gelogelado",
    name: "Distribuidora GeloGelado",
    banner: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=100&h=100&fit=crop",
    tagline: "Bebidas geladas na sua porta",
    description:
      "A maior variedade de bebidas geladas com entrega rapida. Cervejas, refrigerantes, sucos, agua e gelo.",
    rating: 4.5,
    deliveryTime: "20-35 min",
    categories: ["Cervejas", "Refrigerantes", "Sucos", "Agua"],
  },
  {
    id: "emporio-drinks",
    name: "Emporio Drinks",
    banner: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=100&h=100&fit=crop",
    tagline: "Tudo para o seu drink perfeito",
    description:
      "Especializados em insumos para drinks e coqueteis. Encontre destilados, mixers, xaropes, frutas e acessorios de bartender.",
    rating: 4.9,
    deliveryTime: "35-50 min",
    categories: ["Destilados", "Mixers", "Acessorios"],
  },
  {
    id: "whisky-house",
    name: "Whisky House",
    banner: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1602081115068-1d4db03e5ca0?w=100&h=100&fit=crop",
    tagline: "O mundo do whisky em suas maos",
    description:
      "Colecao exclusiva de whiskies escoceses, americanos, japoneses e irlandeses. Single malts, blends e edicoes limitadas.",
    rating: 4.6,
    deliveryTime: "40-55 min",
    categories: ["Whisky", "Destilados", "Edicoes Especiais"],
  },
  {
    id: "tropical-sucos",
    name: "Tropical Sucos",
    banner: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100&h=100&fit=crop",
    tagline: "Sucos naturais e bebidas saudaveis",
    description:
      "Sucos naturais, smoothies, aguas aromatizadas e bebidas funcionais para quem busca uma opcao mais saudavel.",
    rating: 4.4,
    deliveryTime: "15-25 min",
    categories: ["Sucos", "Smoothies", "Aguas", "Funcionais"],
  },
];

export function getStoreById(id: string): Store | undefined {
  return stores.find((store) => store.id === id);
}

export function getAllCategories(): string[] {
  const categorySet = new Set<string>();
  stores.forEach((store) => {
    store.categories.forEach((cat) => categorySet.add(cat));
  });
  return Array.from(categorySet).sort();
}
