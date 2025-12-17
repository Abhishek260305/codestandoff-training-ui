"use client";
import { Search, Filter, Shuffle, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import SortDropdown, { SortBy, SortOrder } from "./SortDropdown";

/**
 * ============================================================================
 * QUESTIONS HEADER - REMOTE MFE COMPONENT
 * ============================================================================
 * 
 * Uses design tokens from host via CSS variables.
 * 
 * ❌ FORBIDDEN: Hard-coded colors
 * ✅ REQUIRED: var(--token-name) from design-tokens.css
 * ============================================================================
 */

interface QuestionsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  solvedCount: number;
  totalCount: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

export default function QuestionsHeader({ searchQuery, onSearchChange, solvedCount, totalCount, sortBy, sortOrder, onSortChange }: QuestionsHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between py-4"
      style={{
        borderBottom: '1px solid var(--border-primary)',
        paddingLeft: '1.5rem',
        paddingRight: '1rem',
      }}
    >
      {/* Left side - Search and filters */}
      <div className="flex items-center" style={{ gap: '1rem' }}>
        <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
          <Search 
            className="absolute" 
            style={{ 
              color: 'var(--text-tertiary)',
              width: '16px',
              height: '16px',
              pointerEvents: 'none',
              zIndex: 1,
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }} 
          />
          <Input
            type="text"
            placeholder="Search questions"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 text-sm"
            style={{
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-primary)',
              width: '280px',
              paddingLeft: '2.75rem',
              paddingRight: '0.75rem',
            }}
          />
        </div>
        
        <SortDropdown
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />
        
        <button 
          className="p-2 rounded-md transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Filter className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>

      {/* Right side - Solved counter and shuffle */}
      <div className="flex items-center" style={{ gap: '1.5rem' }}>
        <div 
          className="flex items-center text-sm" 
          style={{ color: 'var(--text-tertiary)', gap: '0.5rem' }}
        >
          <Circle className="w-4 h-4" />
          <span>{solvedCount}/{totalCount} Solved</span>
        </div>
        
        <button 
          className="p-2 rounded-md transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Shuffle className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>
    </div>
  );
}
