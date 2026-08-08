'use client';

import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = 'Search products, brands and more...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onSearch) onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full rounded-full border bg-slate-50/50 hover:bg-slate-50 transition-all focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 focus-within:ring-offset-1 focus-within:border-transparent ${className}`}
      style={{
        borderColor: theme.borderColor,
      }}
      role="search"
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full pl-5 pr-12 py-2 text-sm bg-transparent rounded-full outline-none text-slate-800 placeholder-slate-400"
      />
      <div className="absolute right-2.5 flex items-center gap-1">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="p-1 hover:bg-slate-200/60 rounded-full transition-colors text-slate-400 hover:text-slate-600 outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="p-1.5 rounded-full transition-all text-white flex items-center justify-center outline-none hover:brightness-95 active:scale-95"
          style={{
            backgroundColor: theme.primaryColor,
          }}
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
export default SearchBox;

