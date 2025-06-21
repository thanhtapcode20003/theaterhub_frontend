"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Loading from "@/components/ui/loading";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingTextState] = useState("Loading...");

  const showLoading = (text?: string) => {
    if (text) setLoadingTextState(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const setLoadingText = (text: string) => {
    setLoadingTextState(text);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        showLoading,
        hideLoading,
        setLoadingText,
      }}
    >
      {children}
      {isLoading && (
        <Loading fullScreen size="lg" variant="primary" text={loadingText} />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Hook for async operations with loading
export const useAsyncOperation = () => {
  const { showLoading, hideLoading } = useLoading();

  const executeWithLoading = async <T,>(
    operation: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      showLoading(loadingText);
      const result = await operation();
      return result;
    } finally {
      hideLoading();
    }
  };

  return { executeWithLoading };
};
