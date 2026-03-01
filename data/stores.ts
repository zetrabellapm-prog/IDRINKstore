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
    banner: "https://images.unsplash.com/photo-1566995541428-f4e926e4e802?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=200&q=80",
    tagline: "Os melhores vinhos e destilados da cidade",
    description:
      "A Adega Premium oferece uma selecao cuidadosa dos melhores vinhos nacionais e importados, alem de destilados e licores de alta qualidade. Entrega rapida e segura.",
    rating: 4.8,
    deliveryTime: "30-45 min",
    categories: ["Vinhos", "Destilados", "Licores"],
  },
  {
    id: "distribuidora-gelada",
    name: "Distribuidora Gelada",
    banner: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=80",
    tagline: "Cerveja gelada na sua porta",
    description:
      "Especialista em cervejas artesanais e importadas. Todas as bebidas saem geladas do nosso estoque refrigerado para voce aproveitar na hora.",
    rating: 4.6,
    deliveryTime: "20-35 min",
    categories: ["Cervejas", "Energeticos", "Agua e Sucos"],
  },
  {
    id: "drinks-express",
    name: "Drinks Express",
    banner: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&q=80",
    tagline: "Tudo para sua festa em um so lugar",
    description:
      "Drinks Express e a sua distribuidora completa. De cervejas a vodkas, passando por petiscos e acessorios para festas. Entregas rapidas e precos imbativeis.",
    rating: 4.5,
    deliveryTime: "25-40 min",
    categories: ["Cervejas", "Destilados", "Petiscos", "Acessorios"],
  },
  {
    id: "emporio-nobre",
    name: "Emporio Nobre",
    banner: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=200&q=80",
    tagline: "Experiencias exclusivas em cada garrafa",
    description:
      "O Emporio Nobre traz uma experiencia premium de compra, com rotulos selecionados por sommeliers e destilados raros para paladares exigentes.",
    rating: 4.9,
    deliveryTime: "40-60 min",
    categories: ["Vinhos", "Whisky", "Espumantes", "Destilados"],
  },
  {
    id: "cervejaria-hop",
    name: "Cervejaria Hop",
    banner: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&q=80",
    tagline: "Cervejas artesanais direto do produtor",
    description:
      "Somos apaixonados por cerveja artesanal. Trabalhamos com mais de 50 cervejarias parceiras para trazer o melhor do mundo craft ate voce.",
    rating: 4.7,
    deliveryTime: "30-50 min",
    categories: ["Cervejas", "Cervejas Artesanais", "Petiscos"],
  },
  {
    id: "mega-bebidas",
    name: "Mega Bebidas",
    banner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&q=80",
    tagline: "Variedade e preco baixo sempre",
    description:
      "A Mega Bebidas e a maior distribuidora da regiao, com precos competitivos e uma variedade enorme de bebidas para todos os gostos e bolsos.",
    rating: 4.3,
    deliveryTime: "15-30 min",
    categories: ["Cervejas", "Refrigerantes", "Agua e Sucos", "Destilados"],
  },
];

export function getStoreById(id: string): Store | undefined {
  return stores.find((store) => store.id === id);
}

export function getAllCategories(): string[] {
  const allCategories = stores.flatMap((store) => store.categories);
  return [...new Set(allCategories)];
}
