/**
 * ConfluenceページのURLを生成します
 * @param domain - Confluenceのドメイン
 * @param pageUrl - ページのURLパス
 * @returns 完全なConfluenceページのURL
 */
export const generateConfluenceUrl = (domain: string, pageUrl: string): string => {
  return `https://${domain}/wiki${pageUrl}`;
};

/**
 * 次のページのcursorを取得します
 * @param nextUrl - 次のページのURL
 * @returns 次のページのcursor、存在しない場合はundefined
 */
export const getNextCursor = (nextUrl?: string): string | undefined => {
  if (!nextUrl) return undefined;
  const cursorMatch = nextUrl.match(/cursor=([^&]+)/);
  return cursorMatch ? decodeURIComponent(cursorMatch[1]) : undefined;
};
