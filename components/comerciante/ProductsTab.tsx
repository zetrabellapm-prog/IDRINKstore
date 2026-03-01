"use client";

import { useState, useRef } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Star,
  X,
} from "lucide-react";
import { useMerchant, type MerchantProduct } from "@/contexts/MerchantContext";

const categories = [
  "Cerveja",
  "Vodka",
  "Whisky",
  "Gin",
  "Energetico",
  "Refrigerante",
  "Agua",
  "Outros",
];

const emptyProduct: Omit<MerchantProduct, "id"> = {
  name: "",
  category: "Cerveja",
  description: "",
  price: 0,
  stock: 0,
  featured: false,
  image: null,
};

export function ProductsTab() {
  const { state, dispatch, toast } = useMerchant();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast("Informe o nome do produto", "error");
      return;
    }
    if (form.price <= 0) {
      toast("Informe um preco valido", "error");
      return;
    }

    if (editingId) {
      dispatch({
        type: "UPDATE_PRODUCT",
        payload: { ...form, id: editingId },
      });
      toast("Produto atualizado!", "success");
    } else {
      dispatch({
        type: "ADD_PRODUCT",
        payload: { ...form, id: `PROD-${Date.now()}` },
      });
      toast("Produto cadastrado!", "success");
    }

    resetForm();
  }

  function handleEdit(product: MerchantProduct) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      featured: product.featured,
      image: product.image,
    });
    setImagePreview(product.image);
    setShowForm(true);
  }

  function handleRemove(id: string) {
    dispatch({ type: "REMOVE_PRODUCT", payload: id });
    toast("Produto removido", "info");
  }

  function resetForm() {
    setForm(emptyProduct);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-sm text-[#9999aa]">
            Gerencie o catalogo da sua loja
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 rounded-full bg-[#e63946] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#d12f3c]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Fechar" : "Novo Produto"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
          <h3 className="mb-4 text-sm font-semibold text-white">
            {editingId ? "Editar Produto" : "Cadastrar Produto"}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Foto do Produto
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#2a2a3a] bg-[#0a0a0f] transition-all hover:border-[#e63946]/50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-[#9999aa]" />
                    <span className="text-xs text-[#9999aa]">
                      Clique para enviar imagem
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Nome do Produto
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                placeholder="Nome do produto"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Descricao curta
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                placeholder="Breve descricao do produto"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Preco (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))
                }
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
                Estoque
              </label>
              <input
                type="number"
                value={form.stock || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    stock: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 md:col-span-2">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                className={`relative h-6 w-11 rounded-full transition-all ${
                  form.featured ? "bg-[#e63946]" : "bg-[#2a2a3a]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    form.featured ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm text-[#9999aa]">
                Em destaque {form.featured && <Star className="inline h-3.5 w-3.5 text-yellow-400" />}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 w-full rounded-full bg-[#e63946] py-3 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c]"
          >
            {editingId ? "Atualizar Produto" : "Salvar Produto"}
          </button>
        </div>
      )}

      {/* Products Grid */}
      {state.products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2a2a3a] bg-[#12121a] py-12">
          <Package className="h-10 w-10 text-[#2a2a3a]" />
          <p className="text-sm text-[#9999aa]">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] overflow-hidden transition-all hover:border-[#2a2a3a]/80"
            >
              {/* Product image */}
              <div className="flex h-40 items-center justify-center bg-[#0a0a0f]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-12 w-12 text-[#2a2a3a]" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {product.name}
                    </h4>
                    <span className="text-xs text-[#9999aa]">
                      {product.category}
                    </span>
                  </div>
                  {product.featured && (
                    <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="mt-1 text-xs text-[#9999aa]">
                  {product.description || "Sem descricao"}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-white">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <span className="rounded-lg bg-[#0a0a0f] px-2 py-1 text-xs text-[#9999aa]">
                    Estoque: {product.stock}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#00b4d8]/10 py-2 text-xs font-medium text-[#00b4d8] transition-all hover:bg-[#00b4d8]/20"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e63946]/10 py-2 text-xs font-medium text-[#e63946] transition-all hover:bg-[#e63946]/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
