import { usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";
import { searchPages } from "../api";
import { getNextCursor } from "../utils/url";

const FAVORITE_PAGES_LIMIT = 200;

export function useFavoritePages() {
  return usePromise(
    () =>
      async ({ cursor }: { cursor?: string }) => {
        try {
          const response = await searchPages({
            cql: "favourite = currentUser() and type = page order by created desc, title",
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
