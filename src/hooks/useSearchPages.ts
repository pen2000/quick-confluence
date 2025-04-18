import { usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";
import { searchPages } from "../api";
import { getNextCursor } from "../utils/url";

const SEARCH_PAGES_LIMIT = 25;

export function useSearchPages(searchText: string, spaceKey: string) {
  return usePromise(
    (searchText: string, spaceKey: string) =>
      async ({ cursor }) => {
        if (!searchText) {
          return { data: [], hasMore: false };
        }
        let cql = `text ~ "${searchText}" and type = page`
        if (spaceKey) {
          cql += ` and space = "${spaceKey}"`
        }
        try {
          const response = await searchPages({
            cql: cql,
            cursor: cursor,
            limit: SEARCH_PAGES_LIMIT,
            excerpt: "highlight",
          });
          const nextCursor = getNextCursor(response._links.next);
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
