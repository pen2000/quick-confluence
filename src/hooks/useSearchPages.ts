import { usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";
import { searchPages } from "../api";

const SEARCH_PAGES_LIMIT = 25;

export function useSearchPages(searchText: string, spaceKey: string) {
  return usePromise(
    (searchText: string, spaceKey: string) =>
      async ({ cursor }) => {
        if (!searchText) {
          return { data: [], hasMore: false };
        }
        try {
          const response = await searchPages({
            query: searchText,
            spaceKey: spaceKey || undefined,
            cursor: cursor,
            limit: SEARCH_PAGES_LIMIT,
            excerpt: "highlight",
          });
          const nextUrl = response._links.next;
          const cursorMatch = nextUrl?.match(/cursor=([^&]+)/);
          const nextCursor = cursorMatch ? decodeURIComponent(cursorMatch[1]) : undefined;
          return {
            data: response.results,
            hasMore: !!response._links.next,
            cursor: nextCursor,
          };
        } catch (error) {
          showToast({
            title: "ページの検索に失敗しました",
            message: error instanceof Error ? error.message : "不明なエラーが発生しました",
            style: Toast.Style.Failure,
          });
          return { data: [], hasMore: false };
        }
      },
    [searchText, spaceKey],
  );
}
