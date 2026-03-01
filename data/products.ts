export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export const products: Product[] = [
  // Adega Premium
  {
    id: "ap-001",
    storeId: "adega-premium",
    name: "Vinho Tinto Reserva Especial",
    description: "Cabernet Sauvignon envelhecido 12 meses em carvalho",
    price: 89.9,
    category: "Vinhos",
  },
  {
    id: "ap-002",
    storeId: "adega-premium",
    name: "Vinho Branco Chardonnay",
    description: "Chardonnay seco e fresco com notas frutadas",
    price: 59.9,
    category: "Vinhos",
  },
  {
    id: "ap-003",
    storeId: "adega-premium",
    name: "Whisky Single Malt 12 Anos",
    description: "Single malt escoces com notas de mel e baunilha",
    price: 249.9,
    category: "Destilados",
  },
  {
    id: "ap-004",
    storeId: "adega-premium",
    name: "Licor de Amendoa",
    description: "Licor artesanal feito com amendoas selecionadas",
    price: 45.9,
    category: "Licores",
  },

  // Distribuidora Gelada
  {
    id: "dg-001",
    storeId: "distribuidora-gelada",
    name: "Cerveja Pilsen Premium 350ml",
    description: "Cerveja leve e refrescante, servida gelada",
    price: 5.9,
    category: "Cervejas",
  },
  {
    id: "dg-002",
    storeId: "distribuidora-gelada",
    name: "Cerveja IPA Artesanal 473ml",
    description: "India Pale Ale com lupulo citra e mosaic",
    price: 14.9,
    category: "Cervejas",
  },
  {
    id: "dg-003",
    storeId: "distribuidora-gelada",
    name: "Energetico Power 250ml",
    description: "Bebida energetica com taurina e cafeina",
    price: 8.9,
    category: "Energeticos",
  },
  {
    id: "dg-004",
    storeId: "distribuidora-gelada",
    name: "Agua Mineral 500ml",
    description: "Agua mineral natural sem gas",
    price: 3.5,
    category: "Agua e Sucos",
  },

  // Drinks Express
  {
    id: "de-001",
    storeId: "drinks-express",
    name: "Vodka Premium 750ml",
    description: "Vodka destilada 5 vezes, sabor puro e suave",
    price: 69.9,
    category: "Destilados",
  },
  {
    id: "de-002",
    storeId: "drinks-express",
    name: "Cerveja Lager 269ml Caixa 12un",
    description: "Pack com 12 latas de cerveja lager gelada",
    price: 39.9,
    category: "Cervejas",
  },
  {
    id: "de-003",
    storeId: "drinks-express",
    name: "Amendoim Japones 400g",
    description: "Amendoim crocante com cobertura crocante",
    price: 12.9,
    category: "Petiscos",
  },
  {
    id: "de-004",
    storeId: "drinks-express",
    name: "Kit Copos Long Drink 6un",
    description: "Conjunto com 6 copos de vidro para drinks",
    price: 34.9,
    category: "Acessorios",
  },

  // Emporio Nobre
  {
    id: "en-001",
    storeId: "emporio-nobre",
    name: "Champagne Brut 750ml",
    description: "Espumante frances com borbulhas finas e persistentes",
    price: 320.0,
    category: "Espumantes",
  },
  {
    id: "en-002",
    storeId: "emporio-nobre",
    name: "Whisky Blend 18 Anos",
    description: "Blend premium com notas de frutas secas e caramelo",
    price: 450.0,
    category: "Whisky",
  },
  {
    id: "en-003",
    storeId: "emporio-nobre",
    name: "Vinho Tinto Gran Reserva",
    description: "Malbec argentino 24 meses em barrica de carvalho",
    price: 189.9,
    category: "Vinhos",
  },
  {
    id: "en-004",
    storeId: "emporio-nobre",
    name: "Gin Botanico Premium 750ml",
    description: "Gin artesanal com botanicos selecionados",
    price: 129.9,
    category: "Destilados",
  },

  // Cervejaria Hop
  {
    id: "ch-001",
    storeId: "cervejaria-hop",
    name: "IPA Tropical 473ml",
    description: "IPA com lupulos tropicais, notas de maracuja",
    price: 16.9,
    category: "Cervejas Artesanais",
  },
  {
    id: "ch-002",
    storeId: "cervejaria-hop",
    name: "Stout Coffee 473ml",
    description: "Cerveja escura com cafe especial torrado",
    price: 18.9,
    category: "Cervejas Artesanais",
  },
  {
    id: "ch-003",
    storeId: "cervejaria-hop",
    name: "Pilsen Hop Classica 350ml",
    description: "Pilsen artesanal leve com finalidade refrescante",
    price: 9.9,
    category: "Cervejas",
  },
  {
    id: "ch-004",
    storeId: "cervejaria-hop",
    name: "Tabua de Frios Artesanal",
    description: "Selecao de queijos e embutidos artesanais",
    price: 49.9,
    category: "Petiscos",
  },

  // Mega Bebidas
  {
    id: "mb-001",
    storeId: "mega-bebidas",
    name: "Cerveja Economica 350ml Pack 12un",
    description: "Pack de 12 latas da cerveja mais vendida",
    price: 29.9,
    category: "Cervejas",
  },
  {
    id: "mb-002",
    storeId: "mega-bebidas",
    name: "Refrigerante Cola 2L",
    description: "Refrigerante de cola garrafa familia",
    price: 9.9,
    category: "Refrigerantes",
  },
  {
    id: "mb-003",
    storeId: "mega-bebidas",
    name: "Suco Natural Laranja 1L",
    description: "Suco de laranja 100% natural sem adicao de acucar",
    price: 12.9,
    category: "Agua e Sucos",
  },
  {
    id: "mb-004",
    storeId: "mega-bebidas",
    name: "Cachaca Artesanal 700ml",
    description: "Cachaca mineira envelhecida em tonel de amendoim",
    price: 55.9,
    category: "Destilados",
  },
];

export function getProductsByStore(storeId: string): Product[] {
  return products.filter((product) => product.storeId === storeId);
}

export function getProductCategories(storeId: string): string[] {
  const storeProducts = getProductsByStore(storeId);
  const categories = storeProducts.map((p) => p.category);
  return [...new Set(categories)];
}
