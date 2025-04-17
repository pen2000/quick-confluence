import { ActionPanel, Action, List, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import { searchPages, getSpaces } from "./api";
import { ConfluencePage, ConfluenceSpace } from "./types";
import { useDebounce } from "./hooks/useDebounce";

interface Preferences {
  confluenceEmail: string;
  confluenceApiToken: string;
  confluenceDomain: string;
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pages, setPages] = useState<ConfluencePage[]>([]);
  const [spaces, setSpaces] = useState<ConfluenceSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const preferences = getPreferenceValues<Preferences>();

  // 検索値をデバウンス（400ms）
  const debouncedSearchText = useDebounce(searchText, 400);

  // 初期表示時にspecesを取得
  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await getSpaces();
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

  // 検索値が変更された際にページを初期化
  useEffect(() => {
    setPages([]);
    setCursor(undefined);
    setIsLoading(true);
  }, [debouncedSearchText, selectedSpace]);

  useEffect(() => {
    async function fetchPages() {
      if (!debouncedSearchText) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await searchPages(debouncedSearchText, selectedSpace || undefined, cursor);
        // 重複を防ぐために、既存のページIDをチェック
        const newPages = response.results.filter(
          (page) => !pages.some((existingPage) => existingPage.content.id === page.content.id)
        );
        setPages((prev) => [...prev, ...newPages]);
        setCursor(response._links.next);
      } catch (error) {
        showToast({
          title: "Failed to fetch pages",
          message: error instanceof Error ? error.message : "Unknown error",
          style: Toast.Style.Failure,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPages();
  }, [debouncedSearchText, selectedSpace, cursor]);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Confluence pages..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Space"
          value={selectedSpace}
          onChange={setSelectedSpace}
        >
          <List.Dropdown.Item title="All Spaces" value="" />
          {spaces.map((space) => (
            <List.Dropdown.Item key={space.id} title={space.name} value={space.key} />
          ))}
        </List.Dropdown>
      }
      onSelectionChange={(id) => {
        if (id && cursor) {
          // Load more when reaching the end of the list
          const lastItem = pages[pages.length - 1];
          if (lastItem && lastItem.content.id === id) {
            // Trigger next page load
          }
        }
      }}
    >
      {pages.map((page) => (
        <List.Item
          key={page.content.id}
          title={page.title}
          subtitle={page.excerpt}
          accessories={[
            { tag: { value: page.space?.name || "No space" } },
            { text: page.user?.username || "No user" },
            { date: new Date(page.lastModified) },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://${preferences.confluenceDomain}/wiki${page.url}`} />
              <Action.CopyToClipboard content={page.title} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
