import { useState, useEffect } from "react";
import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";
import { getPageDetail } from "../api";

export function usePageDetail(pageId: string) {
  const preferences = getPreferenceValues<Preferences>();
  const [pageDetail, setPageDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const expand = "space,history,history.lastUpdated,history.lastUpdated.by,history.lastUpdated.by.profilePicture";
        const detail = await getPageDetail(pageId, expand);
        setPageDetail(detail);
      } catch (error) {
        console.error("Failed to fetch page detail:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (pageId) {
      fetchDetail();
    }
  }, [pageId, preferences.confluenceDomain]);

  return { pageDetail, isLoading };
}
