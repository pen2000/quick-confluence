/**
 * テキスト内のハイライトタグを指定された文字列に置換します
 * @param text - 置換対象のテキスト
 * @param replacement - 置換後の文字列
 * @returns ハイライトタグが置換されたテキスト
 */
export const replaceHighlightTags = (text: string, replacement: string): string => {
  return text.replace(/@@@hl@@@(.*?)@@@endhl@@@/g, replacement);
};

/**
 * 日付を日本時間（JST）の文字列に変換します
 * @param date - 変換対象の日付（文字列またはDateオブジェクト）
 * @returns 日本時間でフォーマットされた日付文字列
 */
export const formatDateToJST = (date: string | Date): string => {
  return new Date(date).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
};

/**
 * ConfluenceページのURLを生成します
 * @param domain - Confluenceのドメイン
 * @param pageUrl - ページのURLパス
 * @returns 完全なConfluenceページのURL
 */
export const generateConfluenceUrl = (domain: string, pageUrl: string): string => {
  return `https://${domain}/wiki${pageUrl}`;
};
