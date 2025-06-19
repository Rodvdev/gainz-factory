import { ReactNode } from 'react';
import { EngineSidebar } from '@/components/growth/EngineSidebar';
import { growthNav } from './navigation';

interface GrowthLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
    tenantSlug: string;
  };
}

export default function GrowthLayout({ children, params }: GrowthLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <EngineSidebar 
        navigation={growthNav}
        basePath={`/${params.locale}/${params.tenantSlug}`}
        engineTitle="Growth Engine"
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 