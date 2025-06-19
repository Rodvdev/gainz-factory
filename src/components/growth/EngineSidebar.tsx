'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{engineTitle}</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white dark:bg-gray-800 shadow-lg",
        // Desktop styles
        "lg:w-64 lg:flex-shrink-0",
        // Mobile styles
        "lg:static lg:translate-x-0",
        isMobileMenuOpen
          ? "fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0"
          : "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full"
      )}>
        {/* Desktop Header */}
        <div className="hidden lg:block p-4 sm:p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{engineTitle}</h2>
        </div>
        
        <nav className="p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {navigation.map((item) => {
              const fullHref = `${basePath}${item.href}`;
              const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
              
              return (
                <li key={item.href}>
                  <Link
                    href={fullHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
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
    </>
  );
} 