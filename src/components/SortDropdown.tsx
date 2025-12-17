"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, ListOrdered } from "lucide-react";

export type SortBy = "id" | "difficulty";
export type SortOrder = "ASC" | "DESC";

interface SortDropdownProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

export default function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "id", label: "Question Number" },
    { value: "difficulty", label: "Difficulty" },
  ];

  const handleSortOptionClick = (option: SortBy) => {
    if (option === sortBy) {
      // Toggle order if same option clicked
      onSortChange(option, sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      // Set new option with default ASC order
      onSortChange(option, "ASC");
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md transition-colors flex items-center gap-1.5"
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <ListOrdered className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        {sortOrder === "ASC" ? (
          <ArrowUp className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
        ) : (
          <ArrowDown className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded-md shadow-lg z-50"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            minWidth: '180px',
          }}
        >
          {sortOptions.map((option) => {
            const isSelected = option.value === sortBy;
            return (
              <div
                key={option.value}
                className="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors rounded-sm"
                style={{
                  backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                  margin: '0.125rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => {
                  handleSortOptionClick(option.value);
                  setIsOpen(false);
                }}
              >
                <span 
                  className="text-sm" 
                  style={{ 
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? '500' : '400',
                  }}
                >
                  {option.label}
                </span>
                <div className="flex items-center gap-1">
                  {isSelected ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSortChange(option.value, sortOrder === "ASC" ? "DESC" : "ASC");
                      }}
                      className="p-1 rounded transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-active)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title={`Toggle sort order: ${sortOrder === "ASC" ? "Descending" : "Ascending"}`}
                    >
                      {sortOrder === "ASC" ? (
                        <ArrowUp className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

