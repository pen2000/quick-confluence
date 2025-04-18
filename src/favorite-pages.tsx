import { ActionPanel, Action, List, getPreferenceValues } from "@raycast/api";
import { Preferences } from "./types";
import { generateConfluenceUrl } from "./utils";
import { useFavoritePages } from "./hooks/useFavoritePages";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const { data: pages = [], isLoading, pagination } = useFavoritePages();

  return (
    <List isLoading={isLoading} pagination={pagination}>
      {pages.map((page) => (
        <List.Item
          key={page.content.id}
          title={page.title}
          subtitle={page.resultGlobalContainer?.title}
          accessories={[{ date: new Date(page.lastModified) }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={generateConfluenceUrl(preferences.confluenceDomain, page.url)} />
              <Action.CopyToClipboard content={generateConfluenceUrl(preferences.confluenceDomain, page.url)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
