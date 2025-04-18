import { ActionPanel, Action, List, getPreferenceValues } from "@raycast/api";
import { useState } from "react";
import { Preferences } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { useSpaces } from "./hooks/useSpaces";
import { useSearchPages } from "./hooks/useSearchPages";
import { replaceHighlightTags, formatDateToJST } from "./utils";

const SEARCH_DEBOUNCE_TIME_MS = 400;

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const preferences = getPreferenceValues<Preferences>();

  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_TIME_MS);
  const { spaces, isLoading: isLoadingSpaces } = useSpaces();
  const { isLoading: isLoadingPages, data, pagination } = useSearchPages(debouncedSearchText, selectedSpace);

  return (
    <List
      isLoading={isLoadingSpaces || isLoadingPages}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Confluenceページを検索..."
      searchBarAccessory={
        <List.Dropdown tooltip="スペースを選択" value={selectedSpace} onChange={setSelectedSpace}>
          <List.Dropdown.Item title="すべてのスペース" value="" />
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
              // markdown={replaceHighlightTags(page.excerpt, "**$1**")}
              markdown={page.excerpt}
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
              <Action.OpenInBrowser url={`https://${preferences.confluenceDomain}/wiki${page.url}`} />
              <Action.CopyToClipboard content={`https://${preferences.confluenceDomain}/wiki${page.url}`} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
