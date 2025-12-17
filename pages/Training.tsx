"use client";
import QuestionsList from "@/components/QuestionsList";
import { useEffect } from "react";

/**
 * ============================================================================
 * TRAINING PAGE - REMOTE MFE
 * ============================================================================
 * 
 * This component is a remote MFE that inherits design tokens from the host.
 * 
 * IMPORTANT: 
 * - Uses CSS variables from host's design-tokens.css
 * - NO local color definitions allowed
 * - Background is transparent to inherit from host Layout
 * 
 * ❌ FORBIDDEN: Hard-coded colors like #000, #fff, hsl(), rgb()
 * ✅ REQUIRED: Use var(--token-name) or inherit from host
 * ============================================================================
 */

export default function Training() {
  useEffect(() => {
    // Ensure dark mode class is applied (host controls this)
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (!root.classList.contains('dark')) {
        root.classList.add('dark');
      }
    }
  }, []);

  return (
    <div 
      className="training-page-wrapper"
      style={{ 
        /* Inherit background from host - uses var(--bg-primary) */
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        minHeight: '100%',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <style jsx global>{`
        /* Input styles using design tokens */
        .training-page-wrapper input {
          background-color: var(--input-bg) !important;
          border: 1px solid var(--input-border) !important;
          color: var(--text-primary) !important;
        }
        .training-page-wrapper input::placeholder {
          color: var(--input-placeholder) !important;
        }
        .training-page-wrapper input:focus {
          outline: 1px solid var(--input-focus-border) !important;
          border-color: var(--input-focus-border) !important;
        }
      `}</style>
      <QuestionsList />
    </div>
  );
}
