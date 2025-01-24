'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FaSun className="w-6 h-6 text-yellow-500" />
      ) : (
        <FaMoon className="w-6 h-6 text-gray-800" />
      )}
    </button>
  );
}
