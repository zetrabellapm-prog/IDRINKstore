export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  storeId: string;
}

export const products: Product[] = [
  // Adega Premium
  {
    id: "ap-001",
    name: "Vinho Tinto Reserva",
    description: "Vinho tinto seco reserva especial, 750ml",
    price: 89.9,
    category: "Vinhos",
    storeId: "adega-premium",
  },
  {
    id: "ap-002",
    name: "Espumante Brut Rose",
    description: "Espumante brut rose metodo charmat, 750ml",
    price: 65.0,
    category: "Espumantes",
    storeId: "adega-premium",
  },
  {
    id: "ap-003",
    name: "Gin London Dry",
    description: "Gin premium botanico, 700ml",
    price: 120.0,
    category: "Destilados",
    storeId: "adega-premium",
  },
  {
    id: "ap-004",
    name: "Vinho Branco Chardonnay",
    description: "Chardonnay elegante e refrescante, 750ml",
    price: 72.5,
    category: "Vinhos",
    storeId: "adega-premium",
  },

  // Cervejaria Artesanal
  {
    id: "ca-001",
    name: "IPA Tropical",
    description: "India Pale Ale com notas tropicais, 473ml",
    price: 18.9,
    category: "Cervejas Artesanais",
    storeId: "cervejaria-artesanal",
  },
  {
    id: "ca-002",
    name: "Stout Imperial",
    description: "Stout encorpada com notas de chocolate, 500ml",
    price: 24.5,
    category: "Cervejas Artesanais",
    storeId: "cervejaria-artesanal",
  },
  {
    id: "ca-003",
    name: "Pilsen Alema Importada",
    description: "Pilsen classica importada da Alemanha, 500ml",
    price: 15.9,
    category: "Cervejas Importadas",
    storeId: "cervejaria-artesanal",
  },
  {
    id: "ca-004",
    name: "Kit Degustacao 4 Cervejas",
    description: "Kit com 4 cervejas artesanais selecionadas",
    price: 69.9,
    category: "Kits",
    storeId: "cervejaria-artesanal",
  },

  // Distribuidora GeloGelado
  {
    id: "gg-001",
    name: "Cerveja Lager 350ml (Pack 12)",
    description: "Pack com 12 latas de cerveja lager gelada",
    price: 42.0,
    category: "Cervejas",
    storeId: "distribuidora-gelogelado",
  },
  {
    id: "gg-002",
    name: "Refrigerante Cola 2L",
    description: "Refrigerante cola gelado, 2 litros",
    price: 9.9,
    category: "Refrigerantes",
    storeId: "distribuidora-gelogelado",
  },
  {
    id: "gg-003",
    name: "Suco de Laranja Natural 1L",
    description: "Suco de laranja 100% natural, 1 litro",
    price: 12.5,
    category: "Sucos",
    storeId: "distribuidora-gelogelado",
  },
  {
    id: "gg-004",
    name: "Agua Mineral 500ml (Pack 12)",
    description: "Pack com 12 garrafas de agua mineral",
    price: 15.0,
    category: "Agua",
    storeId: "distribuidora-gelogelado",
  },

  // Emporio Drinks
  {
    id: "ed-001",
    name: "Vodka Premium 1L",
    description: "Vodka premium destilada 5 vezes, 1 litro",
    price: 95.0,
    category: "Destilados",
    storeId: "emporio-drinks",
  },
  {
    id: "ed-002",
    name: "Agua Tonica Artesanal (Pack 6)",
    description: "Pack com 6 aguas tonicas artesanais, 250ml cada",
    price: 35.0,
    category: "Mixers",
    storeId: "emporio-drinks",
  },
  {
    id: "ed-003",
    name: "Xarope de Maracuja",
    description: "Xarope artesanal de maracuja para drinks, 500ml",
    price: 28.0,
    category: "Mixers",
    storeId: "emporio-drinks",
  },
  {
    id: "ed-004",
    name: "Kit Coqueteleira Profissional",
    description: "Kit com coqueteleira, dosador, colher e filtro",
    price: 149.9,
    category: "Acessorios",
    storeId: "emporio-drinks",
  },

  // Whisky House
  {
    id: "wh-001",
    name: "Single Malt 12 Anos",
    description: "Whisky single malt escoces 12 anos, 700ml",
    price: 280.0,
    category: "Whisky",
    storeId: "whisky-house",
  },
  {
    id: "wh-002",
    name: "Bourbon Americano",
    description: "Bourbon classico do Kentucky, 750ml",
    price: 160.0,
    category: "Whisky",
    storeId: "whisky-house",
  },
  {
    id: "wh-003",
    name: "Whisky Japones Harmony",
    description: "Blend japones premiado, 700ml",
    price: 350.0,
    category: "Whisky",
    storeId: "whisky-house",
  },
  {
    id: "wh-004",
    name: "Edicao Limitada Cask Strength",
    description: "Whisky cask strength edicao limitada, 700ml",
    price: 520.0,
    category: "Edicoes Especiais",
    storeId: "whisky-house",
  },

  // Tropical Sucos
  {
    id: "ts-001",
    name: "Suco Verde Detox",
    description: "Suco verde com couve, gengibre e limao, 500ml",
    price: 14.9,
    category: "Sucos",
    storeId: "tropical-sucos",
  },
  {
    id: "ts-002",
    name: "Smoothie de Acai",
    description: "Smoothie cremoso de acai com banana, 400ml",
    price: 19.9,
    category: "Smoothies",
    storeId: "tropical-sucos",
  },
  {
    id: "ts-003",
    name: "Agua Aromatizada Limao e Hortela",
    description: "Agua aromatizada natural, 1 litro",
    price: 8.5,
    category: "Aguas",
    storeId: "tropical-sucos",
  },
  {
    id: "ts-004",
    name: "Shot de Gengibre com Curcuma",
    description: "Shot funcional energizante, 60ml",
    price: 7.9,
    category: "Funcionais",
    storeId: "tropical-sucos",
  },
];

export function getProductsByStore(storeId: string): Product[] {
  return products.filter((product) => product.storeId === storeId);
}

export function getProductCategories(storeId: string): string[] {
  const storeProducts = getProductsByStore(storeId);
  const categorySet = new Set<string>();
  storeProducts.forEach((product) => categorySet.add(product.category));
  return Array.from(categorySet).sort();
}
