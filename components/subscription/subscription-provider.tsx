"use client";

import { createContext, useContext } from "react";
import { useSubscription, type SubscriptionState } from "@/hooks/use-subscription";

const SubscriptionContext = createContext<SubscriptionState | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext(): SubscriptionState {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error("useSubscriptionContext must be used within a SubscriptionProvider");
  }

  return context;
}
