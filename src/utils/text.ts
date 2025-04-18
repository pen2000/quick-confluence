/**
 * テキスト内のハイライトタグを指定された文字列に置換します
 * @param text - 置換対象のテキスト
 * @param replacement - 置換後の文字列
 * @returns ハイライトタグが置換されたテキスト
 */
export const replaceHighlightTags = (text: string, replacement: string): string => {
  return text.replace(/@@@hl@@@(.*?)@@@endhl@@@/g, replacement);
};
