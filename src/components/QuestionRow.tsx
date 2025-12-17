"use client";
import { Check } from "lucide-react";
import type { Question } from "@/hooks/useQuestions";

/**
 * ============================================================================
 * QUESTION ROW - REMOTE MFE COMPONENT
 * ============================================================================
 * 
 * Uses design tokens from host via CSS variables.
 * 
 * ❌ FORBIDDEN: Hard-coded colors like hsl(), #hex, rgb()
 * ✅ REQUIRED: var(--token-name) from design-tokens.css
 * ============================================================================
 */

interface QuestionRowProps {
  question: Question;
  index: number;
  solved?: boolean;
}

export default function QuestionRow({ question, index, solved = false }: QuestionRowProps) {
  const isOdd = index % 2 === 0;
  // Use token-based backgrounds: transparent or tertiary for alternating rows
  const rowBgColor = isOdd ? 'transparent' : 'var(--bg-tertiary)';
  
  return (
    <div
      className="flex items-center cursor-pointer"
      style={{
        backgroundColor: rowBgColor,
        padding: '0.75rem 1rem',
        margin: '0 0.5rem',
        borderRadius: '0.5rem',
      }}
    >
      {/* Status - completed or not */}
      <div 
        className="flex items-center flex-shrink-0" 
        style={{ width: '60px' }}
      >
        {solved ? (
          <Check className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
        ) : (
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ border: '2px solid var(--border-secondary)' }} 
          />
        )}
      </div>

      {/* Question Number */}
      <div 
        className="flex-shrink-0 text-sm" 
        style={{ width: '50px', color: 'var(--text-tertiary)' }}
      >
        {question.id}.
      </div>

      {/* Question Title */}
      <div className="flex-1 min-w-0" style={{ paddingRight: '1rem' }}>
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {question.title}
        </span>
      </div>

      {/* Difficulty - uses semantic status colors */}
      <div 
        className="text-sm font-medium flex-shrink-0"
        style={{
          color: question.difficulty === "Easy" 
            ? 'var(--color-success)' 
            : question.difficulty === "Med." 
            ? 'var(--color-warning)' 
            : 'var(--color-error)',
          width: '80px'
        }}
      >
        {question.difficulty}
      </div>

      {/* Topics - show first topic if available, truncated */}
      <div 
        className="text-sm truncate flex-shrink-0" 
        style={{ 
          color: 'var(--text-tertiary)',
          width: '120px'
        }}
        title={question.topics && question.topics.length > 0 ? question.topics[0] : '-'}
      >
        {question.topics && question.topics.length > 0 ? question.topics[0] : '-'}
      </div>
    </div>
  );
}
