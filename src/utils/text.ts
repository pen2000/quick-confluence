/**
 * テキスト内のハイライトタグを指定された文字列に置換します
 * @param text - 置換対象のテキスト
 * @param replacement - 置換後の文字列
 * @returns ハイライトタグが置換されたテキスト
 */
export const replaceHighlightTags = (text: string, replacement: string): string => {
  const cleanedText = text.replace(/@@@endhl@@@@@@hl@@@/g, "");
  return cleanedText.replace(/@@@hl@@@(.*?)@@@endhl@@@/g, replacement);
};
