import { usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";
import { getFavoritePages } from "../api";
import { getNextCursor } from "../utils";

const FAVORITE_PAGES_LIMIT = 25;

export function useFavoritePages() {
  return usePromise(
    () =>
      async ({ cursor }: { cursor?: string }) => {
        try {
          const response = await getFavoritePages({
            cursor: cursor,
            limit: FAVORITE_PAGES_LIMIT,
            excerpt: "none",
          });
          const nextCursor = getNextCursor(response._links.next);
          return {
            data: response.results,
            hasMore: !!response._links.next,
            cursor: nextCursor,
          };
        } catch (error) {
          showToast({
            title: "お気に入りページの取得に失敗しました",
            message: error instanceof Error ? error.message : "不明なエラーが発生しました",
            style: Toast.Style.Failure,
          });
          return { data: [], hasMore: false };
        }
      },
    [],
  );
}
