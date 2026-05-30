import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/layout/ChatWidget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <main className="fade-in flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
