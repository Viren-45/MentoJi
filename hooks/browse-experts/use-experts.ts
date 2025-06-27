// hooks/browse-experts/use-experts.ts
"use client";

import { useState, useEffect } from "react";
import {
  getExperts,
  ExpertWithSettings,
} from "@/lib/browse-experts/expert-service";

export function useExperts() {
  const [experts, setExperts] = useState<ExpertWithSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getExperts();
        setExperts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch experts"
        );
        console.error("Error fetching experts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchExperts();
  }, []);

  return {
    experts,
    loading,
    error,
  };
}
