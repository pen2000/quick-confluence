import { useState, useEffect } from "react";
import { showToast, Toast } from "@raycast/api";
import { getSpaces } from "../api";
import { ConfluenceSpace } from "../types";

const SPACES_LIMIT = 250;

export function useSpaces() {
  const [spaces, setSpaces] = useState<ConfluenceSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await getSpaces({
          type: "global",
          status: "current",
          limit: SPACES_LIMIT,
        });
        setSpaces(response.results);
      } catch (error) {
        showToast({
          title: "スペースの取得に失敗しました",
          message: error instanceof Error ? error.message : "不明なエラーが発生しました",
          style: Toast.Style.Failure,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSpaces();
  }, []);

  return { spaces, isLoading };
} 