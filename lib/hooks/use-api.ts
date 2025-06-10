"use client";

import { useState, useCallback } from "react";
import { ApiError } from "../api/client";
import { toast } from "react-toastify";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<R>,
      options: UseApiOptions = {}
    ): Promise<R | null> => {
      const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = "Operation completed successfully",
        onSuccess,
        onError,
      } = options;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall();

        setState({
          data: result as T,
          loading: false,
          error: null,
        });

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        onError?.(apiError);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common patterns
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: UseApiOptions = {}
    ): Promise<T | null> => {
      const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = "Operation completed successfully",
        onSuccess,
        onError,
      } = options;

      setLoading(true);
      setError(null);

      try {
        const result = await operation();

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";

        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    execute,
    clearError: () => setError(null),
  };
}
