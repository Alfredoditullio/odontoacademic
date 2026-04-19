import Link from 'next/link';
import { CommunityTopNav } from '@/components/comunidad/TopNav';
import { CommunitySidebar } from '@/components/comunidad/SidebarCategories';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CommunityTopNav />
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar flush left */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 bg-white">
          <div className="sticky top-20 p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
            <CommunitySidebar />
          </div>
        </aside>
        {/* Main content fills remaining space */}
        <div className="flex-1 min-w-0 bg-slate-50">
          <div className="max-w-2xl px-5 py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
