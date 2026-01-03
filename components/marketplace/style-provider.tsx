"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { BlockStyle } from "@/lib/supabase/types";
import { DEFAULT_STYLE, THEMES, themeToStyleObject } from "@/lib/blocks/themes";

const STORAGE_KEY = "laufblocks-theme-style";

interface StyleContextValue {
  /** Current active style */
  currentStyle: BlockStyle;
  /** Set the active style */
  setStyle: (style: BlockStyle) => void;
  /** Get CSS variables for current style */
  getCssVariables: () => React.CSSProperties;
  /** Get CSS variables for a specific style */
  getCssVariablesFor: (style: BlockStyle) => React.CSSProperties;
}

const StyleContext = createContext<StyleContextValue | null>(null);

interface StyleProviderProps {
  children: ReactNode;
  /** Initial style (overrides localStorage) */
  initialStyle?: BlockStyle;
  /** Whether to persist style to localStorage */
  persist?: boolean;
}

/**
 * StyleProvider Component
 *
 * Provides the current theme style context for block previews.
 * Persists user preference to localStorage.
 */
export function StyleProvider({
  children,
  initialStyle,
  persist = true,
}: StyleProviderProps) {
  const [currentStyle, setCurrentStyle] = useState<BlockStyle>(
    initialStyle ?? DEFAULT_STYLE
  );
  const [mounted, setMounted] = useState(false);

  // Load persisted style on mount
  useEffect(() => {
    setMounted(true);

    if (persist && !initialStyle) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidStyle(stored)) {
        setCurrentStyle(stored as BlockStyle);
      }
    }
  }, [persist, initialStyle]);

  const setStyle = useCallback(
    (style: BlockStyle) => {
      setCurrentStyle(style);

      if (persist) {
        localStorage.setItem(STORAGE_KEY, style);
      }
    },
    [persist]
  );

  const getCssVariables = useCallback(() => {
    return themeToStyleObject(currentStyle);
  }, [currentStyle]);

  const getCssVariablesFor = useCallback((style: BlockStyle) => {
    return themeToStyleObject(style);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <StyleContext.Provider
        value={{
          currentStyle: initialStyle ?? DEFAULT_STYLE,
          setStyle,
          getCssVariables,
          getCssVariablesFor,
        }}
      >
        {children}
      </StyleContext.Provider>
    );
  }

  return (
    <StyleContext.Provider
      value={{
        currentStyle,
        setStyle,
        getCssVariables,
        getCssVariablesFor,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}

/**
 * Hook to access the style context
 */
export function useStyle(): StyleContextValue {
  const context = useContext(StyleContext);

  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }

  return context;
}

/**
 * Validate that a string is a valid BlockStyle
 */
function isValidStyle(value: string): value is BlockStyle {
  return value in THEMES;
}

/**
 * Component that applies theme CSS variables to its children
 */
interface ThemedContainerProps {
  children: ReactNode;
  style?: BlockStyle;
  className?: string;
}

export function ThemedContainer({
  children,
  style,
  className,
}: ThemedContainerProps) {
  const { currentStyle, getCssVariablesFor } = useStyle();
  const activeStyle = style ?? currentStyle;

  return (
    <div style={getCssVariablesFor(activeStyle)} className={className}>
      {children}
    </div>
  );
}
