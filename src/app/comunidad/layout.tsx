import { CommunityTopNav } from '@/components/comunidad/TopNav';
import { CommunitySidebar } from '@/components/comunidad/SidebarCategories';
import { CommunitySidebarRight } from '@/components/comunidad/SidebarRight';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CommunityTopNav />
      <div className="flex min-h-[calc(100vh-80px)]">

        {/* ── Left nav ── */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-slate-200 bg-white">
          <div className="sticky top-20 flex flex-col h-[calc(100vh-80px)]">
            <CommunitySidebar />
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 bg-slate-50 px-5 py-6">
          {children}
        </div>

        {/* ── Right sidebar ── */}
        <CommunitySidebarRight />

      </div>
    </>
  );
}
