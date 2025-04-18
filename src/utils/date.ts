/**
 * 日付を日本時間（JST）の文字列に変換します
 * @param date - 変換対象の日付（文字列またはDateオブジェクト）
 * @returns 日本時間でフォーマットされた日付文字列
 */
export const formatDateToJST = (date: string | Date): string => {
  return new Date(date).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
};
