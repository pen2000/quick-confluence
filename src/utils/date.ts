/**
 * 日付を日本時間（JST）の文字列に変換します
 * @param date - 変換対象の日付（文字列またはDateオブジェクト）
 * @returns 日本時間でフォーマットされた日付文字列（YYYY/MM/DD(曜日) HH:mm:ss形式）
 */
export const formatDateToJST = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[d.getDay()];

  return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
};
