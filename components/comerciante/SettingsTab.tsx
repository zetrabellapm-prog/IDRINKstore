"use client";

import { useState, useRef } from "react";
import {
  Store,
  Clock,
  MapPin,
  ImagePlus,
  QrCode,
  User,
  Mail,
  Phone,
  Save,
  Loader2,
} from "lucide-react";
import { useMerchant } from "@/contexts/MerchantContext";

const pixKeyTypes = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatoria" },
];

export function SettingsTab() {
  const { state, dispatch, toast } = useMerchant();
  const profile = state.profile;

  // Store info
  const [storeName, setStoreName] = useState(profile?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    profile?.storeDescription || ""
  );
  const [openTime, setOpenTime] = useState(profile?.openTime || "08:00");
  const [closeTime, setCloseTime] = useState(profile?.closeTime || "22:00");
  const [deliveryTime, setDeliveryTime] = useState(
    profile?.deliveryTime || "30-45 min"
  );
  const [deliveryRadius, setDeliveryRadius] = useState(
    profile?.deliveryRadius || 5
  );

  // Image uploads
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    profile?.storeBanner || null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    profile?.storeLogo || null
  );
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  // Pix
  const [pixKeyType, setPixKeyType] = useState(profile?.pixKeyType || "cpf");
  const [pixKey, setPixKey] = useState(profile?.pixKey || "");
  const [pixSaved, setPixSaved] = useState(!!profile?.pixKey);

  // Loading states
  const [savingStore, setSavingStore] = useState(false);
  const [savingPix, setSavingPix] = useState(false);

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "banner") setBannerPreview(result);
      else setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  }

  function saveStoreInfo() {
    setSavingStore(true);
    setTimeout(() => {
      dispatch({
        type: "UPDATE_PROFILE",
        payload: {
          storeName,
          storeDescription,
          storeBanner: bannerPreview,
          storeLogo: logoPreview,
          openTime,
          closeTime,
          deliveryTime,
          deliveryRadius,
        },
      });
      toast("Informacoes da loja atualizadas!", "success");
      setSavingStore(false);
    }, 800);
  }

  function savePixKey() {
    if (!pixKey.trim()) {
      toast("Informe a chave Pix", "error");
      return;
    }
    setSavingPix(true);
    setTimeout(() => {
      dispatch({
        type: "UPDATE_PROFILE",
        payload: { pixKeyType, pixKey },
      });
      setPixSaved(true);
      toast("Chave Pix salva com sucesso!", "success");
      setSavingPix(false);
    }, 800);
  }

  const qrCodeUrl = pixSaved && pixKey
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}&bgcolor=12121a&color=ffffff`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuracoes da Loja</h1>
        <p className="text-sm text-[#9999aa]">
          Personalize e gerencie sua loja
        </p>
      </div>

      {/* ── Store Info ── */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Store className="h-5 w-5 text-[#e63946]" />
          <h2 className="text-sm font-semibold text-white">
            Informacoes da Loja
          </h2>
        </div>

        <div className="space-y-4">
          {/* Banner */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Foto de Capa
            </label>
            <div
              onClick={() => bannerRef.current?.click()}
              className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#2a2a3a] bg-[#0a0a0f] transition-all hover:border-[#e63946]/50"
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus className="h-6 w-6 text-[#9999aa]" />
                  <span className="text-xs text-[#9999aa]">Enviar capa</span>
                </div>
              )}
            </div>
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "banner")}
              className="hidden"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Logo da Loja
            </label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => logoRef.current?.click()}
                className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#2a2a3a] bg-[#0a0a0f] transition-all hover:border-[#e63946]/50"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-[#9999aa]" />
                )}
              </div>
              <span className="text-xs text-[#9999aa]">
                Clique para enviar o logo da loja
              </span>
            </div>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logo")}
              className="hidden"
            />
          </div>

          {/* Store Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Nome da Loja
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Descricao da Loja
            </label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
              placeholder="Descreva sua loja..."
            />
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#9999aa]">
                <Clock className="h-3.5 w-3.5" /> Abertura
              </label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#9999aa]">
                <Clock className="h-3.5 w-3.5" /> Fechamento
              </label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery time */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Tempo estimado de entrega
            </label>
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
              placeholder="Ex: 30-45 min"
            />
          </div>

          {/* Delivery radius */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#9999aa]">
              <MapPin className="h-3.5 w-3.5" /> Raio de Entrega:{" "}
              <span className="text-white">{deliveryRadius} km</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
              className="w-full accent-[#e63946]"
            />
            <div className="flex justify-between text-[10px] text-[#9999aa]">
              <span>1 km</span>
              <span>30 km</span>
            </div>
          </div>

          <button
            onClick={saveStoreInfo}
            disabled={savingStore}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e63946] py-3 text-sm font-semibold text-white transition-all hover:bg-[#d12f3c] disabled:opacity-60"
          >
            {savingStore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Informacoes da Loja
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Pix Key ── */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <div className="mb-4 flex items-center gap-2">
          <QrCode className="h-5 w-5 text-[#00b4d8]" />
          <h2 className="text-sm font-semibold text-white">
            Pagamento — Chave Pix
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Tipo de Chave
            </label>
            <select
              value={pixKeyType}
              onChange={(e) => {
                setPixKeyType(e.target.value);
                setPixSaved(false);
              }}
              className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white focus:border-[#e63946] focus:outline-none"
            >
              {pixKeyTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#9999aa]">
              Chave Pix
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => {
                setPixKey(e.target.value);
                setPixSaved(false);
              }}
              className="w-full rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#e63946] focus:outline-none"
              placeholder="Insira sua chave Pix"
            />
          </div>

          <button
            onClick={savePixKey}
            disabled={savingPix}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00b4d8] py-3 text-sm font-semibold text-white transition-all hover:bg-[#00a3c4] disabled:opacity-60"
          >
            {savingPix ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Chave Pix
              </>
            )}
          </button>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-[#2a2a3a] bg-[#0a0a0f] p-6">
              <p className="text-xs font-medium text-[#9999aa]">
                QR Code da sua Chave Pix
              </p>
              <div className="rounded-xl bg-white p-3">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Pix"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px]"
                />
              </div>
              <p className="text-xs text-[#00b4d8]">{pixKey}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Owner Data (readonly) ── */}
      <div className="rounded-2xl border border-[#2a2a3a] bg-[#12121a] p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-[#9999aa]" />
          <h2 className="text-sm font-semibold text-white">
            Dados do Responsavel
          </h2>
          <span className="rounded-full bg-[#2a2a3a] px-2 py-0.5 text-[10px] text-[#9999aa]">
            Somente leitura
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0f] p-3">
            <User className="h-4 w-4 text-[#9999aa]" />
            <div>
              <p className="text-[10px] text-[#9999aa]">Nome</p>
              <p className="text-sm text-white">{profile?.ownerName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0f] p-3">
            <Mail className="h-4 w-4 text-[#9999aa]" />
            <div>
              <p className="text-[10px] text-[#9999aa]">E-mail</p>
              <p className="text-sm text-white">{profile?.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0f] p-3">
            <Phone className="h-4 w-4 text-[#9999aa]" />
            <div>
              <p className="text-[10px] text-[#9999aa]">Telefone</p>
              <p className="text-sm text-white">{profile?.phone || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#0a0a0f] p-3">
            <User className="h-4 w-4 text-[#9999aa]" />
            <div>
              <p className="text-[10px] text-[#9999aa]">
                {profile?.docType?.toUpperCase() || "Documento"}
              </p>
              <p className="text-sm text-white">{profile?.doc || "—"}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-[#9999aa]">
          Para alterar dados pessoais, entre em contato com o suporte iDrink.
        </p>
      </div>
    </div>
  );
}
