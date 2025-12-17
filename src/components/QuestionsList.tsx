"use client";
import { useEffect, useRef } from "react";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionsHeader from "./QuestionsHeader";
import QuestionRow from "./QuestionRow";

/**
 * ============================================================================
 * QUESTIONS LIST - REMOTE MFE COMPONENT
 * ============================================================================
 * 
 * Uses design tokens from host via CSS variables.
 * Page-level scroll - no internal scrolling container.
 * ============================================================================
 */

export default function QuestionsList() {
  const { questions, loading, error, hasMore, loadMore, setSearch, search, sortBy, sortOrder, setSort } = useQuestions();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll: detect when user scrolls near bottom (page-level)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        root: null, // null = viewport (page-level scroll)
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div 
      className="w-full" 
      style={{
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      {/* Search Header */}
      <QuestionsHeader
        searchQuery={search}
        onSearchChange={setSearch}
        solvedCount={0}
        totalCount={questions.length}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSort}
      />
      
      {error && (
        <div 
          className="flex items-center justify-center py-4" 
          style={{ color: 'var(--color-error)' }}
        >
          Error: {error}
        </div>
      )}
      
      {/* Table Header */}
      <div
        className="flex items-center text-xs font-medium uppercase tracking-wider"
        style={{
          borderBottom: '1px solid var(--border-primary)',
          padding: '0.75rem 1rem',
          paddingLeft: '1.5rem',
          color: 'var(--text-tertiary)',
        }}
      >
        <div className="flex-shrink-0" style={{ width: '60px' }}>
          Status
        </div>
        <div className="flex-shrink-0" style={{ width: '50px' }}>
          #
        </div>
        <div className="flex-1 min-w-0" style={{ paddingRight: '1rem' }}>
          Problem
        </div>
        <div className="flex-shrink-0" style={{ width: '80px' }}>
          Difficulty
        </div>
        <div className="flex-shrink-0" style={{ width: '120px' }}>
          Topic
        </div>
      </div>

      {/* Questions List - no internal scroll */}
      <div>
        {questions.map((question, index) => (
          <QuestionRow key={question.id} question={question} index={index} />
        ))}
        
        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={observerTarget} style={{ height: '20px', padding: '10px' }}>
            {loading && (
              <div 
                className="flex items-center justify-center py-4" 
                style={{ color: 'var(--text-tertiary)' }}
              >
                Loading more questions...
              </div>
            )}
          </div>
        )}
        
        {!hasMore && questions.length > 0 && (
          <div 
            className="flex items-center justify-center py-4" 
            style={{ color: 'var(--text-tertiary)' }}
          >
            No more questions to load
          </div>
        )}
        
        {questions.length === 0 && !loading && (
          <div 
            className="flex items-center justify-center py-12" 
            style={{ color: 'var(--text-tertiary)' }}
          >
            {search ? `No questions found matching "${search}"` : "No questions available"}
          </div>
        )}
        
        {loading && questions.length === 0 && (
          <div 
            className="flex items-center justify-center py-12" 
            style={{ color: 'var(--text-tertiary)' }}
          >
            Loading questions...
          </div>
        )}
      </div>
    </div>
  );
}
