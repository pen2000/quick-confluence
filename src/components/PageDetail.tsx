import { Detail, ActionPanel, Action } from "@raycast/api";
import { usePageDetail } from "../hooks/usePageDetail";
import { generateConfluenceUrl, generateProfilePictureUrl } from "../utils/url";
import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";
import { formatDateToJST } from "../utils/date";

interface PageDetailProps {
  pageId: string;
  onBack: () => void;
}

export function PageDetail({ pageId, onBack }: PageDetailProps) {
  const preferences = getPreferenceValues<Preferences>();
  const { pageDetail, isLoading } = usePageDetail(pageId);

  if (isLoading) {
    return <Detail isLoading={true} navigationTitle="ページ詳細" />;
  }

  if (!pageDetail) {
    return <Detail markdown="ページの詳細を取得できませんでした。" navigationTitle="ページ詳細" />;
  }

  const markdown = `
${pageDetail.body?.storage?.value || "コンテンツがありません。"}
  `;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={pageDetail.title}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="スペース" text={pageDetail.space?.name} />
          <Detail.Metadata.Label title="作成者" text={pageDetail.history?.createdBy?.displayName} icon={generateProfilePictureUrl(preferences.confluenceDomain, pageDetail.history?.createdBy?.profilePicture?.path)} />
          <Detail.Metadata.Label title="作成日" text={formatDateToJST(pageDetail.history?.createdDate)} />
          <Detail.Metadata.Label title="最終更新者" text={pageDetail.history?.lastUpdated?.by?.displayName} icon={generateProfilePictureUrl(preferences.confluenceDomain, pageDetail.history?.lastUpdated?.by?.profilePicture?.path)} />
          <Detail.Metadata.Label title="最終更新日" text={formatDateToJST(pageDetail.history?.lastUpdated?.when)} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action title="戻る" onAction={onBack} />
          <Action.OpenInBrowser url={generateConfluenceUrl(preferences.confluenceDomain, pageDetail._links?.webui)} />
          <Action.CopyToClipboard content={generateConfluenceUrl(preferences.confluenceDomain, pageDetail._links?.webui)} />
        </ActionPanel>
      }
    />
  );
} 