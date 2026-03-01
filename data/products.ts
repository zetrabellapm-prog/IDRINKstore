export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image?: string;
}

export const products: Product[] = [
  // Adega Premium
  { id: "ap-001", storeId: "adega-premium", name: "Vinho Tinto Reserva Especial", description: "Cabernet Sauvignon envelhecido 12 meses em carvalho", price: 89.9, category: "Vinhos" },
  { id: "ap-002", storeId: "adega-premium", name: "Vinho Branco Chardonnay", description: "Chardonnay seco e fresco com notas frutadas", price: 59.9, category: "Vinhos" },
  { id: "ap-003", storeId: "adega-premium", name: "Whisky Single Malt 12 Anos", description: "Single malt escoces com notas de mel e baunilha", price: 249.9, category: "Destilados" },
  { id: "ap-004", storeId: "adega-premium", name: "Licor de Amendoa", description: "Licor artesanal feito com amendoas selecionadas", price: 45.9, category: "Licores" },
  { id: "ap-005", storeId: "adega-premium", name: "Vinho Rose Provence", description: "Rose frances leve e elegante", price: 79.9, category: "Vinhos" },
  { id: "ap-006", storeId: "adega-premium", name: "Gin Tanqueray 750ml", description: "London Dry Gin com botanicos selecionados", price: 119.9, category: "Destilados" },
  { id: "ap-007", storeId: "adega-premium", name: "Espumante Brut 750ml", description: "Espumante nacional metodo charmat", price: 49.9, category: "Vinhos" },
  { id: "ap-008", storeId: "adega-premium", name: "Licor de Cafe", description: "Licor artesanal com cafe especial", price: 39.9, category: "Licores" },
  { id: "ap-009", storeId: "adega-premium", name: "Vinho Malbec Argentino", description: "Malbec encorpado da regiao de Mendoza", price: 69.9, oldPrice: 89.9, category: "Vinhos" },
  { id: "ap-010", storeId: "adega-premium", name: "Rum Premium 750ml", description: "Rum caribenho envelhecido 8 anos", price: 159.9, category: "Destilados" },
  { id: "ap-011", storeId: "adega-premium", name: "Vinho Tinto Merlot", description: "Merlot chileno suave e aveludado", price: 44.9, category: "Vinhos" },
  { id: "ap-012", storeId: "adega-premium", name: "Combo Vinhos Tintos (3 garrafas)", description: "3 vinhos tintos selecionados pelo sommelier", price: 159.9, oldPrice: 199.9, category: "Vinhos" },

  // Distribuidora Gelada
  { id: "dg-001", storeId: "distribuidora-gelada", name: "Heineken Long Neck 330ml", description: "Cerveja premium holandesa puro malte", price: 7.9, category: "Cervejas" },
  { id: "dg-002", storeId: "distribuidora-gelada", name: "Budweiser Pack 12 latas", description: "Pack com 12 latas de 350ml geladas", price: 49.9, oldPrice: 59.9, category: "Cervejas" },
  { id: "dg-003", storeId: "distribuidora-gelada", name: "Red Bull 250ml", description: "Bebida energetica com taurina e cafeina", price: 12.9, category: "Energeticos" },
  { id: "dg-004", storeId: "distribuidora-gelada", name: "Agua Mineral 500ml", description: "Agua mineral natural sem gas", price: 3.5, category: "Agua e Sucos" },
  { id: "dg-005", storeId: "distribuidora-gelada", name: "Corona Extra 330ml", description: "Cerveja mexicana leve e refrescante", price: 9.9, category: "Cervejas" },
  { id: "dg-006", storeId: "distribuidora-gelada", name: "Monster Energy 473ml", description: "Energetico sabor original com taurina", price: 14.9, category: "Energeticos" },
  { id: "dg-007", storeId: "distribuidora-gelada", name: "Skol Beats Senses 269ml", description: "Cerveja com sabor tropical e refrescante", price: 6.9, category: "Cervejas" },
  { id: "dg-008", storeId: "distribuidora-gelada", name: "Suco Natural Laranja 1L", description: "Suco de laranja 100% natural", price: 12.9, category: "Agua e Sucos" },
  { id: "dg-009", storeId: "distribuidora-gelada", name: "Cerveja Stella Artois 275ml", description: "Cerveja belga premium puro malte", price: 8.9, category: "Cervejas" },
  { id: "dg-010", storeId: "distribuidora-gelada", name: "Agua de Coco 330ml", description: "Agua de coco natural gelada", price: 5.9, category: "Agua e Sucos" },
  { id: "dg-011", storeId: "distribuidora-gelada", name: "Pack Heineken 12 Long Necks", description: "12 long necks de 330ml geladas", price: 69.9, oldPrice: 94.8, category: "Cervejas" },
  { id: "dg-012", storeId: "distribuidora-gelada", name: "Energetico Fusion 250ml", description: "Energetico Fusion sabor frutas tropicais", price: 7.9, category: "Energeticos" },

  // Drinks Express
  { id: "de-001", storeId: "drinks-express", name: "Vodka Absolut 750ml", description: "Vodka sueca premium destilada multiplas vezes", price: 79.9, category: "Destilados" },
  { id: "de-002", storeId: "drinks-express", name: "Cerveja Lager 269ml Caixa 12un", description: "Pack com 12 latas de cerveja lager gelada", price: 39.9, category: "Cervejas" },
  { id: "de-003", storeId: "drinks-express", name: "Amendoim Japones 400g", description: "Amendoim crocante com cobertura salgada", price: 12.9, category: "Petiscos" },
  { id: "de-004", storeId: "drinks-express", name: "Kit Copos Long Drink 6un", description: "Conjunto com 6 copos de vidro para drinks", price: 34.9, category: "Acessorios" },
  { id: "de-005", storeId: "drinks-express", name: "Jack Daniel's 1L", description: "Whiskey americano Tennessee No.7", price: 189.9, category: "Destilados" },
  { id: "de-006", storeId: "drinks-express", name: "Combo Festa (24 Heineken + 2 Absolut)", description: "Combo completo para sua festa", price: 289.9, oldPrice: 350.0, category: "Cervejas" },
  { id: "de-007", storeId: "drinks-express", name: "Refrigerante Coca-Cola 2L", description: "Refrigerante de cola garrafa familia", price: 12.9, category: "Petiscos" },
  { id: "de-008", storeId: "drinks-express", name: "Gin Beefeater 750ml", description: "London Dry Gin classico ingles", price: 89.9, category: "Destilados" },
  { id: "de-009", storeId: "drinks-express", name: "Gelo Filtrado 5kg", description: "Gelo em cubos filtrado para drinks", price: 9.9, category: "Acessorios" },
  { id: "de-010", storeId: "drinks-express", name: "Batata Chips 200g", description: "Batata chips crocante sabor original", price: 14.9, category: "Petiscos" },
  { id: "de-011", storeId: "drinks-express", name: "Tonica Schweppes 350ml 6un", description: "Agua tonica premium para gin tonicas", price: 24.9, category: "Acessorios" },
  { id: "de-012", storeId: "drinks-express", name: "Whisky Red Label 1L", description: "Blended Scotch Whisky classico", price: 99.9, oldPrice: 119.9, category: "Destilados" },

  // Emporio Nobre
  { id: "en-001", storeId: "emporio-nobre", name: "Champagne Brut 750ml", description: "Espumante frances com borbulhas finas e persistentes", price: 320.0, category: "Espumantes" },
  { id: "en-002", storeId: "emporio-nobre", name: "Whisky Blend 18 Anos", description: "Blend premium com notas de frutas secas e caramelo", price: 450.0, category: "Whisky" },
  { id: "en-003", storeId: "emporio-nobre", name: "Vinho Tinto Gran Reserva", description: "Malbec argentino 24 meses em barrica de carvalho", price: 189.9, category: "Vinhos" },
  { id: "en-004", storeId: "emporio-nobre", name: "Gin Botanico Premium 750ml", description: "Gin artesanal com botanicos selecionados", price: 129.9, category: "Destilados" },
  { id: "en-005", storeId: "emporio-nobre", name: "Prosecco Italiano 750ml", description: "Espumante italiano fresco e elegante", price: 89.9, category: "Espumantes" },
  { id: "en-006", storeId: "emporio-nobre", name: "Whisky Single Malt 21 Anos", description: "Single malt raro com notas complexas", price: 890.0, category: "Whisky" },
  { id: "en-007", storeId: "emporio-nobre", name: "Vinho Bordeaux 2015", description: "Safra excepcional de Bordeaux, Cabernet Franc", price: 289.9, category: "Vinhos" },
  { id: "en-008", storeId: "emporio-nobre", name: "Cognac VSOP 700ml", description: "Cognac frances envelhecido 10 anos", price: 390.0, category: "Destilados" },
  { id: "en-009", storeId: "emporio-nobre", name: "Espumante Rose Brut", description: "Espumante rose premium com frescor", price: 149.9, category: "Espumantes" },
  { id: "en-010", storeId: "emporio-nobre", name: "Whisky Japonês 700ml", description: "Blended whisky japones premiado", price: 590.0, oldPrice: 690.0, category: "Whisky" },
  { id: "en-011", storeId: "emporio-nobre", name: "Vinho do Porto Tawny 10 Anos", description: "Vinho do Porto envelhecido em barrica", price: 159.9, category: "Vinhos" },
  { id: "en-012", storeId: "emporio-nobre", name: "Kit Degustacao Premium", description: "4 minigarrafas de single malts selecionados", price: 249.9, oldPrice: 320.0, category: "Whisky" },

  // Cervejaria Hop
  { id: "ch-001", storeId: "cervejaria-hop", name: "IPA Tropical 473ml", description: "IPA com lupulos tropicais, notas de maracuja", price: 16.9, category: "Cervejas Artesanais" },
  { id: "ch-002", storeId: "cervejaria-hop", name: "Stout Coffee 473ml", description: "Cerveja escura com cafe especial torrado", price: 18.9, category: "Cervejas Artesanais" },
  { id: "ch-003", storeId: "cervejaria-hop", name: "Pilsen Hop Classica 350ml", description: "Pilsen artesanal leve com finalidade refrescante", price: 9.9, category: "Cervejas" },
  { id: "ch-004", storeId: "cervejaria-hop", name: "Tabua de Frios Artesanal", description: "Selecao de queijos e embutidos artesanais", price: 49.9, category: "Petiscos" },
  { id: "ch-005", storeId: "cervejaria-hop", name: "Weizen 473ml", description: "Cerveja de trigo nao filtrada, leve e frutada", price: 15.9, category: "Cervejas Artesanais" },
  { id: "ch-006", storeId: "cervejaria-hop", name: "Double IPA 473ml", description: "IPA dupla com alto teor de lupulo", price: 22.9, category: "Cervejas Artesanais" },
  { id: "ch-007", storeId: "cervejaria-hop", name: "Sour Frutas Vermelhas 355ml", description: "Cerveja acida com frutas vermelhas", price: 19.9, category: "Cervejas Artesanais" },
  { id: "ch-008", storeId: "cervejaria-hop", name: "Session IPA 350ml", description: "IPA leve e refrescante para sessoes", price: 12.9, category: "Cervejas Artesanais" },
  { id: "ch-009", storeId: "cervejaria-hop", name: "Red Ale 473ml", description: "Ale avermelhada com notas de caramelo", price: 16.9, category: "Cervejas Artesanais" },
  { id: "ch-010", storeId: "cervejaria-hop", name: "Porter Chocolate 473ml", description: "Porter escura com cacau e baunilha", price: 20.9, category: "Cervejas Artesanais" },
  { id: "ch-011", storeId: "cervejaria-hop", name: "Mix Petiscos Artesanais", description: "Mix de nuts, chips e queijo curado", price: 34.9, category: "Petiscos" },
  { id: "ch-012", storeId: "cervejaria-hop", name: "Pack Degustacao 4 Cervejas", description: "4 cervejas artesanais sortidas", price: 59.9, oldPrice: 74.9, category: "Cervejas Artesanais" },

  // Mega Bebidas
  { id: "mb-001", storeId: "mega-bebidas", name: "Cerveja Economica 350ml Pack 12un", description: "Pack de 12 latas da cerveja mais vendida", price: 29.9, category: "Cervejas" },
  { id: "mb-002", storeId: "mega-bebidas", name: "Refrigerante Cola 2L", description: "Refrigerante de cola garrafa familia", price: 9.9, category: "Refrigerantes" },
  { id: "mb-003", storeId: "mega-bebidas", name: "Suco Natural Laranja 1L", description: "Suco de laranja 100% natural sem adicao de acucar", price: 12.9, category: "Agua e Sucos" },
  { id: "mb-004", storeId: "mega-bebidas", name: "Cachaca Artesanal 700ml", description: "Cachaca mineira envelhecida em tonel de amendoim", price: 55.9, category: "Destilados" },
  { id: "mb-005", storeId: "mega-bebidas", name: "Cerveja Brahma 350ml 18un", description: "Pack com 18 latas de cerveja gelada", price: 44.9, oldPrice: 54.9, category: "Cervejas" },
  { id: "mb-006", storeId: "mega-bebidas", name: "Guarana Antarctica 2L", description: "Refrigerante de guarana garrafa familia", price: 8.9, category: "Refrigerantes" },
  { id: "mb-007", storeId: "mega-bebidas", name: "Agua Mineral Galao 5L", description: "Galao de agua mineral sem gas", price: 7.9, category: "Agua e Sucos" },
  { id: "mb-008", storeId: "mega-bebidas", name: "Vodka Nacional 1L", description: "Vodka brasileira destilada 3 vezes", price: 29.9, category: "Destilados" },
  { id: "mb-009", storeId: "mega-bebidas", name: "Refrigerante Laranja 2L", description: "Refrigerante sabor laranja garrafa familia", price: 7.9, category: "Refrigerantes" },
  { id: "mb-010", storeId: "mega-bebidas", name: "Cerveja Skol 350ml 12un", description: "Pack com 12 latas de cerveja leve", price: 27.9, category: "Cervejas" },
  { id: "mb-011", storeId: "mega-bebidas", name: "Suco de Uva Integral 1L", description: "Suco de uva integral sem conservantes", price: 14.9, category: "Agua e Sucos" },
  { id: "mb-012", storeId: "mega-bebidas", name: "Combo Churrasco (24 cervejas + gelo)", description: "Pack completo para churrasco", price: 79.9, oldPrice: 99.9, category: "Cervejas" },
];

export function getProductsByStore(storeId: string): Product[] {
  return products.filter((product) => product.storeId === storeId);
}

export function getProductCategories(storeId: string): string[] {
  const storeProducts = getProductsByStore(storeId);
  const categories = storeProducts.map((p) => p.category);
  return [...new Set(categories)];
}
