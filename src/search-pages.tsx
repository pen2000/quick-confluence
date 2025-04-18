import { ActionPanel, Action, List, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import { searchPages, getSpaces } from "./api";
import { Preferences, ConfluenceSpace } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { usePromise } from "@raycast/utils";
import { replaceHighlightTags, formatDateToJST } from "./utils";

const SEARCH_DEBOUNCE_TIME_MS = 400;
const SPACES_LIMIT = 250;
const SEARCH_PAGES_LIMIT = 25;

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [spaces, setSpaces] = useState<ConfluenceSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const preferences = getPreferenceValues<Preferences>();

  // 検索値をデバウンス
  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_TIME_MS);

  // 初期表示時にspecesを取得
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
          title: "Failed to fetch spaces",
          message: error instanceof Error ? error.message : "Unknown error",
          style: Toast.Style.Failure,
        });
      }
    }
    fetchSpaces();
  }, []);

  const { isLoading, data, pagination } = usePromise(
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
            title: "Failed to fetch pages",
            message: error instanceof Error ? error.message : "Unknown error",
            style: Toast.Style.Failure,
          });
          return { data: [], hasMore: false };
        }
      },
    [debouncedSearchText, selectedSpace],
  );

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Confluence pages..."
      searchBarAccessory={
        <List.Dropdown tooltip="Select Space" value={selectedSpace} onChange={setSelectedSpace}>
          <List.Dropdown.Item title="All Spaces" value="" />
          {spaces.map((space) => (
            <List.Dropdown.Item key={space.id} title={space.name} value={space.key} />
          ))}
        </List.Dropdown>
      }
      pagination={pagination}
      isShowingDetail
    >
      {data?.map((page, index) => (
        <List.Item
          key={`${page.content.id}-${index}`}
          title={replaceHighlightTags(page.title, "$1")}
          detail={
            <List.Item.Detail
              markdown={replaceHighlightTags(page.excerpt, "**$1**")}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Title" text={replaceHighlightTags(page.title, "$1")} />
                  <List.Item.Detail.Metadata.Label title="Space" text={page.resultGlobalContainer?.title} />
                  <List.Item.Detail.Metadata.Label title="Last Modified" text={formatDateToJST(page.lastModified)} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://${preferences.confluenceDomain}/wiki${page.url}`} />
              <Action.CopyToClipboard content={`https://${preferences.confluenceDomain}/wiki${page.url}`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
