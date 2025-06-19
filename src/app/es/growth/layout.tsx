import { ReactNode } from 'react';
import { EngineSidebar } from '@/components/growth/EngineSidebar';

const growthNav = [
  {
    title: "Dashboard",
    href: "/es/growth/habit",
  },
  {
    title: "Nuevo Hábito",
    href: "/es/growth/habit/new",
  },
  {
    title: "Analytics",
    href: "/es/growth/habit/analytics",
  },
  {
    title: "Calendario",
    href: "/es/growth/habit/calendar",
  },
  {
    title: "Desafíos",
    href: "/es/growth/habit/challenges",
  },
  {
    title: "Log Rápido",
    href: "/es/growth/habit/quick-log",
  },
];

interface GrowthLayoutProps {
  children: ReactNode;
}

export default function GrowthLayout({ children }: GrowthLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <EngineSidebar 
        navigation={growthNav}
        basePath=""
        engineTitle="Growth Engine"
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 