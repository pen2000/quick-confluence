import axios, { AxiosInstance } from "axios";
import { getPreferenceValues } from "@raycast/api";
import { ConfluenceSearchResponse, ConfluenceSpacesResponse, Preferences } from "./types";

const PAGES_LIST_LIMIT = 25;

class ConfluenceClient {
  private client: AxiosInstance;
  private preferences: Preferences;

  constructor() {
    this.preferences = getPreferenceValues<Preferences>();
    this.client = axios.create({
      baseURL: `https://${this.preferences.confluenceDomain}/wiki`,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.preferences.confluenceEmail}:${this.preferences.confluenceApiToken}`,
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });
  }

  private async request<T>(method: string, url: string, params?: URLSearchParams): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Confluenceのページを検索します。
   * 
   * @param query - 検索クエリ文字列
   * @param spaceKey - 検索対象のスペースキー（オプション）
   * @param cursor - ページネーション用のカーソル（オプション）
   * @returns 検索結果を含むConfluenceSearchResponseオブジェクト
   * @throws {Error} APIリクエストが失敗した場合
   */
  async searchPages(query: string, spaceKey?: string, cursor?: string): Promise<ConfluenceSearchResponse> {
    const cqlParams = [`text ~ "${query}"`, `type = page`, ...(spaceKey ? [`space = "${spaceKey}"`] : [])];
    const cql = cqlParams.join(" AND ");
    const limit = PAGES_LIST_LIMIT.toString();
    const excerpt = "highlight";
    const params = new URLSearchParams({
      cql,
      limit,
      excerpt,
    });
    if (cursor) {
      params.append("cursor", cursor);
    }

    return this.request<ConfluenceSearchResponse>("GET", "/rest/api/search", params);
  }

  /**
   * Confluenceのスペース一覧を取得します。
   * 
   * @param cursor - ページネーション用のカーソル（オプション）
   * @returns スペース一覧を含むConfluenceSpacesResponseオブジェクト
   * @throws {Error} APIリクエストが失敗した場合
   */
  async getSpaces(cursor?: string): Promise<ConfluenceSpacesResponse> {
    const params = new URLSearchParams({
      type: "global",
      status: "current",
      limit: "250",
    });
    if (cursor) {
      params.append("cursor", cursor);
    }

    return this.request<ConfluenceSpacesResponse>("GET", "/api/v2/spaces", params);
  }
}

const confluenceClient = new ConfluenceClient();

export const searchPages = confluenceClient.searchPages.bind(confluenceClient);
export const getSpaces = confluenceClient.getSpaces.bind(confluenceClient);
