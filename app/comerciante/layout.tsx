import { MerchantProvider } from "@/contexts/MerchantContext";

export default function ComercianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MerchantProvider>
      <div className="-mt-16 -mb-20 md:-mb-0">{children}</div>
    </MerchantProvider>
  );
}
