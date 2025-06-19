'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
}

interface EngineSidebarProps {
  navigation: NavigationItem[];
  basePath: string;
  engineTitle: string;
}

export function EngineSidebar({ navigation, basePath, engineTitle }: EngineSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{engineTitle}</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const fullHref = `${basePath}${item.href}`;
            const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
            
            return (
              <li key={item.href}>
                <Link
                  href={fullHref}
                  className={cn(
                    "block px-4 py-2 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 