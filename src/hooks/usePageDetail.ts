import { useState, useEffect } from "react";
import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";
import { getPageDetail } from "../api";
import TurndownService from "turndown";

export function usePageDetail(pageId: string) {
  const preferences = getPreferenceValues<Preferences>();
  const [pageDetail, setPageDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const turndownService = new TurndownService();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const expand =
          "body.storage,space,history,history.lastUpdated,history.lastUpdated.by,history.lastUpdated.by.profilePicture,metadata.labels";
        const detail = await getPageDetail(pageId, expand);

        // HTMLをマークダウンに変換
        if (detail.body?.storage?.value) {
          const markdown = turndownService.turndown(detail.body.storage.value);
          detail.body.storage.markdown = markdown;
        }

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
