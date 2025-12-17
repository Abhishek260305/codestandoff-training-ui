"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { graphqlQuery } from "@/lib/graphql";
import { GET_QUESTIONS_QUERY } from "@/lib/queries";

export interface Question {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  topics: string[];
  testCaseCount: number;
}

interface GetQuestionsResponse {
  getQuestions: {
    questions: Question[];
    totalCount: number;
    hasMore: boolean;
  };
}

export type SortBy = "id" | "difficulty";
export type SortOrder = "ASC" | "DESC";

interface UseQuestionsOptions {
  offset?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  topics?: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

interface UseQuestionsReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  setSearch: (search: string) => void;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  refetch: (options?: UseQuestionsOptions) => void;
}

const DEFAULT_LIMIT = 25;

export function useQuestions(
  initialOptions: UseQuestionsOptions = {}
): UseQuestionsReturn {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(initialOptions.offset || 0);
  const [currentLimit] = useState(initialOptions.limit || DEFAULT_LIMIT);
  const [currentSearch, setCurrentSearch] = useState(initialOptions.search || "");
  const [currentDifficulty, setCurrentDifficulty] = useState(initialOptions.difficulty);
  const [currentTopics, setCurrentTopics] = useState(initialOptions.topics);
  const [currentSortBy, setCurrentSortBy] = useState<SortBy>(initialOptions.sortBy || "id");
  const [currentSortOrder, setCurrentSortOrder] = useState<SortOrder>(initialOptions.sortOrder || "ASC");
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuestions = useCallback(
    async (offset: number, append: boolean = false, searchOverride?: string) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const searchValue = searchOverride !== undefined ? searchOverride : currentSearch;
        
        // Build input object matching GetQuestionsRequest
        const input: {
          offset?: number;
          limit?: number;
          search?: string;
          difficulty?: string;
          topics?: string[];
          sortBy?: string;
          sortOrder?: string;
        } = {
          offset,
          limit: currentLimit,
        };
        
        if (searchValue && searchValue.trim()) {
          input.search = searchValue.trim();
        }
        if (currentDifficulty) {
          input.difficulty = currentDifficulty;
        }
        if (currentTopics && currentTopics.length > 0) {
          input.topics = currentTopics;
        }
        // Always include sort parameters (they have defaults)
        input.sortBy = currentSortBy;
        input.sortOrder = currentSortOrder;

        const response = await graphqlQuery<GetQuestionsResponse>(
          GET_QUESTIONS_QUERY,
          { input },
          "GetQuestions"
        );

        if (response.errors) {
          console.error("GraphQL errors:", response.errors);
          console.error("Request input:", input);
          throw new Error(response.errors[0]?.message || "Failed to fetch questions");
        }

        if (response.data) {
          const result = response.data.getQuestions;
          const newQuestions = result?.questions || [];
          
          if (append) {
            setQuestions((prev) => [...prev, ...newQuestions]);
          } else {
            setQuestions(newQuestions);
          }

          setHasMore(result?.hasMore ?? false);
          setCurrentOffset(offset);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch questions";
        setError(errorMessage);
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    [currentLimit, currentSearch, currentDifficulty, currentTopics, currentSortBy, currentSortOrder]
  );

  // Initial load
  useEffect(() => {
    fetchQuestions(0, false);
  }, []);

  // Re-fetch when filters change (except search which has debounce)
  useEffect(() => {
    setQuestions([]);
    setCurrentOffset(0);
    setHasMore(true);
    fetchQuestions(0, false);
  }, [currentDifficulty, currentTopics?.join(','), currentSortBy, currentSortOrder]);

  // Debounced search
  const setSearch = useCallback((search: string) => {
    setCurrentSearch(search);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      setQuestions([]);
      setCurrentOffset(0);
      setHasMore(true);
      fetchQuestions(0, false, search);
    }, 300);
  }, [fetchQuestions]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isLoadingRef.current) {
      const nextOffset = currentOffset + currentLimit;
      fetchQuestions(nextOffset, true);
    }
  }, [loading, hasMore, currentOffset, currentLimit, fetchQuestions]);

  const setSort = useCallback((sortBy: SortBy, sortOrder: SortOrder) => {
    setCurrentSortBy(sortBy);
    setCurrentSortOrder(sortOrder);
    setQuestions([]);
    setCurrentOffset(0);
    setHasMore(true);
  }, []);

  const refetch = useCallback(
    (options?: UseQuestionsOptions) => {
      if (options?.search !== undefined) {
        setCurrentSearch(options.search);
      }
      if (options?.difficulty !== undefined) {
        setCurrentDifficulty(options.difficulty);
      }
      if (options?.topics !== undefined) {
        setCurrentTopics(options.topics);
      }
      if (options?.sortBy !== undefined) {
        setCurrentSortBy(options.sortBy);
      }
      if (options?.sortOrder !== undefined) {
        setCurrentSortOrder(options.sortOrder);
      }
      setCurrentOffset(options?.offset || 0);
      setQuestions([]);
      setHasMore(true);
      fetchQuestions(options?.offset || 0, false);
    },
    [fetchQuestions]
  );

  return {
    questions,
    loading,
    error,
    hasMore,
    loadMore,
    setSearch,
    search: currentSearch,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    setSort,
    refetch,
  };
}
