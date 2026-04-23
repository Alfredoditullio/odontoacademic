import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NewsletterPopup } from '@/components/layout/NewsletterPopup';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      <NewsletterPopup />
    </>
  );
}
