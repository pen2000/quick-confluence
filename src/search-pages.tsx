import { ActionPanel, Action, List, getPreferenceValues, showToast, Toast, useNavigation, Icon } from "@raycast/api";
import { useState, useEffect } from "react";
import { Preferences } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { useSearchPages } from "./hooks/useSearchPages";
import { replaceHighlightTags } from "./utils/text";
import { formatDateToJST } from "./utils/date";
import { generateConfluenceUrl } from "./utils/url";
import { useFavoriteSpaces } from "./hooks/useFavoriteSpaces";
import { useNonFavoriteSpaces } from "./hooks/useNonFavoriteSpaces";
import { PageDetail } from "./components/PageDetail";

const SEARCH_DEBOUNCE_TIME_MS = 400;

export default function Command() {
  const { push } = useNavigation();
  const preferences = getPreferenceValues<Preferences>();
  const [searchText, setSearchText] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [toast, setToast] = useState<Toast | null>(null);

  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_TIME_MS);
  const { data: favoriteSpaces = [], isLoading: isLoadingFavoriteSpaces } = useFavoriteSpaces();
  const { data: nonFavoriteSpaces = [], isLoading: isLoadingNonFavoriteSpaces } = useNonFavoriteSpaces();
  const { data: pages = [], isLoading: isLoadingPages, pagination } = useSearchPages(debouncedSearchText, selectedSpace);

  useEffect(() => {
    const showLoadingToast = async () => {
      if (isLoadingFavoriteSpaces || isLoadingNonFavoriteSpaces) {
        const newToast = await showToast({
          style: Toast.Style.Animated,
          title: "スペース情報を読み込み中...",
        });
        setToast(newToast);
      } else if (toast) {
        toast.hide();
        setToast(null);
      }
    };

    showLoadingToast();
  }, [isLoadingFavoriteSpaces, isLoadingNonFavoriteSpaces]);

  if (selectedPageId) {
    return <PageDetail pageId={selectedPageId} />;
  }

  return (
    <List
      isLoading={isLoadingFavoriteSpaces || isLoadingNonFavoriteSpaces || isLoadingPages}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Confluenceページを検索..."
      searchBarAccessory={
        <List.Dropdown tooltip="スペースを選択" value={selectedSpace} onChange={setSelectedSpace}>
          <List.Dropdown.Item title="すべてのスペース" value="" />
          <List.Dropdown.Section title="★Favorites">
            {favoriteSpaces.map((space) => (
              <List.Dropdown.Item key={space.id} title={space.name} value={space.key} />
            ))}
          </List.Dropdown.Section>
          {nonFavoriteSpaces.map((space) => (
            <List.Dropdown.Item key={space.id} title={space.name} value={space.key} />
          ))}
        </List.Dropdown>
      }
      pagination={pagination}
      isShowingDetail
    >
      {pages?.map((page, index) => (
        <List.Item
          key={`${page.content.id}-${index}`}
          title={replaceHighlightTags(page.title, "$1")}
          detail={
            <List.Item.Detail
              markdown={replaceHighlightTags(page.excerpt, "**$1**")}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="タイトル" text={replaceHighlightTags(page.title, "$1")} />
                  <List.Item.Detail.Metadata.Label title="スペース" text={page.resultGlobalContainer?.title} />
                  <List.Item.Detail.Metadata.Label title="最終更新日" text={formatDateToJST(page.lastModified)} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <Action title="詳細を表示" onAction={() => push(<PageDetail pageId={page.content.id} />)} icon={Icon.Paragraph} />
              <Action.OpenInBrowser title="ブラウザで開く" url={generateConfluenceUrl(preferences.confluenceDomain, page.url)} />
              <Action.CopyToClipboard title="URLをコピー" content={generateConfluenceUrl(preferences.confluenceDomain, page.url)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
