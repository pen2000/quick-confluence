import { usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";
import { getSpaces } from "../api";

const SPACES_LIMIT = 250;

export function useFavoriteSpaces() {
  return usePromise(async () => {
    try {
      const response = await getSpaces({
        status: "current",
        limit: SPACES_LIMIT,
        myFavorite: true,
      });
      return response.results;
    } catch (error) {
      showToast({
        title: "お気に入りスペースの取得に失敗しました",
        message: error instanceof Error ? error.message : "不明なエラーが発生しました",
        style: Toast.Style.Failure,
      });
      return [];
    }
  }, []);
} 